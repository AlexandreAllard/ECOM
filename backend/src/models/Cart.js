const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Cart extends Model {}

    Cart.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'cart'
        }
    );

    return Cart;
};
