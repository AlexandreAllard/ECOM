const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/login',
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
    authController.login
);

router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
