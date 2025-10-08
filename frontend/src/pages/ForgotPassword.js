// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { requestOtpForReset, resetPasswordWithOtp } from "../api/authApi";
// import "./ForgotPassword.css"; // Assuming you want to keep the styling

// const ForgotPassword = () => {
//     const navigate = useNavigate();
//     const [step, setStep] = useState(1); // 1: Email, 2: OTP/Password, 3: Success
//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     const handleEmailSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setMessage("");

//         try {
//             // Step 1: Request OTP
//             const { data } = await requestOtpForReset(email);
//             setMessage(data.msg || "An OTP has been sent to your email.");
//             setStep(2); // Move to OTP verification/Password input step
//         } catch (err) {
//             setError(err.response?.data?.msg || "Failed to send OTP. Please check your email.");
//         }
//     };

//     const handleOtpAndNewPasswordSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setMessage("");

//         if (password !== confirmPassword) {
//             return setError("New passwords do not match.");
//         }

//         if (password.length < 6) { 
//             return setError("Password must be at least 6 characters long.");
//         }

//         try {
//             // Step 2: Verify OTP and Reset Password
//             const { data } = await resetPasswordWithOtp(email, otp, password);
//             setMessage(data.msg || "Your password has been reset successfully!");
//             setStep(3); // Move to Success/Login step
//         } catch (err) {
//             setError(err.response?.data?.msg || "OTP verification or password reset failed. Please check your OTP.");
//         }
//     };

//     const renderContent = () => {
//         switch (step) {
//             case 1:
//                 return (
//                     <form onSubmit={handleEmailSubmit}>
//                         {/* <p className="auth-instruction">Enter your registered email to receive a password reset OTP.</p> */}
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             className="auth-input"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                         <button type="submit" className="auth-btn">
//                             Send OTP
//                         </button>
//                     </form>
//                 );
//             case 2:
//                 return (
//                     <form onSubmit={handleOtpAndNewPasswordSubmit}>
//                         <p className="auth-instruction">Enter the 6-digit OTP sent to **{email}** and your new password.</p>
//                         <input
//                             type="text"
//                             placeholder="Enter 6-digit OTP"
//                             className="auth-input"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             maxLength="6"
//                             required
//                         />
//                         <input
//                             type="password"
//                             placeholder="New Password (min 6 chars)"
//                             className="auth-input"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <input
//                             type="password"
//                             placeholder="Confirm New Password"
//                             className="auth-input"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                         <button type="submit" className="auth-btn">
//                             Reset Password
//                         </button>
//                         <button type="button" className="auth-btn secondary-btn mt-2" onClick={() => setStep(1)}>
//                             Change Email
//                         </button>
//                     </form>
//                 );
//             case 3:
//                 return (
//                     <div>
//                         <p className="auth-instruction success-text">{message}</p>
//                         <button type="button" className="auth-btn" onClick={() => navigate("/login")}>
//                             Go to Login
//                         </button>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-box">
//                 <h2 className="auth-title">Password Reset</h2>
//                 {renderContent()}
//                 {message && step !== 3 && <p className="auth-message success">{message}</p>}
//                 {error && <p className="auth-message error">{error}</p>}
//                 <p className="auth-link mt-3">
//                     Remember your password? <Link to="/login">Go to Login</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;


// ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtpForReset, resetPasswordWithOtp } from "../api/authApi";

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
      const { data } = await requestOtpForReset(email);
      setMessage(data.msg || "An OTP has been sent to your email.");
      setStep(2);
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
      const { data } = await resetPasswordWithOtp(email, otp, password);
      setMessage(data.msg || "Your password has been reset successfully!");
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.msg || "OTP verification or password reset failed. Please check your OTP."
      );
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn w-100 text-white"
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                fontWeight: 700,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Send OTP
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleOtpAndNewPasswordSubmit}>
            <p className="text-white mb-3" style={{ fontSize: "14px" }}>
              Enter the 6-digit OTP sent to <strong>{email}</strong> (Please check your spam).
            </p>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="Confirm New Password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 14px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn w-100 text-white mb-2"
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                fontWeight: 700,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Reset Password
            </button>
            <button
              type="button"
              className="btn w-100 btn-outline-light"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          </form>
        );
      case 3:
        return (
          <div className="text-center">
            <p className="text-success mb-3">{message}</p>
            <button
              type="button"
              className="btn w-100 text-white"
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                fontWeight: 700,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
              }}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-2"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(12px)",
          zIndex: 0,
        }}
      ></div>

      <div
        className="p-3"
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "20px",
          backdropFilter: "blur(18px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid rgba(255,255,255,0.2)",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        <h2
          className="text-center text-white mb-3"
          style={{
            fontSize: "26px",
            fontWeight: 700,
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          Password Reset
        </h2>

        {renderContent()}

        {error && (
          <p className="text-danger mt-2" style={{ fontSize: "14px" }}>
            {error}
          </p>
        )}

        <p className="text-center mt-3 mb-0" style={{ color: "#fff", fontSize: "14px" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: "#ff9800", fontWeight: 600, textDecoration: "none" }}>
            Go to Login
          </Link>
        </p>

        {/* Keyframes & input focus */}
        <style>
          {`
            @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            input:focus { background: rgba(255,255,255,0.25); box-shadow: 0 0 8px rgba(255,152,0,1); border-color: #ff9800; color: #fff; }
            button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,152,0,0.4); }
            button:focus { outline:none; box-shadow:none; }
          `}
        </style>
      </div>
    </div>
  );
};

export default ForgotPassword;
