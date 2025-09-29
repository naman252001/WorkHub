import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtpForReset, resetPasswordWithOtp } from "../api/authApi";
import "./ForgotPassword.css"; // Assuming you want to keep the styling

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP/Password, 3: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            // Step 1: Request OTP
            const { data } = await requestOtpForReset(email);
            setMessage(data.msg || "An OTP has been sent to your email.");
            setStep(2); // Move to OTP verification/Password input step
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to send OTP. Please check your email.");
        }
    };

    const handleOtpAndNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            return setError("New passwords do not match.");
        }

        if (password.length < 6) { 
            return setError("Password must be at least 6 characters long.");
        }

        try {
            // Step 2: Verify OTP and Reset Password
            const { data } = await resetPasswordWithOtp(email, otp, password);
            setMessage(data.msg || "Your password has been reset successfully!");
            setStep(3); // Move to Success/Login step
        } catch (err) {
            setError(err.response?.data?.msg || "OTP verification or password reset failed. Please check your OTP.");
        }
    };

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleEmailSubmit}>
                        {/* <p className="auth-instruction">Enter your registered email to receive a password reset OTP.</p> */}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="auth-btn">
                            Send OTP
                        </button>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={handleOtpAndNewPasswordSubmit}>
                        <p className="auth-instruction">Enter the 6-digit OTP sent to **{email}** and your new password.</p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className="auth-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                            required
                        />
                        <input
                            type="password"
                            placeholder="New Password (min 6 chars)"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="auth-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="auth-btn">
                            Reset Password
                        </button>
                        <button type="button" className="auth-btn secondary-btn mt-2" onClick={() => setStep(1)}>
                            Change Email
                        </button>
                    </form>
                );
            case 3:
                return (
                    <div>
                        <p className="auth-instruction success-text">{message}</p>
                        <button type="button" className="auth-btn" onClick={() => navigate("/login")}>
                            Go to Login
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Password Reset</h2>
                {renderContent()}
                {message && step !== 3 && <p className="auth-message success">{message}</p>}
                {error && <p className="auth-message error">{error}</p>}
                <p className="auth-link mt-3">
                    Remember your password? <Link to="/login">Go to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;