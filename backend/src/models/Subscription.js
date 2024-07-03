const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Subscription extends Model {}

    Subscription.init({
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['stock_change', 'new_product', 'price_change'],
            allowNull: false
        },
        targetId: {
            type: DataTypes.UUID,
            allowNull: false,
            comment: "This can be either productId or categoryId depending on the subscription type."
        }
    }, {
        sequelize,
        modelName: 'Subscription',
        tableName: 'subscriptions'
    });

    return Subscription;
};
