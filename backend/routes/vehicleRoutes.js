const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Public or authenticated search for vehicle violations
router.get('/search/:vehicleNumber', vehicleController.searchVehicle);

module.exports = router;
