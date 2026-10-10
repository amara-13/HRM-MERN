const express = require("express");
const router = express.Router();
const {loginLimiter,verifyOtpLimiter} = require("../middleware/rateLimiter.js");
const registerValidation = require("../middleware/registerValidation");
const { register, verifyOtp,verifyEmail,
    login,
    verifyForgetOtp,
    sendForgetOtp,
    resetPassword
} = require("../controllers/authController");


router.post("/register", registerValidation, register);
router.post("/otp",verifyOtpLimiter, verifyOtp);
router.post("/login",loginLimiter, login);
router.post("/verify-forgot-email", sendForgetOtp);
router.post("/forgot-otp", sendForgetOtp);
router.post("/verify-forgot-otp",verifyForgetOtp);
router.post("/reset-password",resetPassword)

module.exports = router