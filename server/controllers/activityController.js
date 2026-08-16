const db = require("../config/db");

const getActivitiesByTicket = (req, res) => {
    const { ticketId } = req.params;

    if (!ticketId) {
        return res.status(400).json({
            success: false,
            message: "Ticket ID is required."
        });
    }

    const sql = `
        SELECT
            c.id AS id,
            c.ticket_id,
            c.comment_type,
            c.comment AS description,
            c.created_at,
            u.full_name,
            u.email,
            u.role,

            CASE
                WHEN c.comment_type = 'internal_note'
                    THEN 'internal_note_added'
                ELSE 'reply_added'
            END AS activity_type

        FROM comments c

        LEFT JOIN users u
            ON c.user_id = u.id

        WHERE c.ticket_id = ?

        ORDER BY c.created_at ASC, c.id ASC
    `;

    db.query(sql, [ticketId], (err, results) => {
        if (err) {
            console.error("❌ Get Activities Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch ticket activities.",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            activities: results
        });
    });
};

module.exports = {
    getActivitiesByTicket
};
