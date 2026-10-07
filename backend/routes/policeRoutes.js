const express = require('express');
const router = express.Router();
const policeController = require('../controllers/policeController');
const { verifyToken, isRole } = require('../middleware/authMiddleware');

router.use(verifyToken, isRole(['police', 'admin']));

router.get('/violations', policeController.getPoliceViolations);
router.put('/violations/:id/approve', policeController.approveViolation);
router.put('/violations/:id/reject', policeController.rejectViolation);
router.get('/profile', policeController.getPoliceProfile);

module.exports = router;
