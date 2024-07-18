const express = require('express');
const router = express.Router();
const newUserController = require('../controllers/newUserController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");
const authorizeAccess = require("../middleware/restrictionMiddleware");

router.get('/', authMiddleware, checkAdminRole, newUserController.getAllUsers);
router.post('/', newUserController.registerUser);
router.get('/:id', authMiddleware, authorizeAccess, newUserController.getUserById);
router.delete('/:id', authMiddleware, authorizeAccess, newUserController.deleteUser);
router.patch('/:id', authMiddleware, authorizeAccess, newUserController.updateUser);

module.exports = router;
