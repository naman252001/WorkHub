// // Login.jsx

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import "./AuthForm.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const Login = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [otpMode, setOtpMode] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [timeLeft, setTimeLeft] = useState(30); // countdown in seconds
//   const [canResend, setCanResend] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   // Step 1: Verify email & password, then request OTP
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
//       if (res.data.success) {
//         alert("Password verified! OTP sent to your email.");
//         setOtpMode(true);
//         setTimeLeft(30); // reset timer
//         setCanResend(false);
//       }
//     } catch (err) {
//       alert(err.response?.data?.msg || "Login failed");
//     }
//   };

//   // Step 2: Verify OTP after password is correct
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
//         email: credentials.email,
//         otp,
//       });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       onLogin(user);
//       navigate(user.role === "Manager" ? "/manager" : "/employee");
//     } catch (err) {
//       alert(err.response?.data?.msg || "OTP verification failed");
//     }
//   };

//   // Step 3: Resend OTP
//   const handleResendOtp = async () => {
//     try {
//       const res = await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, {
//         email: credentials.email,
//       });
//       if (res.data.success) {
//         alert("New OTP sent to your email!");
//         setTimeLeft(30); // restart countdown
//         setCanResend(false);
//       }
//     } catch (err) {
//       alert(err.response?.data?.msg || "Failed to resend OTP");
//     }
//   };

//   // Countdown effect
//   useEffect(() => {
//     if (otpMode && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (timeLeft === 0) {
//       setCanResend(true);
//     }
//   }, [otpMode, timeLeft]);

//   return (
//     <div className="auth-wrapper">
//       <div className="cont">
//         <div className="form sign-in">
//           <h2>Welcome Back</h2>

//           {!otpMode ? (
//             <form onSubmit={handleLogin}>
//               <label>
//                 <span>Email</span>
//                 <input
//                   type="email"
//                   name="email"
//                   value={credentials.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </label>
//               <label>
//                 <span>Password</span>
//                 <input
//                   type="password"
//                   name="password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </label>

//               <p
//                 className="forgot-pass"
//                 onClick={() => navigate("/forgot-password")}
//               >
//                 Forgot password?
//               </p>

//               <button type="submit" className="submit">Login</button>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp}>
//               <label>
//                 <span>Enter OTP</span>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//               </label>

//               <button type="submit" className="submit">Verify OTP</button>

//               {/* Countdown / Resend */}
//               <div className="otp-timer">
//                 {!canResend ? (
//                   <p>Resend OTP in {timeLeft}s</p>
//                 ) : (
//                   <button
//                     type="button"
//                     className="resend-btn"
//                     onClick={handleResendOtp}
//                   >
//                     Resend OTP
//                   </button>
//                 )}
//               </div>
//             </form>
//           )}

//           {/* <div className="social-login">
//             <p>Or login with:</p>
//             <div className="social-buttons">
//               <button onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`}>
//                 <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" />
//               </button>
//             </div>
//           </div> */}

//           <p className="auth-link">
//             New user? <Link to="/signup">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// -----------------------------------------------------------------------------------------------------------


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false); // <-- new state for login button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button immediately
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);

      // ✅ If backend says token already (logged in today), skip OTP
      if (res.data.token) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(user);
        navigate(user.role === "Manager" ? "/manager" : "/employee");
        return;
      }

      // Otherwise, OTP mode
      if (res.data.success) {
        alert("Password verified! OTP sent to your email.");
        setOtpMode(true);
        setTimeLeft(30);
        setCanResend(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false); // Re-enable button if needed
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: credentials.email,
        otp,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigate(user.role === "Manager" ? "/manager" : "/employee");
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {
        email: credentials.email,
      });
      if (res.data.success) {
        alert("New OTP sent to your email!");
        setTimeLeft(30);
        setCanResend(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (otpMode && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [otpMode, timeLeft]);

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

      {/* Form Container */}
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
          Welcome Back
        </h2>

        {!otpMode ? (
          <form onSubmit={handleLogin}>
            {["email", "password"].map((field) => (
              <div className="mb-2" key={field}>
                <label
                  className="form-label text-secondary"
                  style={{ fontWeight: 500, fontSize: "15px" }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "password"}
                  name={field}
                  value={credentials[field]}
                  onChange={handleChange}
                  required
                  className="form-control"
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
            ))}
            <div className="d-flex justify-content-end mb-2">
              <p
                onClick={() => navigate("/forgot-password")}
                style={{
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "right",
                  display: "inline-block",
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
                className="text-white mb-2"
              >
                Forgot password?
              </p>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white mt-2"
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                fontSize: "16px",
                fontWeight: 700,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                transition: "all 0.3s ease",
              }}
              disabled={loading} // <-- disable button when sending OTP
            >
              {loading ? "Sending OTP..." : "Login"} {/* <-- show message */}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-2">
              <label
                className="form-label text-secondary"
                style={{ fontWeight: 500, fontSize: "15px" }}
              >
                Enter OTP (pls check spam also)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="form-control"
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
              className="btn w-100 text-white mt-2"
              style={{
                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                fontSize: "16px",
                fontWeight: 700,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                transition: "all 0.3s ease",
              }}
            >
              Verify OTP
            </button>

            <div className="text-center mt-2">
              {!canResend ? (
                <p style={{ color: "#fff", fontSize: "14px" }}>Resend OTP in {timeLeft}s</p>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <p className="text-center mt-3 mb-0" style={{ color: "#fff", fontSize: "14px" }}>
          New user?{" "}
          <Link to="/signup" style={{ color: "#ff9800", fontWeight: 600, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>

        <style>
          {`
            @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            input:focus { background: rgba(255,255,255,0.25); box-shadow: 0 0 8px rgba(255,152,0,1); border-color: #ff9800; color: #fff; }
            button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,152,0,0.4); }
            button:focus { outline:none; box-shadow:none; }
            button:disabled { opacity:0.7; cursor:not-allowed; transform:none; box-shadow:none; }
          `}
        </style>
      </div>
    </div>
  );
};

export default Login;

