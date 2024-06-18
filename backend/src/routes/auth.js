const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');
const User = require('../models').User;

router.post('/login',
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
    authController.login
);

router.post('/logout', authMiddleware, authController.logout);

router.get('/validate-token', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send({ message: "No token provided" });
    }


    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).json({
            message: "Token is valid",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).send({ message: "Token expired" });
        } else {
            res.status(401).send({ message: "Invalid token" });
        }
    }
});

module.exports = router;
