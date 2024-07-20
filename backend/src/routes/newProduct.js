const express = require('express');
const router = express.Router();
const newProductController = require('../controllers/newProductController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAdminRole = require("../middleware/adminMiddleware");

router.get('/', newProductController.getProducts);
router.get('/search', newProductController.searchProducts);
router.get('/:id', newProductController.getProduct);
router.post('/', authMiddleware, checkAdminRole, newProductController.createProduct);
router.patch('/:id', authMiddleware, checkAdminRole, newProductController.updateProduct);
router.delete('/:id', authMiddleware, checkAdminRole, newProductController.deleteProduct);

module.exports = router;
