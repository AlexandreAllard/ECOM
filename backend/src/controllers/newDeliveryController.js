const {Delivery, Order, User} = require('../models');

exports.getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();
        res.status(200).json(deliveries);
    } catch (error) {
        res.sendStatus(500);
    }
};


exports.getUserDeliveries = async (req, res) => {
    const userId = req.params.id;

    try {
        const deliveries = await Delivery.findAll({
            include: [{
                model: Order,
                as: 'order',
                where: {userId: userId},
                attributes: []
            }]
        });

        res.status(200).json(deliveries);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);
        if (!delivery) {
            return res.sendStatus(404);
        }

        if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(req.body.status)) {
            return res.sendStatus(400);
        }

        delivery.status = req.body.status;
        await delivery.save();

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};
