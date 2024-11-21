const express = require("express");
const router = express.Router();

const controller = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware")

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/login", controller.login);
router.get("/detail", authMiddleware.requireAuth, controller.detail);


module.exports = router;