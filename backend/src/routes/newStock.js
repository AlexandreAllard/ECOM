const express = require('express');
const router = express.Router();
const newStockController = require('../controllers/newStockController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const checkStaff = require("../middleware/staffMiddleware");

router.get('/', authMiddleware, checkStaff, newStockController.getStockAdjustments);
router.get('/product/:id', authMiddleware, checkStaff, newStockController.getProductStockAdjustments);
router.get('/:id', authMiddleware, checkStaff, newStockController.getStockAdjustment);
router.post('/:id', authMiddleware, checkStaff, newStockController.createStockAdjustment);

module.exports = router;
