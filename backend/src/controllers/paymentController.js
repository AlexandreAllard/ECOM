const { Cart, CartItem, Product, Order, OrderItem, sequelize } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getCartTotal, clearCart } = require('./cartController');

async function createPaymentIntent(total, userId) {
    try {
        return await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'eur',
            payment_method_types: ['card'],
            metadata: { userId }
        });
    } catch (error) {
        console.error("Stripe PaymentIntent creation failed:", error);
        throw error;
    }
}

exports.createOrderAndProcessPayment = async (req, res) => {
    const { id: userId } = req.user || {};

    const userCart = await Cart.findOne({ where: { userId } });
    if (!userCart) {
        return res.status(400).json({ message: "Panier introuvable pour l'utilisateur." });
    }

    const total = await getCartTotal(userId);
    if (total <= 0) {
        return res.status(400).json({ message: "Le panier est vide ou le montant est invalide." });
    }

    try {
        const paymentIntent = await createPaymentIntent(total, userId);
        return res.status(201).json({
            message: 'Intention de paiement créée avec succès',
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        return res.status(500).json({ message: "Échec de la création de l'intention de paiement.", error: error.message });
    }
};

exports.finalizePayment = async (req, res) => {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
        return res.status(400).json({ message: "PaymentIntent ID is required." });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not confirmed" });
    }

    const userId = paymentIntent.metadata.userId;
    const transaction = await sequelize.transaction();
    try {
        const order = await createOrder(userId, paymentIntent.id, transaction);
        console.log("Before calling clearCart");
        await clearCart(userId, transaction);
        await transaction.commit();
        return res.status(200).json({ message: 'Order created and cart cleared', order });
    } catch (error) {
        await transaction.rollback();
        console.error("Error during transaction:", error);
        return res.status(500).json({
            message: "Internal server error during database transaction.",
            error: error.message
        });
    }
};

async function createOrder(userId, paymentIntentId, transaction) {
    const userCart = await Cart.findOne({
        where: { userId },
        transaction
    });

    if (!userCart) {
        throw new Error("Cart not found.");
    }

    const cartItems = await CartItem.findAll({
        where: { cartId: userCart.id },
        include: ['product'],
        transaction
    });

    if (!cartItems.length) {
        throw new Error('No items in cart.');
    }

    const total = cartItems.reduce((acc, item) => acc + (item.quantity * parseFloat(item.product.price)), 0);

    const order = await Order.create({
        userId,
        total,
        status: 'completed',
        paymentIntentId
    }, { transaction });

    for (const item of cartItems) {
        await OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
        }, { transaction });
    }

    await userCart.destroy({ transaction });
    return order;
}

exports.verifyPaymentStatus = async (req, res) => {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
        return res.status(400).json({ success: false, message: "L'ID de l'intention de paiement est requis." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            const userId = paymentIntent.metadata.userId;
            const transaction = await sequelize.transaction();
            try {
                const order = await createOrder(userId, paymentIntentId, transaction);
                await transaction.commit();
                res.status(200).json({ success: true, message: 'Commande créée avec succès.', order });
            } catch (error) {
                await transaction.rollback();
                res.status(500).json({
                    success: false,
                    message: "Erreur interne du serveur lors de la création de la commande.", error: error.toString()
                });
            }
        } else {
            res.status(400).json({ success: false, message: 'Le paiement n’a pas été confirmé.' });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du statut de paiement:", error);
        return res.status(500).json({ success: false, message: "Erreur interne du serveur", error: error.toString() });
    }
};

exports.refundOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (order.status !== 'completed' && order.status !== 'asked_refund') {
            return res.status(400).json({ message: "Seules les commandes terminées peuvent être remboursées" });
        }

        const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
        });

        order.status = 'refunded';
        await order.save();

        res.status(200).json({ message: "Remboursement effectué avec succès", refund });
    } catch (error) {
        console.error("Erreur lors du remboursement de la commande:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};
