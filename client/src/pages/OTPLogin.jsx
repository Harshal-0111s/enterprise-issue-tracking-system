import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import "../styles/Login.css";

function OTPLogin() {
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState("email");
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [devOtp, setDevOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/otp/send", {
                login_type: loginType,
                identifier
            });

            setOtpSent(true);
            setDevOtp(response.data.devOtp || "");
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post("/otp/verify", {
                login_type: loginType,
                identifier,
                otp
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Issue Tracking System</h1>
                <p>OTP Login</p>

                <select
                    value={loginType}
                    onChange={(e) => {
                        setLoginType(e.target.value);
                        setIdentifier("");
                        setOtp("");
                        setOtpSent(false);
                        setDevOtp("");
                    }}
                    style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
                >
                    <option value="email">Email OTP</option>
                    <option value="mobile">Mobile OTP</option>
                </select>

                <input
                    type={loginType === "mobile" ? "tel" : "email"}
                    placeholder={
                        loginType === "mobile"
                            ? "Enter Mobile Number"
                            : "Enter Email"
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />

                {otpSent && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        {devOtp && (
                            <p style={{ fontSize: "14px", color: "#16a34a", marginTop: "8px" }}>
                                Development OTP: {devOtp}
                            </p>
                        )}
                    </>
                )}

                {!otpSent ? (
                    <button onClick={sendOtp} disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                ) : (
                    <button onClick={verifyOtp} disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP & Login"}
                    </button>
                )}

                <p className="link" onClick={() => navigate("/")}>
                    Back to Login
                </p>
            </div>
        </div>
    );
}

export default OTPLogin;
