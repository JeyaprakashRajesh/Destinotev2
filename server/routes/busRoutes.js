const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController"); // Assuming the controller is in busController.js

// Route to add a bus
router.post("/add", busController.addBus);

// Route to fetch all buses (optional, can be removed if not needed)
router.get("/", busController.getAllBuses);

module.exports = router;
