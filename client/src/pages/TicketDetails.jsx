import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/ticketApi";
import "./TicketDetails.css";

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTicket = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(`/tickets/${id}`);

            setTicket(response.data.ticket);
        } catch (err) {
            console.error(err);
            setError("Unable to load ticket.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    if (loading) {
        return (
            <div className="ticket-details-page">
                <div className="ticket-loading">
                    Loading ticket...
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="ticket-details-page">
                <div className="ticket-error">
                    {error || "Ticket not found."}

                    <button onClick={() => navigate("/view-tickets")}>
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="ticket-details-page">

            <div className="ticket-details-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() => navigate("/view-tickets")}
                    >
                        ← Back to Tickets
                    </button>

                    <div className="ticket-title-row">

                        <span className="ticket-number">
                            #{ticket.id}
                        </span>

                        <h1>
                            {ticket.ticket_title}
                        </h1>

                    </div>

                    <p className="ticket-subtitle">
                        Support ticket details and activity
                    </p>

                </div>

            </div>

            <div className="ticket-details-layout">

                <main className="ticket-main-card">

                    <div className="section-heading">
                        Description
                    </div>

                    <div className="ticket-description">
                        {ticket.description || "No description provided."}
                    </div>

                    <div className="activity-section">

                        <div className="section-heading">
                            Activity
                        </div>

                        <div className="empty-activity">
                            No activity yet.
                        </div>

                    </div>

                </main>

                <aside className="ticket-sidebar-card">

                    <div className="details-heading">
                        Ticket Information
                    </div>

                    <div className="detail-item">

                        <span>Priority</span>

                        <strong
                            className={`detail-priority ${(ticket.priority || "medium").toLowerCase()}`}
                        >
                            {ticket.priority || "Medium"}
                        </strong>

                    </div>

                    <div className="detail-item">

                        <span>Status</span>

                        <strong>
                            {ticket.status || "Open"}
                        </strong>

                    </div>

                    <div className="detail-item">

                        <span>Category</span>

                        <strong>
                            {ticket.category || "General"}
                        </strong>

                    </div>

                    <div className="detail-item">

                        <span>Requester</span>

                        <strong>
                            {ticket.full_name || "N/A"}
                        </strong>

                    </div>

                    <div className="detail-item">

                        <span>Created</span>

                        <strong>
                            {ticket.created_at
                                ? new Date(ticket.created_at).toLocaleString()
                                : "N/A"}
                        </strong>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default TicketDetails;
