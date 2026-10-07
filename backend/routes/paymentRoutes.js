const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, paymentController.processPayment);
router.get('/', verifyToken, paymentController.getPayments);

module.exports = router;
