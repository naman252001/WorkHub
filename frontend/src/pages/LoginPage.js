import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Step 1: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://workhub-6jze.onrender.com/api/auth/login",
        credentials,
        { withCredentials: true } // ✅ Important
      );
      if (res.data.success) {
        alert("Password verified! OTP sent to your email.");
        setOtpMode(true);
        setTimeLeft(30);
        setCanResend(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://workhub-6jze.onrender.com/api/auth/verify-otp",
        { email: credentials.email, otp },
        { withCredentials: true } // ✅ Important
      );
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigate(user.role === "Manager" ? "/manager" : "/employee");
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  // Step 3: Resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await axios.post(
        "https://workhub-6jze.onrender.com/api/auth/resend-otp",
        { email: credentials.email },
        { withCredentials: true } // ✅ Important
      );
      if (res.data.success) {
        alert("New OTP sent!");
        setTimeLeft(30);
        setCanResend(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to resend OTP");
    }
  };

  // Countdown effect
  useEffect(() => {
    if (otpMode && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) setCanResend(true);
  }, [otpMode, timeLeft]);

  return (
    <div className="auth-wrapper">
      <div className="cont">
        <div className="form sign-in">
          <h2>Welcome Back</h2>

          {!otpMode ? (
            <form onSubmit={handleLogin}>
              <label>
                <span>Email</span>
                <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
              </label>
              <label>
                <span>Password</span>
                <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
              </label>
              <p className="forgot-pass" onClick={() => navigate("/forgot-password")}>Forgot password?</p>
              <button type="submit" className="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <label>
                <span>Enter OTP</span>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </label>
              <button type="submit" className="submit">Verify OTP</button>
              <div className="otp-timer">
                {!canResend ? <p>Resend OTP in {timeLeft}s</p> :
                <button type="button" className="resend-btn" onClick={handleResendOtp}>Resend OTP</button>}
              </div>
            </form>
          )}

          <p className="auth-link">New user? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
