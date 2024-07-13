const mongoose = require('mongoose');

const ProductMongoSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    categoryId: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
});

const ProductMongo = mongoose.model('ProductMongo', ProductMongoSchema);

module.exports = ProductMongo;
