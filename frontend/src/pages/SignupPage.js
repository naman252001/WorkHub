// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import "./AuthForm.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       await axios.post(`${API_BASE_URL}/api/auth/signup`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         rePassword: formData.confirmPassword,   // 🔹 Add this line
//         role: formData.role,
//       });

//       alert("Signup successful! Please log in.");
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.msg || "Signup failed");
//     }
//   };

//   // 🔹 Google Signup
//   const handleGoogleSignup = () => {
//     window.location.href = `${API_BASE_URL}/api/auth/google`;
//   };

//   // 🔹 Microsoft Signup
//   const handleMicrosoftSignup = () => {
//     window.location.href = `${API_BASE_URL}/api/auth/microsoft`;
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="cont s--signup">
//         <div className="form sign-up">
//           <h2>Create Your Account</h2>

//           <form onSubmit={handleSignup}>
//             <label>
//               <span>Name</span>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Email</span>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Password</span>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Confirm Password</span>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Role</span>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 <option value="Employee">Employee</option>
//                 <option value="Manager">Manager</option>
//               </select>
//             </label>

//             <div className="form-buttons">
//               <button type="submit" className="submit">
//                 Sign Up
//               </button>
//             </div>
//           </form>

//           {/* 🔹 Social Login Section */}
//           <div className="social-login">
//             <p>Or sign up with:</p>
//             <div className="social-buttons">
//               <button type="button" onClick={handleGoogleSignup}>
//                 <img
//                   src="https://img.icons8.com/color/48/google-logo.png"
//                   alt="Google"
//                 />
//               </button>
//               {/* <button type="button" onClick={handleMicrosoftSignup}>
//                 <img
//                   src="https://img.icons8.com/color/48/microsoft.png"
//                   alt="Microsoft"
//                 />
//               </button> */}
//             </div>
//           </div>

//           <p className="auth-link">
//             Already registered? <Link to="/login">Login here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rePassword: formData.confirmPassword,
        role: formData.role,
      });
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-2"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
        <h2 className="text-center text-white mb-3" style={{ fontSize: "26px", fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div className="mb-2" key={field}>
              <label className="form-label text-secondary" style={{ fontWeight: 500, fontSize: "15px" }}>
                {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
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

          {/* Role Dropdown */}
          <div className="mb-2">
            <label className="form-label text-secondary" style={{ fontWeight: 500, fontSize: "15px" }}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-select"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: formData.role ? "#fff" : "#ccc",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "10px 14px",
                fontSize: "14px",
                transition: "all 0.3s ease",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
            >
                <option value="" disabled hidden>Select Role</option>
                <option value="Employee" style={{ background: "#3f3e3eff", color: "#fff" }}>Employee</option>
                <option value="Manager" style={{ background: "#3f3e3eff", color: "#fff" }}>Manager</option>
            </select>
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
            Sign Up
          </button>
        </form>

        {/* Social Login */}
        <div className="text-center mt-3 pt-2 border-top border-white-50">
          <p className="text-white mb-2" style={{ fontSize: "14px" }}>Or sign up with:</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="border-0 rounded-circle p-2"
              style={{ background: "rgba(255,255,255,0.15)", transition: "all 0.3s ease" }}
            >
              <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" style={{ width: "25px", height: "25px" }} />
            </button>
          </div>
        </div>

        <p className="text-center mt-3 mb-0" style={{ color: "#fff", fontSize: "14px" }}>
          Already registered? <Link to="/login" style={{ color: "#ff9800", fontWeight: 600, textDecoration: "none" }}>Login here</Link>
        </p>
      </div>

      {/* Keyframe fadeIn + focus/hover */}
      <style>
        {`
          @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          input:focus, select:focus { background: rgba(255,255,255,0.25); box-shadow: 0 0 8px rgba(255,152,0,1); border-color: #ff9800; color: #fff; }
          select option:hover { background: rgba(255,255,255,0.2); color: #fff; }
          button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,152,0,0.4); }
          button[type="submit"]:hover { background: linear-gradient(135deg, #e68900, #e64a19); }
          button:disabled { opacity:0.7; cursor:not-allowed; transform:none; box-shadow:none; }
          button:focus { outline:none; box-shadow:none; }
        `}
      </style>
    </div>
  );
};

export default Signup;
