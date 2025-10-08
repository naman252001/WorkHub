// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = ({ isLoggedIn, onLogout, role }) => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown if clicked outside or pressed ESC
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     const handleEsc = (event) => {
//       if (event.key === "Escape") {
//         setDropdownOpen(false);
//       }
//     };

//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("keydown", handleEsc);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEsc);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [dropdownOpen]);

//   const handleLogout = () => {
//     onLogout?.();
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   const handleProfile = () => {
//     setDropdownOpen(false);
//     navigate("/profile");
//   };

//   const handleAttendance = () => {
//     setDropdownOpen(false);
//     navigate("/attendance");
//   };

//   const handlePastWork = () => {
//     setDropdownOpen(false);
//     navigate("/past-work");
//   };

//   return (
//     <nav className="navbar">
//       {/* Left - Logo */}
//       <div className="navbar-section navbar-left">
//         <img
//           src="/logo/image3.png"
//           alt="Logo"
//           className="navbar-logo"
//           onClick={() => navigate(role === 'Manager' ? '/manager' : '/employee')}
//           style={{ cursor: "pointer" }}
//         />
//       </div>

//       {/* Center - App Name + Slogan */}
//       <div className="navbar-section navbar-center">
//         <div className="navbar-title-group">
//           <span className="navbar-title">Welcome to WorkHub</span>
//           <span className="navbar-slogan">Simplify Work. Empower Teams</span>
//         </div>
//       </div>

//       {/* Right - Dropdown */}
//       <div className="navbar-section navbar-right" ref={dropdownRef}>
//         {isLoggedIn && (
//           <div className="dropdown">
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="dropdown-toggle"
//             >
//               ☰
//             </button>
//             {dropdownOpen && (
//               <div className="dropdown-menu">
//                 <button onClick={handleProfile}>👤 Profile</button>
//                 <button onClick={handlePastWork}>📝 Past Work</button>
//                 <button onClick={handleAttendance}>📋 Attendance</button>
//                 <button onClick={handleLogout}>🚪 Logout</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ isLoggedIn, onLogout, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        backgroundColor: "#2c3e50",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        padding: "12px 20px",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left - Logo */}
        <a
          className="navbar-brand d-flex align-items-center"
          onClick={() =>
            navigate(role === "Manager" ? "/manager" : "/employee")
          }
          style={{ cursor: "pointer" }}
        >
          <img
            src="/logo/image3.png"
            alt="Logo"
            style={{
              height: "60px",
              width: "auto",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </a>

        {/* Center - Title + Slogan */}
        <div
          className="text-center flex-grow-1"
          style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        >
          <h1
            className="mb-0"
            style={{ fontSize: "1.8rem", fontWeight: "700", color: "#fff" }}
          >
            Welcome to WorkHub
          </h1>
          {/* slogan hidden on xs, visible from md up */}
          <small
            className="d-none d-md-block"
            style={{ fontSize: "0.9rem", fontWeight: "400", color: "#dcdcdc" }}
          >
            Simplify Work. Empower Teams
          </small>
        </div>

        {/* Right - Dropdown */}
        {isLoggedIn && (
          <div className="dropdown ms-auto">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                backgroundColor: "#00e5ff",
                border: "none",
                padding: "10px 12px",
                fontSize: "18px",
                borderRadius: "6px",
                color: "#000",
              }}
            >
              ☰
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
              style={{
                minWidth: "200px",
                borderRadius: "6px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.25)",
              }}
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  👤 Profile
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/past-work")}
                >
                  📝 Past Work
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/attendance")}
                >
                  📋 Attendance
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
