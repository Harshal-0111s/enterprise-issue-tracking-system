import {
    FaTachometerAlt,
    FaTicketAlt,
    FaPlusCircle,
    FaChartBar,
    FaSignOutAlt
} from "react-icons/fa";

import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {

  return (

    <div className="sidebar">

      <h2 className="logo">Issue Tracker</h2>

      <ul>

        <Link to="/dashboard" className="menu-link">
          <li>
            <FaTachometerAlt />
            Dashboard
          </li>
        </Link>

        <Link to="/view-tickets" className="menu-link">
          <li>
            <FaTicketAlt />
            View Tickets
          </li>
        </Link>

        <Link to="/create-ticket" className="menu-link">
          <li>
            <FaPlusCircle />
            Create Ticket
          </li>
        </Link>

       <Link to="/reports" className="menu-link">
    <li>
        <FaChartBar />
        Reports
    </li>
</Link>

{/* Users - Coming Soon */}

       <li
    className="logout"
    onClick={() => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";

    }}
>
    <FaSignOutAlt /> Logout
</li>

      </ul>

    </div>

  );

}

export default Sidebar;
