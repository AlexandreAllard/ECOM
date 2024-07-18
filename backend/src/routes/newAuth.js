const express = require('express');
const router = express.Router();
const newAuthController = require('../controllers/newAuthController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");
const authorizeAccess = require("../middleware/restrictionMiddleware");

router.post('/login', newAuthController.login);
router.post('/logout', authMiddleware, newAuthController.logout);
router.get('/validate-token', authMiddleware, newAuthController.validateToken);
router.post('/activate/send', newAuthController.resendActivationAccount);
router.post('/activate/:token', newAuthController.activateAccount);
router.post('/reset/send', newAuthController.requestResetPassword);
router.post('/reset/:token', newAuthController.resetPassword);

module.exports = router;
