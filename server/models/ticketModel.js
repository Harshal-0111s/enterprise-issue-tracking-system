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

        const deleteSql = `
            DELETE FROM tickets
            WHERE id = ?
        `;

        db.query(deleteSql, [id], (deleteErr, deleteResult) => {

            if (deleteErr) {
                return callback(deleteErr);
            }

            if (deleteResult.affectedRows === 0) {
                return callback(null, deleteResult);
            }

            /*
             * Reuse the deleted ID only when it was the highest
             * existing ticket ID.
             *
             * Existing lower ticket IDs are never renumbered.
             */

            const maxSql = `
                SELECT MAX(id) AS max_id
                FROM tickets
            `;

            db.query(maxSql, (maxErr, rows) => {

                if (maxErr) {
                    return callback(maxErr);
                }

                const maxId = rows[0]?.max_id;

                if (maxId === null || Number(maxId) < Number(id)) {

                    const nextAutoIncrement =
                        maxId === null
                            ? 1
                            : Number(id);

                    const alterSql = `
                        ALTER TABLE tickets
                        AUTO_INCREMENT = ?
                    `;

                    db.query(
                        alterSql,
                        [nextAutoIncrement],
                        (alterErr) => {

                            if (alterErr) {
                                return callback(alterErr);
                            }

                            return callback(null, deleteResult);
                        }
                    );

                } else {

                    return callback(null, deleteResult);

                }

            });

        });

    }

};

module.exports = Ticket;
