const Ticket = require("../models/ticketModel");

const createTicket = (req, res) => {

    const {
        ticket_title,
        category,
        priority,
        description,
        department,
        assigned_to
    } = req.body;

    if (
        !ticket_title ||
        !category ||
        !priority
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    const ticketData = {

        ticket_title,
        category,
        priority,
        description,
        attachment: req.file ? req.file.filename : "",
        created_by: req.user.id,
        assigned_to: assigned_to || null,
        department: department || null

    };

    Ticket.createTicket(ticketData, (err, result) => {

        console.log("Database Error:", err);
        console.log("Database Result:", result);

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Ticket Created Successfully",
            ticket_id: result.insertId,
            result
        });

    });

};

const getAllTickets = (req, res) => {

    Ticket.getAllTickets((err, result) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Database Error"

            });

        }

        return res.status(200).json({

            success: true,
            tickets: result

        });

    });

};

const getDashboardStats = (req, res) => {

    Ticket.getAllTickets((err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        const total = result.length;

        const open = result.filter(
            ticket => ticket.status === "Open"
        ).length;

        const inProgress = result.filter(
            ticket => ticket.status === "In Progress"
        ).length;

        const resolved = result.filter(
            ticket => ticket.status === "Resolved"
        ).length;

        const closed = result.filter(
            ticket => ticket.status === "Closed"
        ).length;

        return res.status(200).json({
            success: true,
            stats: {
                total,
                open,
                inProgress,
                resolved,
                closed
            }
        });

    });

};

const getTicketById = (req, res) => {

    const { id } = req.params;

    Ticket.getTicketById(id, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Unable to fetch ticket"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            ticket: result[0]
        });

    });

};

const updateTicket = (req, res) => {

    const { id } = req.params;

    const {
        ticket_title,
        category,
        priority,
        description,
        status,
        assigned_to,
        department
    } = req.body;

    const ticketData = {

        ticket_title,
        category,
        priority,
        description,
        status,
        assigned_to: assigned_to || null,
        department: department || null

    };

    Ticket.updateTicket(id, ticketData, (err, result) => {

        if (err) {

            console.error("Update Ticket Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });

        }

        return res.status(200).json({

            success: true,
            message: "Ticket Updated Successfully"

        });

    });

};

const deleteTicket = (req, res) => {

    const { id } = req.params;

    Ticket.deleteTicket(id, (err) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Database Error"

            });

        }

        return res.status(200).json({

            success: true,
            message: "Ticket Deleted Successfully"

        });

    });

};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    getDashboardStats
};
