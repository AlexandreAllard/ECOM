const express = require('express');
const router = express.Router();
const newDeliveryController = require('../controllers/newDeliveryController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const restrictionMiddleware = require("../middleware/restrictionMiddleware");

router.get('/', authMiddleware, adminMiddleware, newDeliveryController.getDeliveries);
router.get('/user/:id', authMiddleware, restrictionMiddleware, newDeliveryController.getUserDeliveries);
router.patch('/:id', authMiddleware, adminMiddleware, newDeliveryController.updateDeliveryStatus);

module.exports = router;
