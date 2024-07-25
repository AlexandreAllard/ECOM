const express = require('express');
const router = express.Router();
const newLegalController = require('../controllers/newLegalController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");

router.get('/', newLegalController.getAllDocuments);
router.patch('/:id', authMiddleware, checkAdminRole, newLegalController.updateDocument);

module.exports = router;
