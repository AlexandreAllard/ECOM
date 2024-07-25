const { DataTypes, Model } = require('sequelize');
const OrderItemMongo = require('./OrderItemMongo');

module.exports = (sequelize) => {
    class OrderItem extends Model {}

    OrderItem.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        hooks: {
            afterCreate: async (orderItem, options) => {
                const orderItemMongo = new OrderItemMongo({
                    _id: orderItem.id,
                    orderId: orderItem.orderId,
                    productId: orderItem.productId,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                });
                await orderItemMongo.save();
            },
            afterUpdate: async (orderItem, options) => {
                await OrderItemMongo.findByIdAndUpdate(orderItem.id, {
                    orderId: orderItem.orderId,
                    productId: orderItem.productId,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                });
            },
            afterDestroy: async (orderItem, options) => {
                await OrderItemMongo.findByIdAndDelete(orderItem.id);
            },
        }
    });

    return OrderItem;
};
