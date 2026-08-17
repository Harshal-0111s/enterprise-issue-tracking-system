import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/ticketApi";
import "../styles/CreateTicket.css";

function CreateTicket() {

    const navigate = useNavigate();

    const [ticket, setTicket] = useState({
        ticket_title: "",
        category: "Software",
        priority: "Low",
        description: "",
        assigned_to: "",
        department: "IT Support"
    });

    const [attachment, setAttachment] = useState(null);
    const [agents, setAgents] = useState([]);
    const [createdTicketId, setCreatedTicketId] = useState(null);
    const [redirectCountdown, setRedirectCountdown] = useState(5);
    const [creating, setCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        const fetchAgents = async () => {

            try {

                const response = await API.get("/users/agents");

                setAgents(response.data.agents || []);

            } catch (error) {

                console.error(
                    "Failed to load support agents:",
                    error
                );

            }

        };

        fetchAgents();

    }, []);

    useEffect(() => {

        if (!createdTicketId) {
            return;
        }

        if (redirectCountdown <= 0) {

            navigate("/dashboard");

            return;
        }

        const timer = setTimeout(() => {

            setRedirectCountdown(
                (previous) => previous - 1
            );

        }, 1000);

        return () => clearTimeout(timer);

    }, [
        createdTicketId,
        redirectCountdown,
        navigate
    ]);

    const handleChange = (e) => {

        setTicket({
            ...ticket,
            [e.target.name]: e.target.value
        });

        setErrorMessage("");

    };

    const handleAttachmentChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            setAttachment(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {

            setErrorMessage(
                "Invalid file type. Please attach JPG, PNG, PDF, DOC or DOCX."
            );

            e.target.value = "";
            setAttachment(null);

            return;
        }

        if (file.size > maxSize) {

            setErrorMessage(
                "File is too large. Maximum attachment size is 5 MB."
            );

            e.target.value = "";
            setAttachment(null);

            return;
        }

        setAttachment(file);
        setErrorMessage("");

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (creating) {
            return;
        }

        setCreating(true);
        setErrorMessage("");

        try {

            const formData = new FormData();

            formData.append(
                "ticket_title",
                ticket.ticket_title
            );

            formData.append(
                "category",
                ticket.category
            );

            formData.append(
                "priority",
                ticket.priority
            );

            formData.append(
                "description",
                ticket.description
            );

            formData.append(
                "department",
                ticket.department
            );

            formData.append(
                "assigned_to",
                ticket.assigned_to
                    ? Number(ticket.assigned_to)
                    : ""
            );

            if (attachment) {

                formData.append(
                    "attachment",
                    attachment
                );

            }

            const response = await API.post(
                "/tickets/create",
                formData
            );

            const newTicketId =
                response.data?.ticket?.id ||
                response.data?.ticket_id ||
                response.data?.id ||
                null;

            setCreatedTicketId(
                newTicketId || "created"
            );

            setRedirectCountdown(5);

        } catch (error) {

            console.error(
                "Create Ticket Error:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to create ticket. Please try again."
            );

            setCreating(false);

        }

    };

    if (createdTicketId) {

        return (

            <div className="create-ticket-success">

                <div className="success-card">

                    <div className="success-check">
                        ✓
                    </div>

                    <h1>
                        Ticket Created Successfully
                    </h1>

                    {createdTicketId !== "created" && (

                        <p className="ticket-number">
                            Ticket #{createdTicketId}
                        </p>

                    )}

                    <p className="success-description">
                        Your ticket has been submitted successfully.
                        Our customer support team will review your request
                        and contact you via email within 3–5 working days.
                    </p>

                    <p className="redirect-message">
                        Redirecting to Dashboard{" "}
                        in{" "}
                        <strong>
                            {redirectCountdown}
                        </strong>{" "}
                        seconds...
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="success-dashboard-button"
                    >
                        Go to Dashboard Now
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="create-ticket">

            <h1>Create Ticket</h1>

            {errorMessage && (

                <div className="create-ticket-error">
                    {errorMessage}
                </div>

            )}

            <form onSubmit={handleSubmit}>

                <label>
                    Ticket Title
                </label>

                <input
                    type="text"
                    name="ticket_title"
                    value={ticket.ticket_title}
                    onChange={handleChange}
                    placeholder="Enter Ticket Title"
                    required
                />

                <label>
                    Category
                </label>

                <select
                    name="category"
                    value={ticket.category}
                    onChange={handleChange}
                >

                    <option value="Software">
                        Software
                    </option>

                    <option value="Hardware">
                        Hardware
                    </option>

                    <option value="Network">
                        Network
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

                <label>
                    Priority
                </label>

                <select
                    name="priority"
                    value={ticket.priority}
                    onChange={handleChange}
                >

                    <option value="Low">
                        Low
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="High">
                        High
                    </option>

                    <option value="Critical">
                        Critical
                    </option>

                </select>

                <label>
                    Department
                </label>

                <select
                    name="department"
                    value={ticket.department}
                    onChange={handleChange}
                >

                    <option value="IT Support">
                        IT Support
                    </option>

                    <option value="Technical Support">
                        Technical Support
                    </option>

                    <option value="Network">
                        Network
                    </option>

                    <option value="HR">
                        HR
                    </option>

                    <option value="Finance">
                        Finance
                    </option>

                </select>

                <label>
                    Assign To
                </label>

                <select
                    name="assigned_to"
                    value={ticket.assigned_to}
                    onChange={handleChange}
                >

                    <option value="">
                        Unassigned
                    </option>

                    {agents.map((agent) => (

                        <option
                            key={agent.id}
                            value={agent.id}
                        >
                            {agent.full_name} — {agent.email}
                        </option>

                    ))}

                </select>

                <label>
                    Description
                </label>

                <textarea
                    rows="6"
                    name="description"
                    value={ticket.description}
                    onChange={handleChange}
                    placeholder="Describe your issue..."
                />

                <label>
                    Attachment
                </label>

                <input
                    type="file"
                    name="attachment"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleAttachmentChange}
                />

                <small className="attachment-help">
                    Supported: JPG, PNG, PDF, DOC, DOCX • Maximum size: 5 MB
                </small>

                {attachment && (

                    <div className="selected-file">
                        📎 {attachment.name}
                    </div>

                )}

                <button
                    type="submit"
                    disabled={creating}
                >
                    {creating
                        ? "Creating Ticket..."
                        : "Create Ticket"}
                </button>

            </form>

        </div>

    );

}

export default CreateTicket;