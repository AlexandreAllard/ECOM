const {StockAdjustment, Product} = require("../models");
const newSubscriptionController = require('./newSubscriptionController');

const {validationResult} = require('express-validator');

exports.getStockAdjustments = async (req, res) => {
    try {
        const adjustments = await StockAdjustment.findAll();

        res.status(200).json(adjustments);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getStockAdjustment = async (req, res) => {
    try {
        const adjustment = await StockAdjustment.findByPk(req.params.id);

        if (!adjustment) {
            return res.sendStatus(404);
        }

        res.status(200).json(adjustment);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getProductStockAdjustments = async (req, res) => {
    const {id: productId} = req.params;

    try {
        const stockAdjustments = await StockAdjustment.findAll({where: {productId}});

        if (!stockAdjustments) {
            return res.sendStatus(404);
        }

        res.status(200).json(stockAdjustments);
    } catch (error) {
        res.sendStatus(500);
    }
};


exports.createStockAdjustment = async (req, res) => {
    const { id: productId } = req.params;
    const { change, justification } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.sendStatus(400);
    }

    try {
        const parsedAdjustment = parseInt(change, 10);

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.sendStatus(404);
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
            newSubscriptionController.notifyUsers('stock_change', productId, {
                subject: `Réassort du produit ${product.name}`,
                message: `Le produit ${product.name} est de nouveau en stock!`
            });
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};
