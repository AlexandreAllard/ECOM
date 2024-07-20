const express = require('express');
const router = express.Router();
const newCartController = require('../controllers/newCartController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, newCartController.getCart);
router.delete('/', authMiddleware, newCartController.clearCart);
router.patch('/item/:itemId', authMiddleware, newCartController.updateCartItemQuantity);
router.delete('/item/:itemId', authMiddleware, newCartController.deleteCartItem);
router.post('/:productId', authMiddleware, newCartController.addToCart);

module.exports = router;
