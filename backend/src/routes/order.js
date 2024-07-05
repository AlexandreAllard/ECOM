const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user-orders', authMiddleware, orderController.getUserOrders);
router.get('/all-orders', authMiddleware, orderController.getAllOrders);
router.patch('/:orderId/status', authMiddleware, orderController.updateOrderStatus);


module.exports = router;
