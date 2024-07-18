const {Order, Product, OrderItem} = require('../models');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getOrderById = async (req, res) => {
    const isAdmin = req.user.isAdmin;

    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!order) {
            return res.sendStatus(404);
        }

        if (order.req.user.id !== req.user.id && !isAdmin) {
            return res.sendStatus(403);
        }

        res.status(200).json(order);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {userId: req.params.id},
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.requestRefund = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.sendStatus(404);
        }

        if (order.userId !== userId && !req.user.isAdmin) {
            return res.sendStatus(403);
        }

        if (order.status !== 'completed') {
            return res.sendStatus(400);
        }

        order.status = 'asked_refund';
        await order.save();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};

