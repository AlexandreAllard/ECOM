const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdminRole = require("../middleware/adminMiddleware");
const authorizeAccess = require("../middleware/restrictionMiddleware");
const checkStaff = require("../middleware/staffMiddleware");
const newProductController = require("../controllers/newProductController");

router.get('/', authMiddleware, newOrderController.getOrders);
router.get('/search', authMiddleware, checkStaff, newOrderController.searchOrders);
router.get('/:id', authMiddleware, newOrderController.getOrder);
//router.get('/user/:id', authMiddleware, authorizeAccess, newOrderController.getUserOrders);
router.post('/refund/:id', authMiddleware, newOrderController.requestRefund);
router.patch('/refund/:id', authMiddleware, checkAdminRole, newOrderController.refundOrder);

module.exports = router;
