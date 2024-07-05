const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/create-payment-intent', authMiddleware, paymentController.createOrderAndProcessPayment);
router.post('/verify-payment', authMiddleware, paymentController.verifyPaymentStatus);
router.post('/refund/:orderId', authMiddleware, paymentController.refundOrder);

module.exports = router;
