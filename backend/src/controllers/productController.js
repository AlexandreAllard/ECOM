const { Product, Category } = require('../models');
const { validationResult } = require('express-validator');

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
            options.where = { categoryId: categoryId };
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
            return res.status(422).json({ errors: errors.array() });
        }

        const { name, description, price, stock, imageUrl, categoryId } = req.body;
        const product = await Product.create({ name, description, price, stock, imageUrl, categoryId });
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
            return res.status(422).json({ errors: errors.array() });
        }

        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.sendStatus(404);
        }

        const { name, description, price, stock, imageUrl, categoryId } = req.body;
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
        const deletedRows = await Product.destroy({ where: { id: req.params.id } });
        if (deletedRows === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
