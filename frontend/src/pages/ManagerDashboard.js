// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ManagerDashboard.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const ManagerDashboard = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${API_BASE_URL}/api/users/employees`, // ✅ Corrected URL
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEmployees(res.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const filteredEmployees = employees.filter((emp) =>
//     emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="manager-dashboard">
//       <div className="search-box">
//         <input
//           type="text"
//           placeholder="Search employee by name..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="employee-card-container">
//         {filteredEmployees.map((employee) => (
//           <div
//             key={employee._id}
//             className="employee-card"
//             onClick={() => navigate(`/employee-details/${employee._id}`)}
//           >
//             <h3>{employee.name}</h3>
//             <p>{employee.email}</p>
//             <p>{employee.role}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManagerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Inline styles
  const containerStyle = {
    padding: "30px",
    textAlign: "center",
    background: "linear-gradient(135deg, #f0f4ff, #e6f7ff)",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const searchBoxStyle = { marginBottom: "30px" };
  const inputStyle = {
    padding: "10px 15px",
    width: windowWidth < 500 ? "90%" : "320px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #aaa",
    transition: "0.3s",
  };

  const employeeContainerStyle = {
    display: "grid",
    gridTemplateColumns:
      windowWidth >= 1200
        ? "repeat(5, 1fr)"
        : windowWidth >= 992
        ? "repeat(4, 1fr)"
        : windowWidth >= 768
        ? "repeat(3, 1fr)"
        : windowWidth >= 500
        ? "repeat(2, 1fr)"
        : "repeat(1, 1fr)",
    gap: windowWidth < 500 ? "20px" : "40px 50px",
    justifyItems: "center",
    overflowX: windowWidth < 500 ? "auto" : "visible",
    paddingBottom: windowWidth < 500 ? "20px" : "0px",
  };

  const employeeCardStyle = (index) => ({
    color: index % 2 === 0 ? "white" : "#222",
    background:
      index % 2 === 0
        ? "linear-gradient(135deg, #0F52BA, #0B3B91)"
        : "linear-gradient(135deg, #6699CC, #8CA6DB)",
    padding: "35px 30px",
    borderRadius: "15px",
    boxShadow:
      index % 2 === 0
        ? "0 5px 15px rgba(15, 82, 186, 0.6)"
        : "0 5px 15px rgba(102, 153, 204, 0.4)",
    cursor: "pointer",
    width: windowWidth < 500 ? "250px" : "320px",
    height: windowWidth < 500 ? "auto" : "220px",
    flexShrink: 0,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    textShadow: index % 2 === 0 ? "0 1px 3px rgba(0,0,0,0.7)" : "none",
    boxSizing: "border-box",
  });

  const employeeCardHoverStyle = {
    transform: "translateY(-8px) scale(1.05)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const h3Style = {
    fontSize: windowWidth < 500 ? "22px" : "26px",
    marginBottom: "14px",
    fontWeight: 700,
    color: "inherit",
  };

  const pStyle = {
    fontSize: windowWidth < 500 ? "16px" : "18px",
    opacity: 0.95,
    fontWeight: 600,
    color: "inherit",
    margin: "2px 0",
  };

  return (
    <div style={containerStyle}>
      <div style={searchBoxStyle}>
        <input
          type="text"
          placeholder="Search employee by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={employeeContainerStyle}>
        {filteredEmployees.map((employee, index) => (
          <div
            key={employee._id}
            style={employeeCardStyle(index)}
            onClick={() => navigate(`/employee-details/${employee._id}`)}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, employeeCardHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, employeeCardStyle(index))
            }
          >
            <h3 style={h3Style}>{employee.name}</h3>
            <p style={pStyle}>{employee.email}</p>
            <p style={pStyle}>{employee.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;

