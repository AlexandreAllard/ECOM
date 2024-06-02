const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Product extends Model {}

    Product.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isDecimal: true,
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: true,
                    min: 0,
                },
            },
            imageUrl: DataTypes.STRING(255),
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'product',
        }
    );

    return Product;
};
