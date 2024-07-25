const express = require('express');
const router = express.Router();
const newDeliveryController = require('../controllers/newDeliveryController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const restrictionMiddleware = require("../middleware/restrictionMiddleware");
const checkStaff = require("../middleware/staffMiddleware");

router.get('/', authMiddleware, newDeliveryController.getDeliveries);
router.patch('/:id', authMiddleware, checkStaff, newDeliveryController.updateDeliveryStatus);

module.exports = router;
