import { FaBell, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="navbar">

            <h2>Issue Tracking System</h2>

            <div className="navbar-right">

                <FaBell className="icon"/>

                <div className="profile">

                    <FaUserCircle className="user-icon"/>

                    <span>{user?.full_name}</span>

                </div>

            </div>

        </div>

    );

}

export default Navbar;