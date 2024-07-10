const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Order extends Model {}

    Order.init({
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: { notEmpty: true },
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'completed'
        },
        paymentIntentId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders'
    });

    return Order;
};
