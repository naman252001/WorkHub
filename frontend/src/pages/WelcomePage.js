import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import "./WelcomePage.css";
import Footer from "../components/Footer"; 
import { FaTasks, FaUsers, FaChartLine, FaCalendarCheck, FaClipboardList } from "react-icons/fa";

function WelcomePage() {
  const navigate = useNavigate(); // ✅ Hook to navigate

  return (
    <div className="welcome-container">
      <div className="welcome-overlay">
        {/* Navbar-like top section */}
        <header className="welcome-header">
          <div className="welcome-logo">
            <img src="/logo/image.png" alt="Logo" />
          </div>
          <div className="welcome-brand">
            <h1 className="welcome-title">
              <strong>WorkHub</strong>
              <span className="welcome-slogan"> – Simplify Work. Empower Teams</span>
            </h1>
          </div>

          <div className="welcome-buttons">
            <button 
              className="btn-login"
              onClick={() => navigate("/login")} // ✅ Go to login page
            >
              <strong>Login</strong>
            </button>
            <button 
              className="btn-signup"
              onClick={() => navigate("/signup")} // ✅ Go to signup page
            >
              <strong>Sign Up</strong>
            </button>
          </div>
        </header>

        {/* Main greeting */}
        <section className="welcome-intro">
          <h2><strong>Your Productivity Partner</strong></h2>
          <p>
            <strong>
              WorkHub helps managers and employees collaborate efficiently.
              Track daily tasks, review past work, and monitor performance — all
              in one place.
            </strong>
          </p>
        </section>

        {/* First row - 3 cards */}
        <section className="welcome-features first-row">
          <div className="feature-card">
            <FaTasks className="feature-icon" />
            <h3><strong>Task Tracking</strong></h3>
            <p><strong>Assign, manage, and complete tasks with ease and transparency.</strong></p>
          </div>

          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3><strong>Team Collaboration</strong></h3>
            <p><strong>Seamless communication between managers and employees.</strong></p>
          </div>

          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3><strong>Performance Reports</strong></h3>
            <p><strong>Analyze productivity and track growth with detailed reports.</strong></p>
          </div>
        </section>

        {/* Second row - 2 centered cards */}
        <section className="welcome-features second-row">
          <div className="feature-card">
            <FaCalendarCheck className="feature-icon" />
            <h3><strong>Attendance Tracking</strong></h3>
            <p><strong>Monitor daily attendance and maintain accurate work records.</strong></p>
          </div>

          <div className="feature-card">
            <FaClipboardList className="feature-icon" />
            <h3><strong>Leave Apply & Approvals</strong></h3>
            <p><strong>Apply for leaves and manage approvals quickly and efficiently.</strong></p>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default WelcomePage;
