const {Product, Category, User} = require('../models');
const {validationResult} = require('express-validator');
const {StockAdjustment} = require('../models');

exports.getAllProducts = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId;
        console.log("categoryId:", categoryId);
        const options = {
            include: [{
                model: Category,
                as: 'category'
            }]
        };

        if (categoryId) {
            options.where = {categoryId: categoryId};
        }

        const products = await Product.findAll(options);
        res.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const {name, description, price, stock, imageUrl, categoryId} = req.body;
        const product = await Product.create({name, description, price, stock, imageUrl, categoryId});
        res.status(201).json(product);
    } catch (error) {
        next(error);
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

        const {name, description, price, stock, imageUrl, categoryId} = req.body;
        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (price !== undefined) fieldsToUpdate.price = price;
        if (stock !== undefined) fieldsToUpdate.stock = stock;
        if (imageUrl !== undefined) fieldsToUpdate.imageUrl = imageUrl;
        if (categoryId !== undefined) fieldsToUpdate.categoryId = categoryId;

        await product.update(fieldsToUpdate);
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

        product.stock += parsedAdjustment;
        await product.save();

        await StockAdjustment.create({
            productId,
            change: parsedAdjustment,
            justification
        });

        res.json({ message: "Stock mis à jour avec succès." });
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
