import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await API.post("/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            alert("Login Successful");
            navigate("/dashboard");

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Network Error"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Issue Tracking System</h1>
                <p>Welcome Back</p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button onClick={handleLogin}>
                    Login
                </button>

                <button
                    type="button"
                    className="otp-btn"
                    onClick={() => navigate("/otp-login")}
                >
                    Login with OTP
                </button>

                <p
                    className="link"
                    onClick={() => navigate("/forgot-password")}
                >
                    Forgot Password?
                </p>

                <p
                    className="link"
                    onClick={() => navigate("/register")}
                >
                    Create New Account
                </p>
            </div>
        </div>
    );
}

export default Login;