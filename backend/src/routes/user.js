const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");
const authorizeAccess = require("../middleware/restrictionMiddleware");

router.get('/me', authMiddleware, userController.getCurrentUser); //OK
router.put('/me', authMiddleware, userController.alterCurrentUser); //OK

router.post('/', userController.createUser); //OK
router.get('/verify/:token', userController.activateAccount);
router.post('/resend-verification', userController.resendVerificationEmail);
router.post('/reset-password-request', userController.requestResetPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.get('/', authMiddleware, checkAdminRole, userController.getAllUsers); //OK
router.get('/:id', authMiddleware, authorizeAccess, userController.getUser); //OK
router.put('/:id', authMiddleware, authorizeAccess, userController.updateUser); //PLUS BESOIN
router.delete('/:id', authMiddleware, authorizeAccess, userController.deleteUser); //OK
router.patch('/:id', authMiddleware, authorizeAccess, userController.updateUser); //OK

module.exports = router;
