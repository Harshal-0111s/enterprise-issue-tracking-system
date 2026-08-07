const Ticket = require("../models/ticketModel");

const createTicket = (req, res) => {

    const {

        ticket_title,
        category,
        priority,
        description

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
        attachment: "",
        created_by: req.user.id

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

const updateTicket = (req, res) => {

    const { id } = req.params;

    const {

        ticket_title,
        category,
        priority,
        description,
        status

    } = req.body;

    const ticketData = {

        ticket_title,
        category,
        priority,
        description,
        status

    };

    Ticket.updateTicket(id, ticketData, (err) => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Database Error"

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
    updateTicket,
    deleteTicket,
    getDashboardStats
};