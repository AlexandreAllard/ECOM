const express = require('express');
const router = express.Router();
const newCategoryController = require('../controllers/newCategoryController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get('/', newCategoryController.getCategories);
router.get('/:id', newCategoryController.getCategory);
router.post('/', authMiddleware, adminMiddleware, newCategoryController.createCategory);
router.delete('/:id', authMiddleware, adminMiddleware, newCategoryController.deleteCategory);
router.patch('/:id', authMiddleware, adminMiddleware, newCategoryController.updateCategory);


module.exports = router;
