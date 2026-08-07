import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateTicket from "../pages/CreateTicket";
import ViewTicket from "../pages/ViewTicket";
import Reports from "../pages/Reports";
import ForgotPassword from "../pages/ForgotPassword";
import OTPLogin from "../pages/OTPLogin";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/otp-login" element={<OTPLogin />} />

      <Route path="/reset-password" element={<ResetPassword />} />

<Route path="/create-ticket" element={<CreateTicket />} />

<Route path="/view-tickets" element={<ViewTicket />} />

<Route path="/reports" element={<Reports />} />

    </Routes>
  );
}

export default AppRoutes;