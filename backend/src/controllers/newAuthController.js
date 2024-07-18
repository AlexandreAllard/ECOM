const User = require('../models').User;
const emailService = require('../services/emailService');

const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(422);
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.sendStatus(401);
        }

        if (user.isVerified === false) {
            return res.sendStatus(403);
        }

        if (user.lockUntil && user.lockUntil > new Date()) {
            return res.sendStatus(401);
        }

        if (!(await user.checkPassword(req.body.password))) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 20 * 60 * 1000);
            }
            await user.save();
            return res.sendStatus(401);
        }

        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '2h'});

        res.cookie('jwt', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', maxAge: 3600000
        });

        res.json({id: user.id, token});
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {httpOnly: true, expires: new Date(0)});
    res.sendStatus(200);
};

exports.validateToken = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.sendStatus(404);
        }

        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(401);
    }
};

exports.activateAccount = async (req, res) => {
    const {token} = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({where: {email: decoded.email}});

        if (!user) {
            return res.sendStatus(404);
        }

        if (user.isVerified) {
            return res.sendStatus(400);
        }

        user.isVerified = true;
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
};

exports.resendActivationAccount = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
                isVerified: false
            }
        });

        if (!user) {
            return res.sendStatus(404);
        }

        const verificationToken = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '24h'});
        await emailService.sendVerificationEmail(user.firstname, verificationToken, 'alrdalexandre@gmail.com');
        res.sendStatus(200);
    } catch (error) {

        res.sendStatus(500);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.sendStatus(404);
        }

        if (!req.body.newPassword) {
            return res.sendStatus(404);
        }

        user.password = req.body.newPassword;
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.sendStatus(401);
        } else {
            res.sendStatus(400);
        }
    }
};

exports.requestResetPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.sendStatus(404);
        }

        const resetToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        await emailService.sendPasswordResetEmail(user.firstname, resetToken, 'alrdalexandre@gmail.com');
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
};
