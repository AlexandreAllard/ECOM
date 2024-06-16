const User = require('../models').User;
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
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password, firstname, lastname } = req.body;

        const id = uuidv4();

        const user = await User.create({ id, email, password, firstname, lastname });
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email déjà utilisé' });
        }

        next(error);
    }
};


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

        const { email, password, firstname, lastname, role } = req.body;
        const userToUpdate = await User.findByPk(req.params.id);

        if (!userToUpdate) {
            return res.sendStatus(404);
        }

        if (role && req.user.role === 'admin') {
            userToUpdate.role = role;
        }

        userToUpdate.email = email;
        userToUpdate.password = password;
        userToUpdate.firstname = firstname;
        userToUpdate.lastname = lastname;

        await userToUpdate.save();

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
