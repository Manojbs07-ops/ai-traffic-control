const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');
const { verifyToken, isRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', verifyToken, violationController.getAllViolations);
router.get('/:id', verifyToken, violationController.getViolationById);

// Create violation with optional file upload (police & admin allowed)
router.post(
  '/',
  verifyToken,
  isRole(['citizen', 'police', 'admin']),
  upload.single('evidence_image'),
  violationController.createViolation
);

router.put('/:id', verifyToken, isRole(['police', 'admin']), violationController.updateViolation);
router.delete('/:id', verifyToken, isRole(['admin']), violationController.deleteViolation);

module.exports = router;
