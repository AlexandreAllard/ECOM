const { DataTypes, Model } = require('sequelize');
const ProductMongo = require('./ProductMongo');

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
            brand: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
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
            hooks: {
                afterCreate: async (product, options) => {
                    const productMongo = new ProductMongo({
                        _id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        imageUrl: product.imageUrl,
                        categoryId: product.categoryId,
                        brand: product.brand,
                    });
                    await productMongo.save();
                },
                afterUpdate: async (product, options) => {
                    await ProductMongo.findByIdAndUpdate(product.id, {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        imageUrl: product.imageUrl,
                        categoryId: product.categoryId,
                        brand: product.brand,
                    });
                },
                afterDestroy: async (product, options) => {
                    await ProductMongo.findByIdAndDelete(product.id);
                },
            },
        }
    );

    return Product;
};
