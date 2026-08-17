import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";
import API from "../api/ticketApi";
import "./Users.css";

function Users() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/users");

            setUsers(response.data.users || []);

        } catch (err) {

            console.error("Unable to fetch users:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    };

    const filteredUsers = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return users;
        }

        return users.filter((user) =>
            `${user.full_name} ${user.email} ${user.role}`
                .toLowerCase()
                .includes(value)
        );

    }, [users, search]);

    const verifiedCount = users.filter(
        (user) => Number(user.is_verified) === 1
    ).length;

    const employeeCount = users.filter(
        (user) => user.role === "Employee"
    ).length;

    const formatDate = (date) => {

        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };

    const getRoleClass = (role) => {

        if (role === "Admin") return "role-admin";
        if (role === "Employee") return "role-employee";

        return "role-user";

    };

    return (

        <div className="dashboard-content">

            <main className="users-page">

                <div className="users-header">

                    <div>

                        <span className="users-eyebrow">
                            ADMINISTRATION
                        </span>

                        <h1>
                            Users
                        </h1>

                        <p>
                            Manage and review users registered in the
                            enterprise support system.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="users-back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>

                </div>


                <div className="users-summary">

                    <div className="user-summary-card">

                        <div className="summary-icon">
                            <FaUsers />
                        </div>

                        <div>
                            <span>Total Users</span>
                            <strong>{users.length}</strong>
                        </div>

                    </div>


                    <div className="user-summary-card">

                        <div className="summary-icon">
                            <FaCheckCircle />
                        </div>

                        <div>
                            <span>Verified Users</span>
                            <strong>{verifiedCount}</strong>
                        </div>

                    </div>


                    <div className="user-summary-card">

                        <div className="summary-icon">
                            <FaClock />
                        </div>

                        <div>
                            <span>Support Employees</span>
                            <strong>{employeeCount}</strong>
                        </div>

                    </div>

                </div>


                <section className="users-card">

                    <div className="users-toolbar">

                        <div>

                            <h2>
                                User Directory
                            </h2>

                            <span>
                                {filteredUsers.length} user
                                {filteredUsers.length !== 1 ? "s" : ""}
                            </span>

                        </div>

                        <div className="users-search">

                            <FaSearch />

                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {loading ? (

                        <div className="users-state">
                            Loading users...
                        </div>

                    ) : error ? (

                        <div className="users-state users-error">
                            {error}
                        </div>

                    ) : filteredUsers.length === 0 ? (

                        <div className="users-state">
                            No users found.
                        </div>

                    ) : (

                        <div className="users-table-wrapper">

                            <table className="users-table">

                                <thead>

                                    <tr>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Role
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Registered
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsers.map((user) => (

                                        <tr key={user.id}>

                                            <td>

                                                <div className="user-name-cell">

                                                    <div className="user-avatar">
                                                        {user.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {user.full_name}
                                                        </strong>

                                                        <small>
                                                            User #{user.id}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {user.email}
                                            </td>


                                            <td>

                                                <span
                                                    className={`user-role ${getRoleClass(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role || "User"}
                                                </span>

                                            </td>


                                            <td>

                                                {Number(user.is_verified) === 1 ? (

                                                    <span className="user-status verified">
                                                        <FaCheckCircle />
                                                        Verified
                                                    </span>

                                                ) : (

                                                    <span className="user-status pending">
                                                        <FaClock />
                                                        Unverified
                                                    </span>

                                                )}

                                            </td>


                                            <td>
                                                {formatDate(user.created_at)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

}

export default Users;
