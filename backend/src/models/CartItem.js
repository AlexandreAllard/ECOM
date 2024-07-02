const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CartItem extends Model {}

    CartItem.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            cartId: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isInt: true,
                    min: 1,
                },
            }
        },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'cartItem'
        }
    );

    return CartItem;
};
