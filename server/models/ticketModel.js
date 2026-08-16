const db = require("../config/db");

const Ticket = {

    createTicket: (ticketData, callback) => {

        const sql = `
            INSERT INTO tickets
            (
                ticket_title,
                category,
                priority,
                description,
                attachment,
                created_by,
                assigned_to,
                department
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                ticketData.ticket_title,
                ticketData.category,
                ticketData.priority,
                ticketData.description,
                ticketData.attachment,
                ticketData.created_by,
                ticketData.assigned_to,
                ticketData.department
            ],
            callback
        );

    },


   getAllTickets: (callback) => {

    const sql = `
        SELECT
            t.*,
            requester.full_name AS requester_name,
            requester.email AS requester_email
        FROM tickets t

        LEFT JOIN users requester
            ON t.created_by = requester.id

        ORDER BY t.created_at DESC
    `;

    db.query(sql, callback);

},

getTicketById: (id, callback) => {

    const sql = `
        SELECT
            t.*,
            requester.full_name AS requester_name,
            requester.email AS requester_email
        FROM tickets t

        LEFT JOIN users requester
            ON t.created_by = requester.id

        WHERE t.id = ?
    `;

    db.query(sql, [id], callback);

},


    updateTicket: (id, ticketData, callback) => {

        const sql = `
            UPDATE tickets
            SET
                ticket_title = ?,
                category = ?,
                priority = ?,
                description = ?,
                status = ?,
                assigned_to = ?,
                department = ?
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
                ticketData.assigned_to,
                ticketData.department,
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
