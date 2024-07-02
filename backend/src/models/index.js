const fs = require("fs");
const path = require('path');
const {Sequelize, sequelize} = require('../config/db');

const db = {};

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.endsWith('.js')))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Category.hasMany(db.Product, {
    foreignKey: 'categoryId',
    as: 'products'
});

db.Product.belongsTo(db.Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

db.Product.hasMany(db.StockAdjustment, {
    foreignKey: 'productId',
    as: 'adjustments'
});

db.StockAdjustment.belongsTo(db.Product, {
    foreignKey: 'productId',
    as: 'product'
});

db.User.hasOne(db.Cart, {
    foreignKey: 'userId',
    as: 'cart'
});

db.Cart.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user'
});

db.Cart.hasMany(db.CartItem, {
    foreignKey: 'cartId',
    as: 'items'
});

db.CartItem.belongsTo(db.Cart, {
    foreignKey: 'cartId',
    as: 'cart'
});

db.Product.hasMany(db.CartItem, {
    foreignKey: 'productId',
    as: 'cartItems'
});

db.CartItem.belongsTo(db.Product, {
    foreignKey: 'productId',
    as: 'product'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
