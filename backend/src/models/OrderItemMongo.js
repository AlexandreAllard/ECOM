const mongoose = require('mongoose');

const OrderItemMongoSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
    }
});

const OrderItemMongo = mongoose.model('OrderItemMongo', OrderItemMongoSchema);

module.exports = OrderItemMongo;
