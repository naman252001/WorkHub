// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    // CHANGE 1: Import the correctly named function for link-based reset
    resetPasswordLink, 
    // CHANGE 2: Import the missing validation function
    validateResetToken 
} from '../api/authApi';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Using the imported validateResetToken function
        await validateResetToken(token);
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
        setMessage(err.response?.data?.msg || "Invalid or expired token."); // Use 'msg' as per your backend
      }
    };
    if (token) validateToken();
    else setIsValidToken(false); // Handle case where no token is present
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault(); // Added to prevent form submission if wrapped in a form
    if (!isValidToken) return;
    try {
      // CHANGE 3: Use the correctly named function
      const { data } = await resetPasswordLink(token, password);
      setMessage(data.msg || "Password reset successfully! You can now log in."); // Use 'msg' as per your backend
      // Optional: Redirect user to login after success
      // setTimeout(() => { navigate("/login") }, 3000); 
    } catch (err) {
      setMessage(err.response?.data?.msg || "Password reset failed."); // Use 'msg' as per your backend
    }
  };

  if (isValidToken === null) return <div className="auth-container"><div className="auth-box"><h2>Validating Token...</h2></div></div>;
  if (!isValidToken) return <div className="auth-container"><div className="auth-box"><h2 className="auth-title">Reset Failed</h2><p className="auth-message error">{message}</p></div></div>;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Reset Password</button>
        </form>
        <p className={`auth-message ${message.includes("success") || message.includes("successful") ? "success" : "error"}`}>{message}</p>
      </div>
    </div>
  );
};

export default ResetPassword;