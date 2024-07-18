const express = require('express');
const router = express.Router();
const newSubscriptionController = require('../controllers/newSubscriptionController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const restrictionMiddleware = require("../middleware/restrictionMiddleware");

router.get('/', authMiddleware, adminMiddleware, newSubscriptionController.getSubscriptions);
router.get('/user/:id', authMiddleware, restrictionMiddleware,  newSubscriptionController.getUserSubscriptions);
router.get('/:id', authMiddleware, newSubscriptionController.getSubscription);
router.post('/', authMiddleware, newSubscriptionController.createSubscription);
router.delete('/:id', authMiddleware, newSubscriptionController.deleteSubscription);

module.exports = router;
