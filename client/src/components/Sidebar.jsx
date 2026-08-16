import {
    FaTachometerAlt,
    FaTicketAlt,
    FaPlusCircle,
    FaChartBar,
    FaUsers,
    FaBuilding,
    FaCog,
    FaSignOutAlt,
    FaHeadset
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    const disabledMenu = (event) => {
        event.preventDefault();
    };

    return (

        <aside className="sidebar">

            {/* Brand */}
            <div className="sidebar-brand">

                <div className="brand-icon">
                    <FaHeadset />
                </div>

                <div>
                    <h2>Issue Tracker</h2>
                    <span>Enterprise Support</span>
                </div>

            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">


                {/* Workspace */}
                <div className="nav-section">

                    <div className="nav-section-title">
                        WORKSPACE
                    </div>


                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `menu-link ${isActive ? "active" : ""}`
                        }
                    >

                        <FaTachometerAlt />

                        <span>Dashboard</span>

                    </NavLink>


                    <NavLink
                        to="/view-tickets"
                        className={({ isActive }) =>
                            `menu-link ${isActive ? "active" : ""}`
                        }
                    >

                        <FaTicketAlt />

                        <span>All Tickets</span>

                    </NavLink>


                    <NavLink
                        to="/create-ticket"
                        className={({ isActive }) =>
                            `menu-link ${isActive ? "active" : ""}`
                        }
                    >

                        <FaPlusCircle />

                        <span>Create Ticket</span>

                    </NavLink>

                </div>


                {/* Management */}
                <div className="nav-section">

                    <div className="nav-section-title">
                        MANAGEMENT
                    </div>


                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `menu-link ${isActive ? "active" : ""}`
                        }
                    >

                        <FaChartBar />

                        <span>Reports</span>

                    </NavLink>

                </div>


                {/* Administration */}
                <div className="nav-section">

                    <div className="nav-section-title">
                        ADMINISTRATION
                    </div>


                    <a
                        href="#users"
                        className="menu-link disabled-link"
                        onClick={disabledMenu}
                    >

                        <FaUsers />

                        <span>Users</span>

                        <small>SOON</small>

                    </a>


                    <a
                        href="#departments"
                        className="menu-link disabled-link"
                        onClick={disabledMenu}
                    >

                        <FaBuilding />

                        <span>Departments</span>

                        <small>SOON</small>

                    </a>


                    <a
                        href="#settings"
                        className="menu-link disabled-link"
                        onClick={disabledMenu}
                    >

                        <FaCog />

                        <span>Settings</span>

                        <small>SOON</small>

                    </a>

                </div>

            </nav>


            {/* Logout */}
            <div className="sidebar-footer">

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    <FaSignOutAlt />

                    <span>Logout</span>

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
