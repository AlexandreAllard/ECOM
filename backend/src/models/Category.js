const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Category extends Model {}

    Category.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            name: {
                type: DataTypes.STRING(45),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'category',
        }
    );

    return Category;
};
