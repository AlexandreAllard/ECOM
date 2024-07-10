const {Order, Product, OrderItem} = require('../models');
const PdfPrinter = require('pdfmake');
const fs = require('fs');

exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.findAll({
            where: { userId },
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

        if (!orders.length) {
            return res.status(404).json({ message: 'Aucune commande trouvée pour cet utilisateur.' });
        }

        const transformedOrders = orders.map(order => ({
            ...order.toJSON(),
            items: order.items.map(item => ({
                ...item.toJSON(),
                product: item.product.toJSON()
            }))
        }));

        res.status(200).json(transformedOrders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
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

        if (!orders.length) {
            return res.status(404).json({ message: 'Aucune commande trouvée.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findOne({
            where: { id: orderId },
            include: [{
                model: OrderItem,
                as: 'items'
            }]
        });

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée ou vous n'avez pas le droit de modifier cette commande." });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Statut de la commande mis à jour avec succès.', order });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
        res.status(500).json({ message: 'Erreur interne du serveur lors de la mise à jour du statut de la commande.' });
    }
};
