import React, { useEffect, useState } from "react";
import API from "../api/ticketApi";
import "./ViewTicket.css";

function ViewTicket() {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await API.get("/tickets");
            setTickets(response.data.tickets || []);
        } catch (error) {
            alert("Unable to fetch tickets.");
        }
    };

    const deleteTicket = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/tickets/${id}`);
            alert("Ticket Deleted Successfully");
            fetchTickets();
        } catch (error) {
            alert("Delete Failed");
        }
    };

    const editTicket = async (ticket) => {
        const newTitle = prompt("Enter New Ticket Title", ticket.ticket_title);

        if (!newTitle) return;

        try {
            await API.put(`/tickets/${ticket.id}`, {
                ticket_title: newTitle,
                category: ticket.category,
                priority: ticket.priority,
                description: ticket.description,
                status: ticket.status
            });

            alert("Ticket Updated Successfully");
            fetchTickets();
        } catch (error) {
            alert("Update Failed");
        }
    };

    const updateStatus = async (ticket, newStatus) => {
        try {
            await API.put(`/tickets/${ticket.id}`, {
                ticket_title: ticket.ticket_title,
                category: ticket.category,
                priority: ticket.priority,
                description: ticket.description,
                status: newStatus
            });

            alert("Status Updated Successfully");
            fetchTickets();
        } catch (error) {
            alert("Status Update Failed");
        }
    };

    return (
        <div className="view-ticket-container">
            <h2>All Tickets</h2>

            <input
                type="text"
                placeholder="Search Ticket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
            />

            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-box"
            >
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
            </select>

            <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-box"
            >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
            </select>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tickets
                        .filter((ticket) =>
                            ticket.ticket_title
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .filter((ticket) =>
                            statusFilter === "All"
                                ? true
                                : ticket.status === statusFilter
                        )
                        .filter((ticket) =>
                            priorityFilter === "All"
                                ? true
                                : ticket.priority === priorityFilter
                        )
                        .map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.ticket_title}</td>
                                <td>{ticket.category}</td>
                                <td>{ticket.priority}</td>
                                <td>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) =>
                                            updateStatus(ticket, e.target.value)
                                        }
                                        className="status-select"
                                    >
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Resolved</option>
                                        <option>Closed</option>
                                    </select>
                                </td>
                                <td>{ticket.full_name}</td>
                                <td>{ticket.description}</td>
                                <td>
                                    <button onClick={() => editTicket(ticket)}>
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteTicket(ticket.id)}
                                        style={{
                                            marginLeft: "10px",
                                            background: "red",
                                            color: "white"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewTicket;