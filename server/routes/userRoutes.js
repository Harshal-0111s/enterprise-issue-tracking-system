const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getProfile,
    getAllUsers,
    getAgents
} = require("../controllers/userController");


/* =========================
   PROFILE
========================= */

router.get(
    "/profile",
    verifyToken,
    getProfile
);


/* =========================
   ALL USERS
========================= */

router.get(
    "/",
    verifyToken,
    getAllUsers
);


/* =========================
   SUPPORT AGENTS
========================= */

router.get(
    "/agents",
    verifyToken,
    getAgents
);


module.exports = router;
