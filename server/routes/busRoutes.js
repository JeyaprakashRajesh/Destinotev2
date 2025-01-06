const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController"); 

router.post("/add", busController.addBus);

router.get("/", busController.getAllBuses);

router.post("/update-coordinates", busController.updateBusCoordinates);

router.post("/update-departure", busController.updateBusDeparture);

router.post("/update-progress", busController.incrementBusProgress);

router.post("/getMarkerBus", busController.getMarkerBus);

module.exports = router;
