const {Product, Category} = require('../models');
const newSubscriptionController = require('./newSubscriptionController');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {validationResult} = require('express-validator');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404);
        }

        res.status(200).json(product);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(422);
        }

        const {name, description, price, brand, stock, imageUrl, categoryId} = req.body;

        const product = await Product.create({name, description, price, brand, stock, imageUrl, categoryId});

        const stripeProduct = await stripe.products.create({name, description, images: [imageUrl]});
        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: price * 100,
            currency: 'eur'
        });

        newSubscriptionController.notifyUsers('new_product', categoryId, {
            subject: `Nouveau produit ajouté dans votre catégorie suivie`,
            message: `Découvrez notre nouveau produit: ${name}!`
        });

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(422);
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }

        const {name, description, price, stock, imageUrl, categoryId, brand} = req.body;
        const fieldsToUpdate = {name, description, price, stock, imageUrl, categoryId, brand};
        const oldPrice = product.price;

        await product.update(fieldsToUpdate);

        if (price < oldPrice) {
            newSubscriptionController.notifyUsers('price_change', product.id, {
                subject: `Baisse de prix pour ${product.name}`,
                message: `Le prix de ${product.name} a baissé de ${oldPrice} à ${price}.`
            });
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.sendStatus(404);
        }

        await product.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
};
