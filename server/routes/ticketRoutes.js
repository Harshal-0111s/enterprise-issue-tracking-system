const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    createTicket,
    getAllTickets,
    updateTicket,
    deleteTicket,
    getDashboardStats
} = require("../controllers/ticketController");

router.post("/create", verifyToken, upload.single("attachment"), createTicket);

router.get("/", verifyToken, getAllTickets);

router.get("/stats", verifyToken, getDashboardStats);

router.put("/:id", verifyToken, updateTicket);

router.delete("/:id", verifyToken, deleteTicket);

module.exports = router;