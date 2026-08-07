import { useState } from "react";
import API from "../api/ticketApi";
import "../styles/CreateTicket.css";

function CreateTicket() {

    const [ticket, setTicket] = useState({
        ticket_title: "",
        category: "Software",
        priority: "Low",
        description: ""
    });

    const handleChange = (e) => {
        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/tickets/create",
                ticket
            );

            alert(response.data.message);

            setTicket({
                ticket_title: "",
                category: "Software",
                priority: "Low",
                description: ""
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to create ticket."
            );

        }

    };

    return (

        <div className="create-ticket">

            <h1>Create Ticket</h1>

            <form onSubmit={handleSubmit}>

                <label>Ticket Title</label>

                <input
                    type="text"
                    name="ticket_title"
                    value={ticket.ticket_title}
                    onChange={handleChange}
                    placeholder="Enter Ticket Title"
                    required
                />

                <label>Category</label>

                <select
                    name="category"
                    value={ticket.category}
                    onChange={handleChange}
                >
                    <option>Software</option>
                    <option>Hardware</option>
                    <option>Network</option>
                    <option>Other</option>
                </select>

                <label>Priority</label>

                <select
                    name="priority"
                    value={ticket.priority}
                    onChange={handleChange}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>

                <label>Description</label>

                <textarea
                    rows="6"
                    name="description"
                    value={ticket.description}
                    onChange={handleChange}
                    placeholder="Describe your issue..."
                />

                <button type="submit">
                    Create Ticket
                </button>

            </form>

        </div>

    );

}

export default CreateTicket;