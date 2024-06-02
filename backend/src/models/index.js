const fs = require("fs");
const path = require('path');
const { Sequelize, sequelize } = require('../config/db');

const db = {};

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Product.belongsTo(db.Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
});

db.Category.hasMany(db.Product, {
    foreignKey: 'categoryId'
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
