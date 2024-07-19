const {Category} = require('../models');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.sendStatus(404);
        }
        res.status(200).json(category);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.createCategory = async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.sendStatus(400);
        }

        await Category.create({name});
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.sendStatus(400);
        }

        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.sendStatus(404);
        }

        category.name = req.body.name;
        await category.save();

        res.status(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.sendStatus(404);
        }

        await category.destroy();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};
