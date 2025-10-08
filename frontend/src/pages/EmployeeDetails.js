// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Papa from "papaparse";
// import axios from "axios";
// import "./EmployeeDetails.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const EmployeeDetails = () => {
//   const { id } = useParams(); // employee ID
//   const [tasks, setTasks] = useState([]);
//   const [employeeName, setEmployeeName] = useState("Loading...");
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   const fetchEmployeeName = async () => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/users/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEmployeeName(response.data.name || "Unknown");
//     } catch (error) {
//       console.error("Failed to fetch employee name", error);
//       setEmployeeName("Unknown");
//     }
//   };

//   const fetchTodayTasks = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/api/tasks/today/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const today = new Date().toISOString().split("T")[0];
//       const formattedTasks = (res.data || []).map((task) => ({
//         name: task.task,
//         time: task.duration,
//         date: today,
//       }));
//       setTasks(formattedTasks);
//     } catch (error) {
//       console.error("Error fetching today's tasks:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEmployeeName();
//     fetchTodayTasks();
//   }, [id]);

//   const exportCSV = () => {
//     const rows = tasks.map((task) => ({
//       Date: new Date(task.date).toDateString(),
//       Task: task.name,
//       Time: task.time,
//     }));

//     const csv = Papa.unparse(rows);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${employeeName}_tasks.csv`;
//     link.click();
//   };

//   const handleRefresh = () => {
//     fetchTodayTasks();
//   };

//   return (
//     <div className="employee-details-page">
//       <h2>📝 {employeeName}'s Task Details (Today)</h2>
//       <div className="details-actions">
//         <button onClick={() => navigate("/manager")}>🔙 Back</button>
//         <div className="right-buttons">
//           <button onClick={exportCSV}>Export CSV</button>
//           <button onClick={handleRefresh}>🔄 Refresh</button>
//         </div>
//       </div>

//       {tasks.length === 0 ? (
//         <p>No tasks found for {employeeName} today</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Task</th>
//               <th>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task, index) => (
//               <tr key={index}>
//                 <td>{new Date(task.date).toDateString()}</td>
//                 <td>{task.name}</td>
//                 <td>{task.time}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default EmployeeDetails;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [employeeName, setEmployeeName] = useState("Loading...");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEmployeeName = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeName(response.data.name || "Unknown");
    } catch (error) {
      console.error("Failed to fetch employee name", error);
      setEmployeeName("Unknown");
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks/today/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const today = new Date().toISOString().split("T")[0];
      const formattedTasks = (res.data || []).map((task) => ({
        name: task.task,
        time: task.duration,
        date: today,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeName();
    fetchTodayTasks();
  }, [id]);

  const exportCSV = () => {
    const rows = tasks.map((task) => ({
      Date: new Date(task.date).toDateString(),
      Task: task.name,
      Time: task.time,
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${employeeName}_tasks.csv`;
    link.click();
  };

  const handleRefresh = () => fetchTodayTasks();

  // Inline CSS
  const containerStyle = {
    width: "100%",
    minHeight: "100vh",
    padding: windowWidth < 600 ? "20px 15px" : "40px 60px",
    background: "#fff",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  };

  const headingStyle = {
    marginBottom: windowWidth < 600 ? "20px" : "30px",
    fontWeight: 700,
    fontSize: windowWidth < 600 ? "1.6rem" : "2rem",
    color: "#222",
    textAlign: "center",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: windowWidth < 600 ? "20px" : "30px",
    flexWrap: "wrap",
  };

  const buttonStyle = {
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    padding: windowWidth < 600 ? "10px 18px" : "12px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: windowWidth < 600 ? "1rem" : "1.1rem",
    fontWeight: 600,
    transition: "background-color 0.3s ease",
    margin: "6px 0",
  };

  const rightButtonsStyle = {
    display: "flex",
    gap: windowWidth < 600 ? "10px" : "15px",
    flexWrap: "wrap",
    marginTop: windowWidth < 600 ? "10px" : "0px",
  };

  const tableWrapperStyle = {
    overflowX: "auto", // Horizontal scroll on small screens
    width: "100%",
  };

  const tableStyle = {
    width: "100%",
    minWidth: "600px", // ensures horizontal scroll when screen is smaller
    borderCollapse: "collapse",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const theadStyle = {
    backgroundColor: "#4a90e2",
    color: "#fff",
  };

  const thTdStyle = {
    padding: windowWidth < 600 ? "10px 12px" : "16px 24px",
    textAlign: "left",
    fontSize: windowWidth < 600 ? "0.95rem" : "1.2rem",
    borderBottom: "1px solid #eaeaea",
    wordBreak: "break-word",
  };

  const taskNameStyle = {
    fontWeight: 600,
    fontSize: windowWidth < 600 ? "1rem" : "1.4rem",
    color: "#2c3e50",
  };

  const noTaskStyle = {
    fontSize: windowWidth < 600 ? "1rem" : "1.2rem",
    marginTop: "25px",
    color: "#666",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📝 {employeeName}'s Task Details (Today)</h2>

      <div style={actionsStyle}>
        <button
          style={{ ...buttonStyle, order: -1 }}
          onClick={() => navigate("/manager")}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#357ABD")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
        >
          🔙 Back
        </button>

        <div style={rightButtonsStyle}>
          <button
            style={buttonStyle}
            onClick={exportCSV}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#357ABD")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
          >
            Export CSV
          </button>
          <button
            style={buttonStyle}
            onClick={handleRefresh}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#357ABD")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p style={noTaskStyle}>No tasks found for {employeeName} today</p>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thTdStyle}>Date</th>
                <th style={thTdStyle}>Task</th>
                <th style={thTdStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f5faff",
                  }}
                >
                  <td style={thTdStyle}>{new Date(task.date).toDateString()}</td>
                  <td style={{ ...thTdStyle, ...taskNameStyle }}>{task.name}</td>
                  <td style={thTdStyle}>{task.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
