const Comment = require("../models/commentModel");

const createComment = (req, res) => {

    const { ticket_id, comment, comment_type } = req.body;

    if (!ticket_id || !comment || !comment.trim()) {
        return res.status(400).json({
            success: false,
            message: "Ticket ID and comment are required."
        });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized."
        });
    }

    const commentData = {
        ticket_id,
        user_id: req.user.id,
        comment: comment.trim(),
        comment_type: comment_type || "reply"
    };

    Comment.createComment(commentData, (err, result) => {

        if (err) {
            console.error("❌ Create Comment Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to add comment.",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Comment Added Successfully.",
            comment: {
                id: result.insertId,
                ticket_id: ticket_id,
                user_id: req.user.id,
                comment: comment.trim(),
                comment_type: comment_type || "reply"
            }
        });
    });
};


const getCommentsByTicket = (req, res) => {

    const { ticketId } = req.params;

    if (!ticketId) {
        return res.status(400).json({
            success: false,
            message: "Ticket ID is required."
        });
    }

    Comment.getCommentsByTicket(ticketId, (err, results) => {

        if (err) {
            console.error("❌ Get Comments Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch comments.",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            comments: results
        });
    });
};


module.exports = {
    createComment,
    getCommentsByTicket
};
