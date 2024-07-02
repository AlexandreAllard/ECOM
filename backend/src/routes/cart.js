const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, cartController.addToCart);

router.delete('/item/:itemId', authMiddleware, cartController.removeFromCart);

router.put('/item/:itemId', authMiddleware, cartController.updateCartItem);

router.get('/', authMiddleware, cartController.getCart);

router.patch('/item/:itemId', authMiddleware, cartController.updateCartItemQuantity);

module.exports = router;
