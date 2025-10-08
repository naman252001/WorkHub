// // export default ManagerPastWork;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./ManagerPastWork.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const ManagerPastWork = () => {
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
//   const [tasks, setTasks] = useState([]);
//   const [loadingTasks, setLoadingTasks] = useState(false);

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const [appliedStart, setAppliedStart] = useState("");
//   const [appliedEnd, setAppliedEnd] = useState("");

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEmployees(res.data);
//         setFilteredEmployees(res.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     const filtered = employees.filter((emp) =>
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEmployees(filtered);
//   }, [searchTerm, employees]);

//   useEffect(() => {
//     if (!selectedEmployeeId) {
//       setTasks([]);
//       return;
//     }

//     const fetchTasks = async () => {
//       setLoadingTasks(true);
//       try {
//         const token = localStorage.getItem("token");
//         const url = `${API_BASE_URL}/api/tasks/past/${selectedEmployeeId}`;

//         const res = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTasks(res.data);
//       } catch (error) {
//         console.error("Error fetching past tasks:", error);
//         setTasks([]);
//       } finally {
//         setLoadingTasks(false);
//       }
//     };

//     fetchTasks();
//   }, [selectedEmployeeId]);

//   const filteredTasks = tasks.filter((task) => {
//     const taskDate = new Date(task.date);
//     if (appliedStart && taskDate < new Date(appliedStart)) return false;
//     if (appliedEnd && taskDate > new Date(appliedEnd)) return false;
//     return true;
//   });

//   const groupedTasks = filteredTasks.reduce((acc, task) => {
//     const taskDate = new Date(task.date);
//     if (isNaN(taskDate)) return acc;

//     const monthKey = taskDate.toLocaleString("default", { year: "numeric", month: "long" });
//     const dateKey = taskDate.toISOString().split("T")[0];

//     if (!acc[monthKey]) acc[monthKey] = {};
//     if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
//     acc[monthKey][dateKey].push(task);

//     return acc;
//   }, {});

//   return (
//     <div className="manager-pastwork-container">
//       {/* Sidebar */}
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
//           {filteredEmployees.map((emp) => (
//             <li
//               key={emp._id}
//               className={`employee-list-item ${emp._id === selectedEmployeeId ? "selected" : ""}`}
//               onClick={() => {
//                 setSelectedEmployeeId(emp._id);
//                 setSelectedEmployeeName(emp.name);
//               }}
//             >
//               {emp.name}
//             </li>
//           ))}
//           {filteredEmployees.length === 0 && <li className="no-results">No employees found.</li>}
//         </ul>
//       </aside>

//       {/* Main content */}
//       <main className="manager-task-panel">
//         <h2>
//           Past Tasks {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
//         </h2>

//         {/* Date Filter Controls */}
//         <div className="date-filter-row" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//           <button onClick={() => {
//             setAppliedStart(startDate);
//             setAppliedEnd(endDate);
//           }}>
//             Filter
//           </button>
//           <button onClick={() => {
//             setStartDate("");
//             setEndDate("");
//             setAppliedStart("");
//             setAppliedEnd("");
//           }}>
//             Clear
//           </button>
//         </div>

//         {loadingTasks ? (
//           <p className="loading-text">Loading tasks...</p>
//         ) : filteredTasks.length === 0 ? (
//           <p className="no-tasks-text">No past tasks found.</p>
//         ) : (
//           Object.entries(groupedTasks).map(([month, dates]) => (
//             <section key={month} className="month-group">
//               <h3 className="month-title">{month}</h3>
//               {Object.entries(dates).map(([date, tasksForDate]) => (
//                 <div key={date} className="date-group">
//                   <h4 className="date-title">{new Date(date).toDateString()}</h4>
//                   <ul className="tasks-list">
//                     {tasksForDate.map((task, idx) => (
//                       <li key={idx} className="task-item">
//                         <span className="task-name">{task.task}</span>
//                         <span className="task-duration">{task.duration}</span>
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

// export default ManagerPastWork;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManagerPastWork = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStart, setAppliedStart] = useState("");
  const [appliedEnd, setAppliedEnd] = useState("");
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
        const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setTasks([]);
      return;
    }
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/tasks/past/${selectedEmployeeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching past tasks:", error);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [selectedEmployeeId]);

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    if (appliedStart && taskDate < new Date(appliedStart)) return false;
    if (appliedEnd && taskDate > new Date(appliedEnd)) return false;
    return true;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const taskDate = new Date(task.date);
    if (isNaN(taskDate)) return acc;

    const monthKey = taskDate.toLocaleString("default", { year: "numeric", month: "long" });
    const dateKey = taskDate.toISOString().split("T")[0];

    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
    acc[monthKey][dateKey].push(task);

    return acc;
  }, {});

  // Inline styles
  const containerStyle = {
    display: "flex",
    flexDirection: windowWidth < 768 ? "column" : "row",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f5f7fa",
    overflow: "hidden",
  };

  const sidebarStyle = {
    width: windowWidth < 768 ? "100%" : "260px",
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px",
    overflowY: "auto",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  };

  const backButtonStyle = {
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "15px",
  };

  const employeeSearchStyle = {
    width: "100%",
    padding: "6px 10px",
    fontSize: "1rem",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #bdc3c7",
    outline: "none",
  };

  const employeeItemStyle = (selected) => ({
    padding: "12px 15px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.15rem",
    transition: "background-color 0.3s ease, color 0.3s ease",
    userSelect: "none",
    backgroundColor: selected ? "#2980b9" : "transparent",
    fontWeight: selected ? 700 : 400,
    color: selected ? "#ecf0f1" : "white",
    boxShadow: selected ? "0 0 8px #2980b9" : "none",
  });

  const mainStyle = {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "#ecf0f1",
  };

  const dateFilterStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
    marginBottom: "20px",
    justifyContent: windowWidth < 480 ? "flex-start" : "flex-end",
  };

  const dateInputStyle = {
    padding: "5px 8px",
    borderRadius: "5px",
    border: "1px solid #bdc3c7",
    fontSize: "1rem",
    outline: "none",
    minWidth: "110px",
  };

  const monthGroupStyle = {
    marginBottom: "30px",
    borderLeft: "4px solid #2980b9",
    paddingLeft: "15px",
  };

  const dateGroupStyle = {
    marginBottom: "20px",
    borderLeft: "3px solid #3498db",
    paddingLeft: "15px",
  };

  const taskItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    background: "#ffffff",
    marginBottom: "8px",
    padding: "10px 15px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(41,128,185,0.15)",
    transition: "background-color 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>← Back</button>
        <h3>Employees</h3>
        <input
          type="text"
          placeholder="Search employees..."
          style={employeeSearchStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredEmployees.map((emp) => (
            <li
              key={emp._id}
              style={employeeItemStyle(emp._id === selectedEmployeeId)}
              onClick={() => {
                setSelectedEmployeeId(emp._id);
                setSelectedEmployeeName(emp.name);
              }}
            >
              {emp.name}
            </li>
          ))}
          {filteredEmployees.length === 0 && (
            <li style={{ padding: "10px", color: "#ccc" }}>No employees found.</li>
          )}
        </ul>
      </aside>

      <main style={mainStyle}>
        <h2>
          Past Tasks {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
        </h2>

        <div style={dateFilterStyle}>
          <input
            type="date"
            style={dateInputStyle}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            style={dateInputStyle}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={() => { setAppliedStart(startDate); setAppliedEnd(endDate); }}>Filter</button>
          <button onClick={() => { setStartDate(""); setEndDate(""); setAppliedStart(""); setAppliedEnd(""); }}>Clear</button>
        </div>

        {loadingTasks ? (
          <p style={{ fontStyle: "italic", textAlign: "center", flexGrow: 1 }}>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p style={{ fontStyle: "italic", textAlign: "center", flexGrow: 1 }}>No past tasks found.</p>
        ) : (
          Object.entries(groupedTasks).map(([month, dates]) => (
            <section key={month} style={monthGroupStyle}>
              <h3 style={{ fontSize: "1.8rem", color: "#2980b9", marginBottom: "15px", fontWeight: 700, textTransform: "uppercase" }}>{month}</h3>
              {Object.entries(dates).map(([date, tasksForDate]) => (
                <div key={date} style={dateGroupStyle}>
                  <h4 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#34495e", marginBottom: "8px" }}>{new Date(date).toDateString()}</h4>
                  <ul style={{ listStyle: "none", paddingLeft: "10px", margin: 0 }}>
                    {tasksForDate.map((task, idx) => (
                      <li key={idx} style={taskItemStyle}>
                        <span style={{ fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>{task.task}</span>
                        <span style={{ fontWeight: 500, color: "#7f8c8d", fontSize: "1rem" }}>{task.duration}</span>
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

export default ManagerPastWork;
