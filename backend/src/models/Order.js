const { DataTypes, Model } = require('sequelize');
const OrderMongo = require('./OrderMongo');

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
        tableName: 'orders',
        hooks: {
            afterCreate: async (order, options) => {
                const orderMongo = new OrderMongo({
                    _id: order.id,
                    userId: order.userId,
                    total: order.total,
                    status: order.status,
                    paymentIntentId: order.paymentIntentId,
                });
                await orderMongo.save();
            },
            afterUpdate: async (order, options) => {
                await OrderMongo.findByIdAndUpdate(order.id, {
                    userId: order.userId,
                    total: order.total,
                    status: order.status,
                    paymentIntentId: order.paymentIntentId,
                });
            },
            afterDestroy: async (order, options) => {
                await OrderMongo.findByIdAndDelete(order.id);
            },
        }
    });

    return Order;
};
