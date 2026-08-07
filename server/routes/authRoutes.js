const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    sendOTPLogin,
    verifyOTPLogin,
    sendForgotPasswordCode,
    resetForgotPassword
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/otp/send", sendOTPLogin);
router.post("/otp/verify", verifyOTPLogin);

router.post("/forgot/send", sendForgotPasswordCode);
router.post("/forgot/reset", resetForgotPassword);

module.exports = router;