const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class LegalDocument extends Model {}

    LegalDocument.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        documentType: {
            type: DataTypes.ENUM('CGV', 'LegalMention'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'LegalDocument',
        tableName: 'legal_documents'
    });

    return LegalDocument;
};
