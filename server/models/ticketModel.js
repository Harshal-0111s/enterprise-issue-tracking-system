const db = require("../config/db");

const Ticket = {

    createTicket: (ticketData, callback) => {

        /*
         * Find the lowest available positive ticket ID.
         *
         * Example:
         * Existing IDs: 1, 3, 5
         * New ticket ID: 2
         *
         * Existing IDs: 1, 2, 3
         * New ticket ID: 4
         */

        const findIdSql = `
            SELECT
                CASE
                    WHEN NOT EXISTS (
                        SELECT 1
                        FROM tickets
                        WHERE id = 1
                    )
                    THEN 1

                    ELSE COALESCE(
                        (
                            SELECT MIN(t1.id + 1)
                            FROM tickets t1
                            LEFT JOIN tickets t2
                                ON t2.id = t1.id + 1
                            WHERE t2.id IS NULL
                        ),
                        1
                    )
                END AS next_ticket_id
        `;

        db.query(findIdSql, (idErr, idResult) => {

            if (idErr) {
                return callback(idErr);
            }

            const nextTicketId = idResult[0].next_ticket_id;

            const sql = `
                INSERT INTO tickets
                (
                    id,
                    ticket_title,
                    category,
                    priority,
                    description,
                    attachment,
                    created_by,
                    assigned_to,
                    department
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    nextTicketId,
                    ticketData.ticket_title,
                    ticketData.category,
                    ticketData.priority,
                    ticketData.description,
                    ticketData.attachment,
                    ticketData.created_by,
                    ticketData.assigned_to,
                    ticketData.department
                ],
                (insertErr, result) => {

                    if (insertErr) {
                        return callback(insertErr);
                    }

                    /*
                     * Return the manually assigned ticket ID
                     * instead of relying on MySQL AUTO_INCREMENT.
                     */

                    result.insertId = nextTicketId;

                    return callback(null, result);

                }
            );

        });

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

        db.query(
            sql,
            [id],
            callback
        );

    }

};

module.exports = Ticket;
