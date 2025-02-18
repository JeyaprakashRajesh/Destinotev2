const express = require("express");
const router = express.Router();
const { Login, Phone , getDetails} = require("../controllers/UserController.js");
const {Middleware} = require("../config/Middleware.js")

router.post("/phone", Phone);
router.post("/login", Login);
router.get("/get-details",Middleware , getDetails)
module.exports = router;
 