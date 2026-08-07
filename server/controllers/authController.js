const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const db = require("../config/db");

const otpStore = new Map();
const resetStore = new Map();

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeMobile = (mobile) => String(mobile || "").trim();

const lookupUserByLoginType = (loginType, identifier, callback) => {
    if (loginType === "mobile") {
        return User.findUserByMobileNumber(identifier, callback);
    }

    return User.findUserByEmail(identifier, callback);
};

// ================= REGISTER =================
const registerUser = (req, res) => {
    const { full_name, email, mobile_number, password } = req.body;

    if (!full_name || !email || !mobile_number || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields."
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedMobile = normalizeMobile(mobile_number);

    User.findUserByEmail(normalizedEmail, async (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        User.findUserByMobileNumber(normalizedMobile, async (mobileErr, mobileResult) => {
            if (mobileErr) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (mobileResult.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Mobile number already registered."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                full_name,
                email: normalizedEmail,
                mobile_number: normalizedMobile,
                password: hashedPassword
            };

            User.createUser(newUser, (createErr) => {
                if (createErr) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to register user."
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "User Registered Successfully."
                });
            });
        });
    });
};

// ================= LOGIN =================
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required."
        });
    }

    const normalizedEmail = normalizeEmail(email);

    User.findUserByEmail(normalizedEmail, async (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = generateToken(user.id);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    });
};

// ================= OTP LOGIN - SEND OTP =================
const sendOTPLogin = (req, res) => {
    const loginType = (req.body.login_type || "email").toLowerCase();
    const rawIdentifier = req.body.identifier || req.body.email || req.body.mobile_number;

    if (!rawIdentifier) {
        return res.status(400).json({
            success: false,
            message: "Email or mobile number is required."
        });
    }

    const identifier = loginType === "mobile"
        ? normalizeMobile(rawIdentifier)
        : normalizeEmail(rawIdentifier);

    lookupUserByLoginType(loginType, identifier, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: loginType === "mobile"
                    ? "Mobile number not registered."
                    : "Email not registered."
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpKey = `${loginType}:${identifier}`;

        otpStore.set(otpKey, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "OTP generated successfully.",
            devOtp: otp,
            user: {
                full_name: result[0].full_name,
                email: result[0].email,
                mobile_number: result[0].mobile_number
            }
        });
    });
};

// ================= OTP LOGIN - VERIFY OTP =================
const verifyOTPLogin = (req, res) => {
    const loginType = (req.body.login_type || "email").toLowerCase();
    const rawIdentifier = req.body.identifier || req.body.email || req.body.mobile_number;
    const { otp } = req.body;

    if (!rawIdentifier || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email/mobile number and OTP are required."
        });
    }

    const identifier = loginType === "mobile"
        ? normalizeMobile(rawIdentifier)
        : normalizeEmail(rawIdentifier);

    const otpKey = `${loginType}:${identifier}`;
    const record = otpStore.get(otpKey);

    if (!record) {
        return res.status(400).json({
            success: false,
            message: "OTP not generated or expired."
        });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(otpKey);
        return res.status(400).json({
            success: false,
            message: "OTP expired."
        });
    }

    if (record.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP."
        });
    }

    lookupUserByLoginType(loginType, identifier, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        otpStore.delete(otpKey);

        const user = result[0];
        const token = generateToken(user.id);

        return res.status(200).json({
            success: true,
            message: "OTP Login Successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                mobile_number: user.mobile_number,
                role: user.role
            }
        });
    });
};

// ================= FORGOT PASSWORD - SEND CODE =================
const sendForgotPasswordCode = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    const normalizedEmail = normalizeEmail(email);

    User.findUserByEmail(normalizedEmail, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Email not registered."
            });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        resetStore.set(normalizedEmail, {
            code: resetCode,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Reset code generated successfully.",
            devResetCode: resetCode
        });
    });
};

// ================= FORGOT PASSWORD - RESET =================
const resetForgotPassword = (req, res) => {
    const { email, code, new_password } = req.body;

    if (!email || !code || !new_password) {
        return res.status(400).json({
            success: false,
            message: "Email, code and new password are required."
        });
    }

    const normalizedEmail = normalizeEmail(email);
    const record = resetStore.get(normalizedEmail);

    if (!record) {
        return res.status(400).json({
            success: false,
            message: "Reset code not generated or expired."
        });
    }

    if (Date.now() > record.expiresAt) {
        resetStore.delete(normalizedEmail);
        return res.status(400).json({
            success: false,
            message: "Reset code expired."
        });
    }

    if (record.code !== code) {
        return res.status(400).json({
            success: false,
            message: "Invalid reset code."
        });
    }

    bcrypt.hash(new_password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
            return res.status(500).json({
                success: false,
                message: "Failed to hash password."
            });
        }

        const sql = "UPDATE users SET password = ? WHERE email = ?";

        db.query(sql, [hashedPassword, normalizedEmail], (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            resetStore.delete(normalizedEmail);

            return res.status(200).json({
                success: true,
                message: "Password reset successfully."
            });
        });
    });
};

module.exports = {
    registerUser,
    loginUser,
    sendOTPLogin,
    verifyOTPLogin,
    sendForgotPasswordCode,
    resetForgotPassword
};