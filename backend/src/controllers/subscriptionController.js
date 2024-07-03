const {Subscription, User, Product} = require('../models');
const emailService = require('../services/emailService');

exports.createSubscription = async (req, res) => {
    const userId = req.user.id;
    const {targetId, type} = req.body;

    try {
        const subscription = await Subscription.create({userId, targetId, type});
        res.status(201).json(subscription);
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.deleteSubscription = async (req, res) => {
    const userId = req.user.id;
    const {id} = req.params;

    try {
        const deleted = await Subscription.destroy({where: {id, userId}});
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({message: "Subscription not found or not authorized"});
        }
    } catch (error) {
        console.error("Error deleting subscription:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.getUserSubscriptions = async (req, res) => {
    const userId = req.user.id;

    try {
        const subscriptions = await Subscription.findAll({where: {userId}});
        res.json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.getUsersBySubscriptionType = async (req, res) => {
    const {type, targetId} = req.params;

    try {
        const subscriptions = await Subscription.findAll({
            where: {type, targetId},
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'firstname', 'lastname']
            }]
        });

        const users = subscriptions.map(sub => sub.user);

        res.json(users);
    } catch (error) {
        console.error("Error fetching users with specific subscription:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

exports.notifyUsersBySubscriptionType = async (type, targetId, {subject, message}) => {
    try {
        const subscriptions = await Subscription.findAll({
            where: {type, targetId},
            include: [{model: User, as: 'user', attributes: ['email', 'firstname']}]
        });

        subscriptions.forEach(subscription => {
            if (subscription.user) {
                emailService.sendSubscriptionNotificationEmail(
                    subscription.user.firstname,
                    subscription.user.email,
                    subject,
                    message
                );
            }
        });
    } catch (error) {
        console.error("Error notifying users with specific subscription:", error);
    }
};

exports.getUserSubscriptions = async (req, res) => {
    const userId = req.user.id;

    try {
        const subscriptions = await Subscription.findAll({
            where: {userId},
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'description', 'price', 'stock']
            }]
        });
        res.json(subscriptions);
    } catch (error) {
        console.error("Error fetching user subscriptions:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
