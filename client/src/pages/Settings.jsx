import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Settings.css";

function Settings() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const [notifications, setNotifications] = useState(
        localStorage.getItem("notifications") !== "off"
    );

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Unable to read user information:", error);
            }
        }

    }, []);

    useEffect(() => {

        document.body.classList.toggle("dark-mode", darkMode);

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );

    }, [darkMode]);

    const handleNotifications = () => {

        const newValue = !notifications;

        setNotifications(newValue);

        localStorage.setItem(
            "notifications",
            newValue ? "on" : "off"
        );

    };

    return (
        <div className="settings-layout">

            <Sidebar />

            <div className="settings-content">

                <Navbar />

                <main className="settings-main">

                    <button
                        className="settings-back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <div className="settings-header">

                        <div>
                            <div className="settings-eyebrow">
                                ACCOUNT
                            </div>

                            <h1>
                                Settings
                            </h1>

                            <p>
                                Manage your account and application preferences.
                            </p>
                        </div>

                    </div>


                    {/* PROFILE */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div>
                                <h2>
                                    Profile
                                </h2>

                                <p>
                                    Your account information
                                </p>
                            </div>

                        </div>

                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    Full Name
                                </label>

                                <div className="profile-value">
                                    {user?.full_name || "Harshal Sarve"}
                                </div>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Email
                                </label>

                                <div className="profile-value">
                                    {user?.email || "Not available"}
                                </div>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Role
                                </label>

                                <div className="profile-value">
                                    {user?.role || "User"}
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* APPEARANCE */}

                    <section className="settings-card">

                        <div className="settings-row">

                            <div>

                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Choose how the application looks.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`settings-toggle ${
                                    darkMode ? "active" : ""
                                }`}
                                onClick={() =>
                                    setDarkMode(!darkMode)
                                }
                                aria-label="Toggle dark mode"
                            >

                                <span className="toggle-circle">
                                    {darkMode ? "🌙" : "☀️"}
                                </span>

                            </button>

                        </div>

                        <div className="settings-status">

                            Current theme:
                            <strong>
                                {darkMode ? " Dark" : " Light"}
                            </strong>

                        </div>

                    </section>


                    {/* NOTIFICATIONS */}

                    <section className="settings-card">

                        <div className="settings-row">

                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Control application notification preferences.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`settings-toggle ${
                                    notifications ? "active" : ""
                                }`}
                                onClick={handleNotifications}
                                aria-label="Toggle notifications"
                            >

                                <span className="toggle-circle">
                                    {notifications ? "✓" : "×"}
                                </span>

                            </button>

                        </div>

                        <div className="settings-status">

                            Notifications:
                            <strong>
                                {notifications ? " Enabled" : " Disabled"}
                            </strong>

                        </div>

                    </section>


                    <div className="settings-footer-note">

                        Settings changes are stored locally for this application.

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Settings;
