const {Product, Category, User} = require('../models');
const {validationResult} = require('express-validator');
const {StockAdjustment} = require('../models');
const SubscriptionController = require('./subscriptionController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Sequelize = require('sequelize');
const ProductMongo = require('../models/ProductMongo');

exports.getAllProducts = async (req, res, next) => {
    try {
        const { categoryId, productName, brand, minPrice, maxPrice, inStock } = req.query;

        const options = {
            include: [{ model: Category, as: 'category' }],
            where: {}
        };

        if (categoryId) {
            options.where.categoryId = categoryId;
        }

        if (productName) {
            options.where.name = { [Sequelize.Op.iLike]: `%${productName}%` };
        }

        if (brand) {
            options.where.brand = brand;
        }

        if (minPrice) {
            options.where.price = { [Sequelize.Op.gte]: parseFloat(minPrice) };
        }
        if (maxPrice) {
            if (options.where.price) {
                options.where.price[Sequelize.Op.lte] = parseFloat(maxPrice);
            } else {
                options.where.price = { [Sequelize.Op.lte]: parseFloat(maxPrice) };
            }
        }

        if (inStock !== undefined) {
            options.where.stock = inStock === 'true' ? { [Sequelize.Op.gt]: 0 } : { [Sequelize.Op.eq]: 0 };
        }

        const products = await Product.findAll(options);
        res.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).send("Internal server error");
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { name, description, price, brand, stock, imageUrl, categoryId } = req.body;

        const product = await Product.create({ name, description, price, brand, stock, imageUrl, categoryId });

        const stripeProduct = await stripe.products.create({
            name,
            description,
            images: [imageUrl]
        });

        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: price * 100,
            currency: 'eur'
        });

        SubscriptionController.notifyUsersBySubscriptionType('new_product', categoryId, {
            subject: `Nouveau produit ajouté dans votre catégorie suivie`,
            message: `Découvrez notre nouveau produit: ${name}!`
        });

        res.status(201).json({
            message: "Produit créé avec succès",
            product: product,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
        if (!product) {
            return res.sendStatus(404);
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }

        const {name, description, price, stock, imageUrl, categoryId, brand} = req.body;
        const oldPrice = product.price;
        const fieldsToUpdate = {name, description, price, stock, imageUrl, categoryId, brand};

        await product.update(fieldsToUpdate);

        if (price < oldPrice) {
            SubscriptionController.notifyUsersBySubscriptionType('price_change', product.id, {
                subject: `Baisse de prix pour ${product.name}`,
                message: `Le prix de ${product.name} a baissé de ${oldPrice} à ${price}.`
            });
        } else {
            console.log(`No price decrease for ${product.name}, no notification sent.`);
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedRows = await Product.destroy({where: {id: req.params.id}});
        if (deletedRows === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

exports.updateProductStock = async (req, res) => {
    const { id: productId } = req.params;
    const { adjustment, justification } = req.body;

    try {
        const parsedAdjustment = parseInt(adjustment, 10);
        if (isNaN(parsedAdjustment)) {
            return res.status(400).json({ message: "Invalid adjustment value provided." });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        const wasOutOfStock = product.stock <= 0;
        product.stock += parsedAdjustment;
        await product.save();

        await StockAdjustment.create({
            productId,
            change: parsedAdjustment,
            justification
        });

        if (wasOutOfStock && product.stock > 0) {
            SubscriptionController.notifyUsersBySubscriptionType('stock_change', productId, {
                subject: `Réassort du produit ${product.name}`,
                message: `Le produit ${product.name} est de nouveau en stock!`
            });
        }

        res.json({ message: "Stock mis à jour avec succès.", product });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du stock :", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du stock." });
    }
};

exports.getStockAdjustments = async (req, res) => {
    const {id: productId} = req.params;

    try {
        const stockAdjustments = await StockAdjustment.findAll({
            where: {productId},
            include: [{ model: Product, as: 'product' }]
        });

        res.json(stockAdjustments);
    } catch (error) {
        console.error("Erreur lors de la récupération des ajustements de stock :", error);
        res.status(500).json({message: "Erreur serveur lors de la récupération des ajustements de stock."});
    }
};

exports.getStockAdjustment = async (req, res) => {
    const {adjustmentId} = req.params;

    try {
        const stockAdjustment = await StockAdjustment.findByPk(adjustmentId, {
            include: [{model: Product, as: 'product'}]
        });

        if (!stockAdjustment) {
            return res.status(404).json({message: "Ajustement de stock non trouvé."});
        }

        res.json(stockAdjustment);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'ajustement de stock :", error);
        res.status(500).json({message: "Erreur serveur lors de la récupération de l'ajustement de stock."});
    }
};

exports.getAllStockAdjustments = async (req, res) => {
    try {
        const stockAdjustments = await StockAdjustment.findAll({
            include: [{model: Product, as: 'product'}]
        });

        res.json(stockAdjustments);
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les ajustements de stock :", error);
        res.status(500).json({message: "Erreur serveur lors de la récupération des ajustements de stock."});
    }
};

exports.searchProducts = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        // Utilisation de MongoDB pour la recherche
        const filters = {
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
            ]
        };

        const products = await ProductMongo.find(filters).exec(); // Assurez-vous d'utiliser exec() pour exécuter la requête

        res.json(products);
    } catch (error) {
        console.error("Error searching products in MongoDB:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
