const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");

router.get('/', authMiddleware, productController.getAllProducts);
router.post('/', authMiddleware, productController.createProduct);

router.post('/:id/stock-adjustments', authMiddleware, checkAdminRole, productController.updateProductStock);
router.get('/:id/stock-adjustments', authMiddleware, productController.getStockAdjustments);

router.get('/stock-adjustments', authMiddleware, productController.getAllStockAdjustments);
router.get('/stock-adjustments/:adjustmentId', authMiddleware, productController.getStockAdjustment);

router.get('/:id', authMiddleware, productController.getProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.patch('/:id', authMiddleware, productController.updateProduct);

module.exports = router;
