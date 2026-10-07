const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, isRole } = require('../middleware/authMiddleware');

router.get('/user', verifyToken, isRole(['citizen', 'admin']), dashboardController.getUserDashboard);
router.get('/police', verifyToken, isRole(['police', 'admin']), dashboardController.getPoliceDashboard);
router.get('/admin', verifyToken, isRole('admin'), dashboardController.getAdminDashboard);

module.exports = router;
