const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");

router.get('/', authMiddleware, checkAdminRole, userController.getAllUsers);

router.post('/', userController.createUser);

router.get('/:id', authMiddleware, userController.getUser);

router.put('/:id', authMiddleware, userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
