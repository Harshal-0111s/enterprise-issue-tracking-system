const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);


// Test Route
app.get("/", (req, res) => {
    res.send("Issue Tracking System Backend is Running 🚀");
});

module.exports = app;