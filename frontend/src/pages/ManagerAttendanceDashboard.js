// // Updated frontend: pages/ManagerAttendanceDashboard.js (manager side)
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // ✅ IMPORT SOCKET.IO CLIENT
// import { io } from "socket.io-client";
// import "./ManagerAttendanceDashboard.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const ManagerAttendanceDashboard = () => {
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
//   const [employeeLeaves, setEmployeeLeaves] = useState([]);
//   const [loadingLeaves, setLoadingLeaves] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           return;
//         }

//         const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // ✅ IMPROVEMENT: Fetch attendance for today for all employees
//         const employeesWithStatus = await Promise.all(
//           res.data.map(async (emp) => {
//             try {
//               const attendanceRes = await axios.get(`${API_BASE_URL}/api/attendance/today?userId=${emp._id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               // The backend now returns a simple status object ('' for blank/pending)
//               return {
//                 ...emp,
//                 status: attendanceRes.data.status,
//               };
//             } catch (attendanceErr) {
//               console.error(`Error fetching attendance for ${emp._id}:`, attendanceErr);
//               return { ...emp, status: '' };
//             }
//           })
//         );
        
//         setEmployees(employeesWithStatus);
//         setFilteredEmployees(employeesWithStatus);
//       } catch (error) {
//         console.error("Error fetching employees:", error.response ? error.response.data : error.message);
//         setError("Failed to fetch employees: " + (error.response?.data?.message || error.message));
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // ✅ NEW useEffect for Socket.IO connection
//   useEffect(() => {
//     const socket = io(API_BASE_URL); // Connect to your backend server

//     // Listen for the 'attendance_updated' event from the server
//     socket.on('attendance_updated', ({ userId, status }) => {
//       console.log(`Received attendance update for user ${userId}: ${status}`);
//       // Update the state of the specific employee
//       setEmployees(prevEmployees => 
//         prevEmployees.map(emp => 
//           emp._id === userId ? { ...emp, status } : emp
//         )
//       );
//       // Also update filtered if needed
//       setFilteredEmployees(prevFiltered => 
//         prevFiltered.map(emp => 
//           emp._id === userId ? { ...emp, status } : emp
//         )
//       );
//     });

//     // Clean up the socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const filtered = employees.filter((emp) =>
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEmployees(filtered);
//   }, [searchTerm, employees]);

//   useEffect(() => {
//     if (!selectedEmployeeId) {
//       setEmployeeLeaves([]);
//       return;
//     }

//     const fetchLeaves = async () => {
//       setLoadingLeaves(true);
//       try {
//         const token = localStorage.getItem("token");
//         const url = `${API_BASE_URL}/api/leave/employee/${selectedEmployeeId}`;
//         const res = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // ✅ FIX: Remove the filter to show ALL leaves, not just past ones
//         setEmployeeLeaves(res.data);
//       } catch (error) {
//         console.error("Error fetching employee leaves:", error);
//         setEmployeeLeaves([]);
//       } finally {
//         setLoadingLeaves(false);
//       }
//     };
//     fetchLeaves();
//   }, [selectedEmployeeId]);

//   const groupedLeaves = employeeLeaves.reduce((acc, leave) => {
//     const leaveDate = new Date(leave.from);
//     if (isNaN(leaveDate)) return acc;

//     const monthKey = leaveDate.toLocaleString("default", { year: "numeric", month: "long" });
//     const dateKey = leaveDate.toISOString().split("T")[0];

//     if (!acc[monthKey]) acc[monthKey] = {};
//     if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
//     acc[monthKey][dateKey].push(leave);

//     return acc;
//   }, {});

//   return (
//     <div className="manager-attendance-container">
//       <aside className="manager-sidebar">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <h3>Employees</h3>

//         <input
//           type="text"
//           className="employee-search"
//           placeholder="Search employees..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <ul className="employee-list">
//           {filteredEmployees.length > 0 ? (
//             filteredEmployees.map((emp) => {
//               const statusToShow = emp.status === 'present' ? 'present' : 
//                                    emp.status === 'absent' ? 'absent' : '';
//               const statusClass = emp.status === 'present' ? 'present' : 
//                                   emp.status === 'absent' ? 'absent' : '';
//               return (
//                 <li
//                   key={emp._id}
//                   className={`employee-list-item ${emp._id === selectedEmployeeId ? "selected" : ""}`}
//                   onClick={() => {
//                     setSelectedEmployeeId(emp._id);
//                     setSelectedEmployeeName(emp.name);
//                   }}
//                 >
//                   {emp.name} - <span className={statusClass}>{statusToShow}</span>
//                 </li>
//               );
//             })
//           ) : (
//             <li className="no-results">No employees found.</li>
//           )}
//           {error && <li className="error">{error}</li>}
//         </ul>
//       </aside>

//       <main className="manager-leave-panel">
//         <div className="manager-leave-header">
//           <h2>
//             Leave History {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
//           </h2>
//           <button className="leave-applications-button" onClick={() => navigate('/manager-leave-applications')}>
//             Leave Applications
//           </button>
//         </div>

//         {loadingLeaves ? (
//           <p className="loading-text">Loading leaves...</p>
//         ) : employeeLeaves.length === 0 ? (
//           <p className="no-leaves-text">No leave records found.</p>
//         ) : (
//           Object.entries(groupedLeaves).map(([month, dates]) => (
//             <section key={month} className="month-group">
//               <h3 className="month-title">{month}</h3>
//               {Object.entries(dates).map(([date, leavesForDate]) => (
//                 <div key={date} className="date-group">
//                   <h4 className="date-title">{new Date(date).toDateString()}</h4>
//                   <ul className="leaves-list">
//                     {leavesForDate.map((leave, idx) => (
//                       <li key={idx} className="leave-item">
//                         <span className="leave-dates">{new Date(leave.from).toLocaleDateString()} to {new Date(leave.to).toLocaleDateString()}</span>
//                         <span className="leave-reason">Reason: {leave.reason}</span>
//                         <span className="leave-status">Status: {leave.status}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </section>
//           ))
//         )}
//       </main>
//     </div>
//   );
// };


// export default ManagerAttendanceDashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManagerAttendanceDashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("No authentication token found");
        const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employeesWithStatus = await Promise.all(
          res.data.map(async (emp) => {
            try {
              const attendanceRes = await axios.get(
                `${API_BASE_URL}/api/attendance/today?userId=${emp._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...emp, status: attendanceRes.data.status };
            } catch {
              return { ...emp, status: "" };
            }
          })
        );

        setEmployees(employeesWithStatus);
        setFilteredEmployees(employeesWithStatus);
      } catch {
        setError("Failed to fetch employees.");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE_URL);
    socket.on("attendance_updated", ({ userId, status }) => {
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === userId ? { ...emp, status } : emp))
      );
      setFilteredEmployees((prev) =>
        prev.map((emp) => (emp._id === userId ? { ...emp, status } : emp))
      );
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setEmployeeLeaves([]);
      return;
    }
    const fetchLeaves = async () => {
      setLoadingLeaves(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/leave/employee/${selectedEmployeeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployeeLeaves(res.data);
      } catch {
        setEmployeeLeaves([]);
      } finally {
        setLoadingLeaves(false);
      }
    };
    fetchLeaves();
  }, [selectedEmployeeId]);

  const groupedLeaves = employeeLeaves.reduce((acc, leave) => {
    const leaveDate = new Date(leave.from);
    if (isNaN(leaveDate)) return acc;
    const monthKey = leaveDate.toLocaleString("default", {
      year: "numeric",
      month: "long",
    });
    const dateKey = leaveDate.toISOString().split("T")[0];
    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
    acc[monthKey][dateKey].push(leave);
    return acc;
  }, {});

  // Inline styles
  const containerStyle = {
    display: "flex",
    flexDirection: windowWidth < 800 ? "column" : "row",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f7f7f7",
  };

  const sidebarStyle = {
    width: windowWidth < 800 ? "100%" : "300px",
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "20px 15px",
    overflowX: windowWidth < 500 ? "auto" : "hidden",
    overflowY: "auto",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  };

  const backBtnStyle = {
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "15px",
    minWidth: "90px",
  };

  const searchStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
  };

  const employeeItemStyle = (selected) => ({
    padding: windowWidth < 500 ? "14px" : "10px",
    marginBottom: "10px",
    backgroundColor: selected ? "#040404" : "#ffad39",
    borderRadius: "5px",
    cursor: "pointer",
    color: selected ? "white" : "black",
    fontSize: windowWidth < 500 ? "1.1rem" : "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: windowWidth < 500 ? "180px" : "auto",
  });

  const presentStyle = { color: "green", fontWeight: "bold" };
  const absentStyle = { color: "red", fontWeight: "bold" };

  const mainStyle = {
    flex: 1,
    padding: windowWidth < 600 ? "10px" : "20px",
    overflowY: "auto",
  };

  const leaveHeaderStyle = {
    display: "flex",
    flexDirection: windowWidth < 600 ? "column" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  };

  const leaveHeaderTitleStyle = {
    margin: 0,
    color: "#333",
    fontWeight: "bold",
    borderBottom: "2px solid #333",
    paddingBottom: "5px",
    fontSize: windowWidth < 600 ? "1.2rem" : "1.5rem",
  };

  const leaveBtnStyle = {
    padding: windowWidth < 600 ? "8px 16px" : "10px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: windowWidth < 600 ? "0.9rem" : "1rem",
    minWidth: "120px",
  };

  const monthTitleStyle = { marginBottom: "10px", color: "#444", fontWeight: "bold" };
  const dateTitleStyle = { marginBottom: "5px", color: "#555", fontWeight: "600" };
  const leaveItemStyle = {
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
  };
  const leaveTextStyle = { display: "block", marginBottom: "5px" };
  const infoTextStyle = {
    fontSize: "1.2rem",
    color: "#7f8c8d",
    marginTop: "40px",
    fontStyle: "italic",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <button
          style={backBtnStyle}
          onClick={() => navigate(-1)}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1f6391")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2980b9")}
        >
          ← Back
        </button>

        <h3 style={{ marginBottom: "20px", fontWeight: 700, fontSize: "1.5rem" }}>
          Employees
        </h3>

        <input
          type="text"
          style={searchStyle}
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul style={{ display: "flex", flexDirection: windowWidth < 500 ? "row" : "column", gap: "8px", listStyle: "none", padding: 0, margin: 0, overflowX: windowWidth < 500 ? "auto" : "hidden" }}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const statusToShow =
                emp.status === "present" ? "present" : emp.status === "absent" ? "absent" : "";
              const statusClass = emp.status === "present" ? presentStyle : emp.status === "absent" ? absentStyle : {};
              return (
                <li
                  key={emp._id}
                  style={employeeItemStyle(emp._id === selectedEmployeeId)}
                  onClick={() => {
                    setSelectedEmployeeId(emp._id);
                    setSelectedEmployeeName(emp.name);
                  }}
                >
                  {emp.name} <span style={statusClass}>{statusToShow}</span>
                </li>
              );
            })
          ) : (
            <li style={{ padding: "10px", color: "#666" }}>No employees found.</li>
          )}
          {error && <li style={{ color: "red" }}>{error}</li>}
        </ul>
      </aside>

      <main style={mainStyle}>
        <div style={leaveHeaderStyle}>
          <h2 style={leaveHeaderTitleStyle}>
            Leave History {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
          </h2>
          <button
            style={leaveBtnStyle}
            onClick={() => navigate("/manager-leave-applications")}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
          >
            Leave Applications
          </button>
        </div>

        {loadingLeaves ? (
          <p style={infoTextStyle}>Loading leaves...</p>
        ) : employeeLeaves.length === 0 ? (
          <p style={infoTextStyle}>No leave records found.</p>
        ) : (
          Object.entries(groupedLeaves).map(([month, dates]) => (
            <section key={month} style={{ marginBottom: "20px" }}>
              <h3 style={monthTitleStyle}>{month}</h3>
              {Object.entries(dates).map(([date, leavesForDate]) => (
                <div key={date} style={{ marginBottom: "15px" }}>
                  <h4 style={dateTitleStyle}>{new Date(date).toDateString()}</h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {leavesForDate.map((leave, idx) => (
                      <li key={idx} style={leaveItemStyle}>
                        <span style={leaveTextStyle}>
                          {new Date(leave.from).toLocaleDateString()} to{" "}
                          {new Date(leave.to).toLocaleDateString()}
                        </span>
                        <span style={leaveTextStyle}>Reason: {leave.reason}</span>
                        <span style={leaveTextStyle}>Status: {leave.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default ManagerAttendanceDashboard;
