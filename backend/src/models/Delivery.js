const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Delivery extends Model {}

    Delivery.init({
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'Delivery',
        tableName: 'deliveries'
    });

    return Delivery;
};
