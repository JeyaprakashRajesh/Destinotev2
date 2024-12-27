const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");


router.post("/add", routeController.addRoute);

router.get("/", routeController.getAllRoutes);

module.exports = router;
