const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, deliveryController.getAllDeliveries);

module.exports = router;
