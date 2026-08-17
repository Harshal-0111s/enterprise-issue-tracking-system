import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/ticketApi";
import "./Departments.css";

const departmentNames = [
    "IT Support",
    "Technical Support",
    "Network",
    "HR",
    "Finance"
];

function Departments() {

    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDepartmentData();
    }, []);

    const fetchDepartmentData = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/tickets");

            const tickets = response.data.tickets || [];

            const departmentData = departmentNames.map(
                (department) => {

                    const departmentTickets = tickets.filter(
                        (ticket) =>
                            ticket.department === department
                    );

                    return {
                        name: department,
                        total: departmentTickets.length,
                        open: departmentTickets.filter(
                            (ticket) =>
                                ticket.status === "Open"
                        ).length,
                        inProgress: departmentTickets.filter(
                            (ticket) =>
                                ticket.status === "In Progress"
                        ).length,
                        resolved: departmentTickets.filter(
                            (ticket) =>
                                ticket.status === "Resolved"
                        ).length,
                        closed: departmentTickets.filter(
                            (ticket) =>
                                ticket.status === "Closed"
                        ).length
                    };
                }
            );

            setDepartments(departmentData);

        } catch (error) {

            console.error(
                "Unable to fetch department data:",
                error
            );

            setError(
                "Unable to load department information."
            );

        } finally {

            setLoading(false);

        }
    };

    const viewDepartmentTickets = (department) => {

        navigate(
            `/view-tickets?department=${encodeURIComponent(
                department
            )}`
        );

    };

    if (loading) {

        return (
            <div className="departments-page">

                <div className="departments-loading">
                    Loading departments...
                </div>

            </div>
        );

    }

    return (

        <div className="departments-page">

<div className="departments-header">

    <div>

        <h1>Departments</h1>

        <p>
            Monitor ticket workload across support departments.
        </p>

    </div>

    <button
        className="back-dashboard-button"
        onClick={() => navigate("/dashboard")}
    >
        Back to Dashboard
    </button>

</div>

            {error && (

                <div className="departments-error">
                    {error}
                </div>

            )}


            <div className="department-grid">

                {departments.map(
                    (department) => (

                        <div
                            className="department-card"
                            key={department.name}
                        >

                            <div className="department-card-header">

                                <div className="department-icon">
                                    {department.name
                                        .charAt(0)}
                                </div>

                                <div>

                                    <h2>
                                        {department.name}
                                    </h2>

                                    <span>
                                        {department.total}{" "}
                                        {department.total === 1
                                            ? "Ticket"
                                            : "Tickets"}
                                    </span>

                                </div>

                            </div>


                            <div className="department-stats">

                                <div className="department-stat">

                                    <strong>
                                        {department.open}
                                    </strong>

                                    <span>
                                        Open
                                    </span>

                                </div>


                                <div className="department-stat">

                                    <strong>
                                        {department.inProgress}
                                    </strong>

                                    <span>
                                        In Progress
                                    </span>

                                </div>


                                <div className="department-stat">

                                    <strong>
                                        {department.resolved}
                                    </strong>

                                    <span>
                                        Resolved
                                    </span>

                                </div>


                                <div className="department-stat">

                                    <strong>
                                        {department.closed}
                                    </strong>

                                    <span>
                                        Closed
                                    </span>

                                </div>

                            </div>


                            <button
                                className="department-view-button"
                                onClick={() =>
                                    viewDepartmentTickets(
                                        department.name
                                    )
                                }
                            >
                                View Tickets
                            </button>

                        </div>

                    )
                )}

            </div>

        </div>

    );

}

export default Departments;
