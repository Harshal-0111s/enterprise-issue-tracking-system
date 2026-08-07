const db = require("../config/db");

const Ticket = {

    createTicket: (ticketData, callback) => {

        const sql = `
            INSERT INTO tickets
            (ticket_title, category, priority, description, attachment, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                ticketData.ticket_title,
                ticketData.category,
                ticketData.priority,
                ticketData.description,
                ticketData.attachment,
                ticketData.created_by
            ],
            callback
        );

    },

    getAllTickets: (callback) => {

        const sql = `
            SELECT
                t.*,
                u.full_name
            FROM tickets t
            LEFT JOIN users u
            ON t.created_by = u.id
            ORDER BY t.created_at DESC
        `;

        db.query(sql, callback);

    },

    updateTicket: (id, ticketData, callback) => {

        const sql = `
            UPDATE tickets
            SET
                ticket_title = ?,
                category = ?,
                priority = ?,
                description = ?,
                status = ?
            WHERE id = ?
        `;

        db.query(
            sql,
            [
                ticketData.ticket_title,
                ticketData.category,
                ticketData.priority,
                ticketData.description,
                ticketData.status,
                id
            ],
            callback
        );

    },

    deleteTicket: (id, callback) => {

        const sql = `
            DELETE FROM tickets
            WHERE id = ?
        `;

        db.query(sql, [id], callback);

    }

};

module.exports = Ticket;