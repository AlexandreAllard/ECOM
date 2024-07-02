const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, productController.getAllProducts);
router.post('/', authMiddleware, productController.createProduct);
router.get('/:id', authMiddleware, productController.getProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.patch('/:id', authMiddleware, productController.updateProduct);

module.exports = router;
