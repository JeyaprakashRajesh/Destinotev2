const express = require('express');
const router = express.Router();
const busStopController = require('../controllers/busStopController');

// Route for adding bus stops from JSON (bulk insert)
router.post('/bulk', busStopController.addBusStopsFromJson);

// Route for getting all bus stops
router.get('/', busStopController.getAllBusStops);

module.exports = router;
