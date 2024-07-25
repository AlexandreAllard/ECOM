const mongoose = require('mongoose');

const OrderMongoSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'completed'
    },
    paymentIntentId: {
        type: String,
        required: true,
    }
});

const OrderMongo = mongoose.model('OrderMongo', OrderMongoSchema);

module.exports = OrderMongo;
