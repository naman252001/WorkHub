import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout, role }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside or pressed ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    onLogout?.();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  const handleAttendance = () => {
    setDropdownOpen(false);
    navigate("/attendance");
  };

  const handlePastWork = () => {
    setDropdownOpen(false);
    navigate("/past-work");
  };

  return (
    <nav className="navbar">
      {/* Left - Logo */}
      <div className="navbar-section navbar-left">
        <img
          src="/logo/image.png"
          alt="Logo"
          className="navbar-logo"
          onClick={() => navigate(role === 'Manager' ? '/manager' : '/employee')}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Center - App Name + Slogan */}
      <div className="navbar-section navbar-center">
        <div className="navbar-title-group">
          <span className="navbar-title">Welcome to WorkHub</span>
          <span className="navbar-slogan">Simplify Work. Empower Teams</span>
        </div>
      </div>

      {/* Right - Dropdown */}
      <div className="navbar-section navbar-right" ref={dropdownRef}>
        {isLoggedIn && (
          <div className="dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="dropdown-toggle"
            >
              ☰
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfile}>👤 Profile</button>
                <button onClick={handlePastWork}>📝 Past Work</button>
                <button onClick={handleAttendance}>📋 Attendance</button>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
