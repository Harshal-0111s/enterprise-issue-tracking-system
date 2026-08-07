import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import "../styles/Login.css";

function ResetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("resetEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const resetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/forgot/reset", {
                email,
                code,
                new_password: newPassword
            });

            alert(response.data.message);
            localStorage.removeItem("resetEmail");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Issue Tracking System</h1>
                <p>Reset Password</p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter Reset Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={resetPassword} disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="link" onClick={() => navigate("/")}>
                    Back to Login
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;