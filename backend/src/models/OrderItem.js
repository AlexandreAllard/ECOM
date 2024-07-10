const { DataTypes, Model } = require('sequelize');

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
        tableName: 'order_items'
    });

    return OrderItem;
};
