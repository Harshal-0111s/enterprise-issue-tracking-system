const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getActivitiesByTicket
} = require("../controllers/activityController");

router.get(
    "/ticket/:ticketId",
    verifyToken,
    getActivitiesByTicket
);

module.exports = router;
