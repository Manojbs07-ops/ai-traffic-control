const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isRole } = require('../middleware/authMiddleware');

router.use(verifyToken, isRole('admin'));

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Police Officer Management
router.get('/police', adminController.getAllPolice);
router.post('/police', adminController.createPoliceOfficer);
router.put('/police/:id', adminController.updatePoliceOfficer);
router.delete('/police/:id', adminController.deletePoliceOfficer);

// Payments & Audits
router.get('/payments', adminController.getAdminPayments);

module.exports = router;
