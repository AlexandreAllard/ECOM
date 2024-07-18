const {Subscription, User, Product} = require('../models');
const emailService = require('../services/emailService');

exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'description', 'price', 'stock']
            }]
        });
        res.status(200).json(subscriptions);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getUserSubscriptions = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.sendStatus(400);
        }

        const subscriptions = await Subscription.findAll({
            where: {userId: req.params.id},
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'description', 'price', 'stock']
            }]
        });

        res.status(200).json(subscriptions);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getSubscription = async (req, res) => {
    const subscriptionId = req.params.id;

    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'description', 'price', 'stock']
            }]
        });

        if (!subscription) {
            return res.sendStatus(404);
        }

        if (subscription.userId !== req.user.id) {
            return res.sendStatus(403);
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.createSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.create({
            userId: req.user.id,
            targetId: req.body.targetId,
            type: req.body.type
        });
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);
        if (!subscription) {
            return res.sendStatus(404);
        }

        if (subscription.userId !== req.user.id && !req.user.isAdmin) {
            return res.sendStatus(403);
        }

        await subscription.destroy();
        res.sendStatus(200);
    } catch (error) {
        console.error("Error deleting subscription:", error);
        res.sendStatus(500);
    }
};

exports.notifyUsers = async (type, targetId, { subject, message }) => {
    try {
        const subscriptions = await Subscription.findAll({
            where: { type, targetId },
            include: [{ model: User, as: 'user', attributes: ['email', 'firstname'] }]
        });

        if (subscriptions.length === 0) {
            return;
        }

        subscriptions.forEach(subscription => {
            const { user } = subscription;
            if (user) {
                emailService.sendSubscriptionNotificationEmail(
                    user.firstname,
                    user.email,
                    subject,
                    message
                );
            }
        });
        console.log(`Notifications sent to ${subscriptions.length} users.`);
    } catch (error) {
        console.error("Error fetching users with specific subscription:", error);}
};
