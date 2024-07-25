const {User} = require("../models");
const emailService = require('../services/emailService');

const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({where: req.query});
        res.json(users);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.status(500);
    }
};

exports.registerUser = async (req, res) => {
    const transaction = await User.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.sendStatus(422);
        }

        const {email, password, firstname, lastname} = req.body;

        const verificationToken = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '24h'});

        const user = await User.create({
            email,
            password,
            firstname,
            lastname,
            verificationToken,
            role: 'user'
        }, {transaction});

        await emailService.sendVerificationEmail(firstname, verificationToken, 'alrdalexandre@gmail.com');
        await transaction.commit();
        res.status(201).json({id: user.id, email: user.email});
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.sendStatus(409);
        }
        res.status(500);
    }
};

exports.deleteUser = async (req, res) => {
    const transaction = await User.sequelize.transaction();
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, { transaction });

        if (!user) {
            await transaction.rollback();
            return res.sendStatus(404);
        }

        const anonymousData = {
            firstname: 'Deleted',
            lastname: 'User',
            email: `deleted-${Date.now()}@example.com`,
            password: await bcrypt.hash(uuidv4(), 10),
            isVerified: false
        };

        await User.update(anonymousData, {
            where: { id: userId },
            transaction
        });

        await transaction.commit();
        res.sendStatus(200);
    } catch (error) {
        await transaction.rollback();
        res.sendStatus(500);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }

        if (Object.keys(req.body).length === 0) {
            return res.sendStatus(400);
        }

        if ('role' in req.body && req.user.role !== 'admin') {
            delete req.body.role;
        }

        const [affectedRows] = await User.update(req.body, {
            where: {id: req.params.id}
        });

        if (affectedRows === 0) {
            return res.sendStatus(404);
        }

        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.sendStatus(400);
        }
        next(error);
    }
};
