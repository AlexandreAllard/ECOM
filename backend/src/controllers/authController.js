const User = require('../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Compte non vérifié. Veuillez vérifier votre email.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });
        return res.json({ user, token });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {httpOnly: true, expires: new Date(0)});
    res.status(200).json({message: 'Déconnexion réussie'});
};
