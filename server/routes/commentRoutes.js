const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createComment,
    getCommentsByTicket
} = require("../controllers/commentController");


router.post(
    "/",
    verifyToken,
    createComment
);


router.get(
    "/ticket/:ticketId",
    verifyToken,
    getCommentsByTicket
);


module.exports = router;
