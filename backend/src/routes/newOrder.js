const express = require('express');
const router = express.Router();
const newOrderController = require('../controllers/newOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkAdminRole = require("../middleware/adminMiddleware");
const authorizeAccess = require("../middleware/restrictionMiddleware");

router.get('/', authMiddleware, checkAdminRole, newOrderController.getOrders);
router.get('/:id', authMiddleware, newOrderController.getOrder);
router.get('/user/:id', authMiddleware, authorizeAccess, newOrderController.getUserOrders);
router.patch('/refund/ask/:id', authMiddleware, newOrderController.requestRefund);
router.post('/refund/:id', authMiddleware, checkAdminRole, newOrderController.refundOrder);

module.exports = router;
