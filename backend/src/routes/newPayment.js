const express = require('express');
const router = express.Router();
const newPaymentController = require('../controllers/newPaymentController');
const authMiddleware = require("../middleware/authMiddleware");


module.exports = router;
