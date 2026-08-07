import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import "../styles/Login.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [devCode, setDevCode] = useState("");

    const sendCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/forgot/send", { email });
            localStorage.setItem("resetEmail", email);
            setDevCode(response.data.devResetCode || "");
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Issue Tracking System</h1>
                <p>Forgot Password</p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button onClick={sendCode} disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Code"}
                </button>

                {devCode && (
                    <p style={{ marginTop: "12px", color: "#16a34a", fontSize: "14px" }}>
                        Development Reset Code: {devCode}
                    </p>
                )}

                <p className="link" onClick={() => navigate("/reset-password")}>
                    Go to Reset Password
                </p>

                <p className="link" onClick={() => navigate("/")}>
                    Back to Login
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;