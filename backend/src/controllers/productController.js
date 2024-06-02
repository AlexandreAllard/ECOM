const { Product, Category } = require('../models');
const { validationResult } = require('express-validator');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({ include: Category });
        res.json(products);
    } catch (error) {
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
        const product = await Product.findByPk(req.params.id, { include: Category });
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

        const { name, description, price, stock, imageUrl, categoryId } = req.body;
        const [updatedRows] = await Product.update(
            { name, description, price, stock, imageUrl, categoryId },
            { where: { id: req.params.id } }
        );
        if (updatedRows === 0) {
            return res.sendStatus(404);
        }
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
