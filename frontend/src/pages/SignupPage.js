import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

// Use the correct backend URL
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
        rePassword: formData.confirmPassword,   // 🔹 Add this line
        role: formData.role,
      });

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  // 🔹 Google Signup
  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  // 🔹 Microsoft Signup
  const handleMicrosoftSignup = () => {
    window.location.href = `${API_BASE_URL}/api/auth/microsoft`;
  };

  return (
    <div className="auth-wrapper">
      <div className="cont s--signup">
        <div className="form sign-up">
          <h2>Create Your Account</h2>

          <form onSubmit={handleSignup}>
            <label>
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>Role</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </label>

            <div className="form-buttons">
              <button type="submit" className="submit">
                Sign Up
              </button>
            </div>
          </form>

          {/* 🔹 Social Login Section */}
          <div className="social-login">
            <p>Or sign up with:</p>
            <div className="social-buttons">
              <button type="button" onClick={handleGoogleSignup}>
                <img
                  src="https://img.icons8.com/color/48/google-logo.png"
                  alt="Google"
                />
              </button>
              {/* <button type="button" onClick={handleMicrosoftSignup}>
                <img
                  src="https://img.icons8.com/color/48/microsoft.png"
                  alt="Microsoft"
                />
              </button> */}
            </div>
          </div>

          <p className="auth-link">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
