const { Category } = require('../models');
const { validationResult } = require('express-validator');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.sendStatus(404);
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { name, description } = req.body;
        const categoryToUpdate = await Category.findByPk(req.params.id);
        if (!categoryToUpdate) {
            return res.sendStatus(404);
        }

        if (name !== undefined) categoryToUpdate.name = name;
        if (description !== undefined) categoryToUpdate.description = description;

        await categoryToUpdate.save();
        res.json(categoryToUpdate);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const deletedRows = await Category.destroy({ where: { id: req.params.id } });
        if (deletedRows === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
