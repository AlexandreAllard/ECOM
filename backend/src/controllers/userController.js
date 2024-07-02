const { User, Cart } = require('../models');  // Assurez-vous que le modèle Cart est importé
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    const transaction = await User.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password, firstname, lastname } = req.body;
        const id = uuidv4();

        const user = await User.create({
            id, email, password, firstname, lastname
        }, { transaction });

        await Cart.create({ userId: user.id }, { transaction });

        await transaction.commit();
        res.status(201).json(user);
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email déjà utilisé' });
        }
        next(error);
    }
};

/*
generateActivateToken = (userId) => {
    return jwt.sign({ userId, type: "ACTIVATE_ACCOUNT" }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

sendActivateEmail({email, token}) => {
    this.send(email, 1, {
        url: `${process.env.FRONTEND_URL}/activate/${token}`
    })
}
*/

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.sendStatus(404);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const userToUpdate = await User.findByPk(req.params.id);
        if (!userToUpdate) {
            return res.sendStatus(404);
        }

        const updateData = {};
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.password) updateData.password = req.body.password;
        if (req.body.firstname) updateData.firstname = req.body.firstname;
        if (req.body.lastname) updateData.lastname = req.body.lastname;
        if (req.body.role && req.user.role === 'admin') {
            updateData.role = req.body.role;
        }

        await userToUpdate.update(updateData);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedRows = await User.destroy({ where: { id: req.params.id } });
        if (deletedRows === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Aucun utilisateur authentifié." });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.alterCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Aucun utilisateur authentifié." });
        }

        const userToUpdate = await User.findByPk(req.user.id);
        if (!userToUpdate) {
            return res.sendStatus(404);
        }

        const updateData = {};
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.password) updateData.password = req.body.password;
        if (req.body.firstname) updateData.firstname = req.body.firstname;
        if (req.body.lastname) updateData.lastname = req.body.lastname;

        await userToUpdate.update(updateData);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

