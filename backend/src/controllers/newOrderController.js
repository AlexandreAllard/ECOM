const {Order, Product, OrderItem, Delivery, Cart, CartItem} = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const OrderMongo = require('../models/OrderMongo');
const OrderItemMongo = require('../models/OrderItemMongo');
const ProductMongo = require('../models/ProductMongo');

exports.getOrders = async (req, res) => {
    let filters = {};

    if (req.query.userId && (req.user.role === 'admin' && req.user.role === 'storekeeper')) {
        filters.userId = req.query.userId;
    } else if (req.user.role !== 'admin' && req.user.role !== 'storekeeper') {
        filters.userId = req.user.id;
    }

    try {
        const orders = await Order.findAll({
            where: filters,
            order: [['createdAt', 'DESC']],
            include: [{
                model: OrderItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.sendStatus(500);
    }
};

exports.getOrder = async (req, res) => {
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
    const userId = req.user.id;

    try {
        const order = await Order.findByPk(req.params.id);

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

exports.refundOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.sendStatus(404);
        }

        /*  if (order.status !== 'completed' && order.status !== 'asked_refund') {
              return res.sendStatus(400);
          }*/

        const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
        });

        order.status = 'refunded';
        await order.save();

        res.sendStatus(200);
    } catch (error) {
        console.error("Error processing refund:", error);
        res.status(500).json({error: error.message});
    }
};

exports.searchOrders = async (req, res) => {
    try {
        const { search } = req.query;

        let orders;

        if (!search) {
            // Si pas de terme de recherche, retourne toutes les commandes
            orders = await OrderMongo.find().exec();
        } else {
            const products = await ProductMongo.find({
                name: { $regex: search, $options: 'i' }
            }).exec();

            const productIds = products.map(product => product._id);

            const orderItems = await OrderItemMongo.find({
                productId: { $in: productIds }
            }).exec();

            const orderIdsFromItems = orderItems.map(item => item.orderId);

            orders = await OrderMongo.find({
                $or: [
                    { _id: { $regex: search, $options: 'i' } },
                    { _id: { $in: orderIdsFromItems } }
                ]
            }).exec();
        }

        const detailedOrders = await Promise.all(orders.map(async order => {
            const items = await OrderItemMongo.find({ orderId: order._id }).exec();
            const populatedItems = await Promise.all(items.map(async item => {
                const product = await ProductMongo.findById(item.productId).exec();
                return { ...item.toObject(), product };
            }));
            return { ...order.toObject(), items: populatedItems };
        }));

        res.json(detailedOrders);
    } catch (error) {
        console.error("Error searching orders:", error);
        res.sendStatus(500);
    }
};
