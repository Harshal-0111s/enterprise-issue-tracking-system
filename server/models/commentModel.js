const db = require("../config/db");

const Comment = {

    createComment: (commentData, callback) => {

        const sql = `
            INSERT INTO comments
            (
                ticket_id,
                user_id,
                comment,
                comment_type
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                commentData.ticket_id,
                commentData.user_id,
                commentData.comment,
                commentData.comment_type || "reply"
            ],
            callback
        );
    },

    getCommentsByTicket: (ticketId, callback) => {

        const sql = `
            SELECT
                c.id,
                c.ticket_id,
                c.user_id,
                c.comment,
                c.comment_type,
                c.created_at,
                u.full_name,
                u.email,
                u.role
            FROM comments c
            LEFT JOIN users u
                ON c.user_id = u.id
            WHERE c.ticket_id = ?
            ORDER BY c.created_at ASC, c.id ASC
        `;

        db.query(
            sql,
            [ticketId],
            callback
        );
    }

};

module.exports = Comment;
