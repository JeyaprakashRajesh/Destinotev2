const express = require("express");
const router = express.Router();
const { Login, Phone , getDetails , Recharge, QrCode } = require("../controllers/UserController.js");
const {Middleware} = require("../config/Middleware.js")

router.post("/phone", Phone);
router.post("/login", Login);
router.get("/get-details",Middleware , getDetails),
router.post("/recharge",Middleware , Recharge)
router.post("/qr" , Middleware , QrCode)
module.exports = router;
 