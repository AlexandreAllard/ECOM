const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class StockAdjustment extends Model {}

    StockAdjustment.init({
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        change: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        justification: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'StockAdjustment',
        tableName: 'stock_adjustments'
    });

    return StockAdjustment;
};
