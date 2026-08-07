import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import "../styles/Login.css";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        full_name: "",
        email: "",
        mobile_number: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const response = await API.post("/register", {
                full_name: user.full_name,
                email: user.email,
                mobile_number: user.mobile_number,
                password: user.password
            });

            alert(response.data.message);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Issue Tracking System</h1>

                <p>Create New Account</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={user.full_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="mobile_number"
                        placeholder="Mobile Number"
                        value={user.mobile_number}
                        onChange={handleChange}
                        required
                    />

                    {/* Password */}

                    <div className="password-wrapper">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />

                        <span
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                    </div>

                    {/* Confirm Password */}

                    <div className="password-wrapper">

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <span
                            className="password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>

                    </div>

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p
                    className="link"
                    onClick={() => navigate("/")}
                >
                    Back to Login
                </p>

            </div>

        </div>

    );

}

export default Register;