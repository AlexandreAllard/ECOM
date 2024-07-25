const { LegalDocument, User } = require('../models');
const { sendUpdatedTermsEmail } = require('../services/emailService');

exports.getAllDocuments = async (req, res) => {
    try {
        const { documentType } = req.query;
        let options = {};

        if (documentType) {
            options.where = { documentType };
        }

        const documents = await LegalDocument.findAll(options);
        res.json(documents);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await LegalDocument.update(req.body, { where: { id } });
        if (updated) {
            const updatedDocument = await LegalDocument.findByPk(id);
            res.status(200).json(updatedDocument);

            const users = await User.findAll({ limit: 3 });

            await sendUpdatedTermsEmail(users, updatedDocument.documentType, updatedDocument.title);

        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
    }
};
