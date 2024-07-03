const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, subscriptionController.createSubscription);
router.delete('/:id', authMiddleware, subscriptionController.deleteSubscription);
router.get('/user/:userId', authMiddleware, subscriptionController.getUserSubscriptions);
router.get('/:type/:targetId/users', authMiddleware, subscriptionController.getUsersBySubscriptionType);
router.get('/my-subscriptions', authMiddleware, subscriptionController.getUserSubscriptions);

module.exports = router;
