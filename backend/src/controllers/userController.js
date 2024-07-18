const {User, Cart} = require('../models');
const {validationResult} = require('express-validator');
const {v4: uuidv4} = require('uuid');
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    const transaction = await User.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(422).json({errors: errors.array()});
        }

        const {email, password, firstname, lastname} = req.body;
        const verificationToken = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '24h'});

        const user = await User.create({
            email,
            password,
            firstname,
            lastname,
            verificationToken
        }, {transaction});

        await Cart.create({userId: user.id}, {transaction});
        await transaction.commit();

        await emailService.sendVerificationEmail(firstname, verificationToken, 'alrdalexandre@gmail.com');
        res.status(201).json({message: 'Utilisateur créé ! Vérifiez votre email pour activer votre compte.'});
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({message: 'Email déjà utilisé'});
        }
        next(error);
    }
};

exports.activateAccount = async (req, res) => {
    const {token} = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({where: {email: decoded.email}});

        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        user.isVerified = true;
        await user.save();

        res.json({message: 'Compte activé avec succès.'});
    } catch (error) {
        res.status(400).json({message: 'Lien de vérification invalide ou expiré.'});
    }
};

exports.resendVerificationEmail = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({where: {email, isVerified: false}});
        if (!user) {
            return res.status(404).json({message: "Aucun utilisateur non vérifié trouvé avec cet email."});
        }

        const verificationToken = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '24h'});
        await user.save();

        await emailService.sendVerificationEmail(user.firstname, verificationToken, 'alrdalexandre@gmail.com');
        res.json({message: "Email de vérification renvoyé. Veuillez vérifier votre boîte de réception."});
    } catch (error) {
        console.error("Error resending verification email:", error);
        res.status(500).json({message: "Erreur lors de la régénération du code de vérification."});
    }
};

exports.requestResetPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json({message: "Aucun utilisateur trouvé avec cet email."});
        }

        const resetToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        await emailService.sendPasswordResetEmail(user.firstname, resetToken, 'alrdalexandre@gmail.com');
        res.json({message: "Email de réinitialisation de mot de passe envoyé."});
    } catch (error) {
        res.status(500).json({message: "Erreur lors de la demande de réinitialisation du mot de passe."});
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré." });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
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
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
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
            return res.status(422).json({errors: errors.array()});
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
    const userId = req.params.id;
    try {
        const anonymousData = {
            firstname: 'Deleted',
            lastname: 'User',
            email: `deleted-${Date.now()}@example.com`,
            password: await bcrypt.hash(uuidv4(), 10),
            isVerified: false
        };

        const result = await User.update(anonymousData, {
            where: { id: userId }
        });

        if (result[0] === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({ message: "Compte utilisateur supprimé et données anonymisées." });
    } catch (error) {
        console.error("Erreur lors de la suppression du compte utilisateur:", error);
        res.status(500).json({ message: "Erreur interne du serveur lors de la tentative de suppression du compte utilisateur." });
        next(error);
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({message: "Aucun utilisateur authentifié."});
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({message: "Utilisateur non trouvé."});
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.alterCurrentUser = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({message: "Aucun utilisateur authentifié."});
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

