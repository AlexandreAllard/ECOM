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

        if (user.lockUntil && user.lockUntil > new Date()) {
            return res.status(401).json({ message: 'Compte temporairement verrouillé. Veuillez réessayer plus tard.' });
        }

        if (!(await user.checkPassword(password))) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 20 * 60 * 1000);
                await user.save();
            } else {
                await user.save();
            }
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

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
