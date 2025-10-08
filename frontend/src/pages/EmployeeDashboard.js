// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./EmployeeDashboard.css";


// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


// const EmployeeDashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [taskName, setTaskName] = useState("");
//   const [taskTime, setTaskTime] = useState("");
//   const [taskError, setTaskError] = useState("");
//   const [timeError, setTimeError] = useState("");


//   useEffect(() => {
//     const today = new Date().toDateString();
//     const stored = JSON.parse(localStorage.getItem("tasksData"));
//     if (stored?.date === today) setTasks(stored.tasks || []);
//   }, []);

//   useEffect(() => {
//     const water = setInterval(() => alert("💧 Time to drink water!"), 60 * 60 * 1000);
//     const rest = setInterval(() => alert("🛑 Time to take a short rest!"), 2 * 60 * 60 * 1000);
//     return () => {
//       clearInterval(water);
//       clearInterval(rest);
//     };
//   }, []);

//   const handleAddTask = () => {
//   let hasError = false;

//   if (!taskName.trim()) {
//     setTaskError("⚠️ Task name is mandatory");
//     hasError = true;
//   } else {
//     setTaskError("");
//   }

//   if (!taskTime.trim()) {
//     setTimeError("⚠️ Time taken is mandatory");
//     hasError = true;
//   } else {
//     setTimeError("");
//   }

//   if (hasError) return;

//   const newTask = { id: Date.now(), task: taskName, duration: taskTime };
//   const updatedTasks = [...tasks, newTask];
//   setTasks(updatedTasks);
//   setTaskName("");
//   setTaskTime("");

//   const today = new Date().toDateString();
//   localStorage.setItem("tasksData", JSON.stringify({ date: today, tasks: updatedTasks }));
// };



//   const handleDeleteTask = (id) => {
//     const updatedTasks = tasks.filter((task) => task.id !== id);
//     setTasks(updatedTasks);
//     const today = new Date().toDateString();
//     localStorage.setItem("tasksData", JSON.stringify({ date: today, tasks: updatedTasks }));
//   };

//   const handleSubmit = async () => {
//     if (tasks.length === 0) return;

//     const token = localStorage.getItem("token");
//     const user = JSON.parse(localStorage.getItem("user"));
//     const date = new Date().toISOString().split("T")[0];

//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/work/save`,
//         {
//           userId: user._id || user.id,
//           date,
//           tasks: tasks.map((t) => ({
//             taskName: t.task,
//             taskTime: t.duration,
//           })),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert("✅ All tasks submitted to backend!");
//       setTasks([]);
//       localStorage.setItem("tasksData", JSON.stringify({ date: new Date().toDateString(), tasks: [] }));
//       window.dispatchEvent(new Event("refreshPastWork"));
//     } catch (err) {
//       alert(err.response?.data?.msg || "❌ Failed to submit tasks");
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-headers">Log Your Tasks for the Day</header>

//       <section className="task-section">
//         <textarea
//           placeholder="Enter your Task"
//           value={taskName}
//           onChange={(e) => setTaskName(e.target.value)}
//           className="task-input-field"
//         />
//         {taskError && <p className="error-text">{taskError}</p>}

//         <input
//           type="text"
//           placeholder="Enter time taken (e.g., 15m)"
//           value={taskTime}
//           onChange={(e) => setTaskTime(e.target.value)}
//           className="task-time-field"
//         />
//         {timeError && <p className="error-text">{timeError}</p>}


//         <button onClick={handleAddTask} className="add-btn">
//           Add ➕
//         </button>

//         <ul className="task-list">
//           {tasks.map((task) => (
//             <li key={task.id} className="task-item">
//               <span className="task-text">{task.task}</span>
//               <span className="task-duration">{task.duration}</span>
//               <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
//                 ❌
//               </button>
//             </li>
//           ))}
//         </ul>

//         {tasks.length > 0 && (
//           <div className="submit-container">
//             <button className="submit-btn" onClick={handleSubmit}>
//               Submit All Tasks
//             </button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default EmployeeDashboard;



import React, { useState, useEffect } from "react";
import axios from "axios";

// Backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskError, setTaskError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("tasksData"));
    if (stored?.date === today) setTasks(stored.tasks || []);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const water = setInterval(() => alert("💧 Time to drink water!"), 60 * 60 * 1000);
    const rest = setInterval(() => alert("🛑 Time to take a short rest!"), 2 * 60 * 60 * 1000);
    return () => {
      clearInterval(water);
      clearInterval(rest);
    };
  }, []);

  const handleAddTask = () => {
    let hasError = false;
    if (!taskName.trim()) {
      setTaskError("⚠️ Task name is mandatory");
      hasError = true;
    } else setTaskError("");

    if (!taskTime.trim()) {
      setTimeError("⚠️ Time taken is mandatory");
      hasError = true;
    } else setTimeError("");

    if (hasError) return;

    const newTask = { id: Date.now(), task: taskName, duration: taskTime };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskName("");
    setTaskTime("");
    const today = new Date().toDateString();
    localStorage.setItem("tasksData", JSON.stringify({ date: today, tasks: updatedTasks }));
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    const today = new Date().toDateString();
    localStorage.setItem("tasksData", JSON.stringify({ date: today, tasks: updatedTasks }));
  };

  const handleSubmit = async () => {
    if (tasks.length === 0) return;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const date = new Date().toISOString().split("T")[0];

    try {
      await axios.post(
        `${API_BASE_URL}/api/work/save`,
        {
          userId: user._id || user.id,
          date,
          tasks: tasks.map((t) => ({ taskName: t.task, taskTime: t.duration })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ All tasks submitted to backend!");
      setTasks([]);
      localStorage.setItem("tasksData", JSON.stringify({ date: new Date().toDateString(), tasks: [] }));
      window.dispatchEvent(new Event("refreshPastWork"));
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to submit tasks");
    }
  };

  // Responsive sizes
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#e9f2fd",
    alignItems: "center",
    padding: "0 10px",
    boxSizing: "border-box",
  };

  const headerStyle = {
    width: "100%",
    color: "#2c3e50",
    textAlign: "center",
    fontSize: windowWidth < 500 ? "1.6rem" : "2rem",
    fontWeight: "bold",
    padding: windowWidth < 500 ? "15px 0" : "25px 0",
  };

  const taskSectionStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
    padding: "20px",
    boxSizing: "border-box",
  };

  const inputStyle = {
    width: "100%",
    fontSize: windowWidth < 500 ? "1rem" : "1.2rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: windowWidth < 500 ? "10px" : "12px",
    marginBottom: "15px",
    resize: "vertical",
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  };

  const timeInputStyle = { ...inputStyle, fontSize: windowWidth < 500 ? "0.95rem" : "1.1rem", padding: windowWidth < 500 ? "12px" : "16px", marginBottom: "20px" };

  const errorTextStyle = {
    color: "red",
    fontSize: "0.85rem",
    marginTop: "-10px",
    marginBottom: "10px",
    width: "100%",
    textAlign: "left",
  };

  const addBtnStyle = {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: windowWidth < 500 ? "10px 18px" : "14px 25px",
    fontSize: windowWidth < 500 ? "1rem" : "1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "30px",
  };

  const taskListStyle = {
    width: "100%",
    listStyle: "none",
    padding: 0,
    marginBottom: "40px",
  };

  const taskItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: windowWidth < 500 ? "10px 12px" : "14px 18px",
    border: "1px solid #ddd",
    marginBottom: "12px",
    borderRadius: "8px",
    background: "#f8f9fa",
    flexWrap: "wrap",
  };

  const deleteBtnStyle = {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: windowWidth < 500 ? "4px 8px" : "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const submitContainerStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  const submitBtnStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: windowWidth < 500 ? "12px 20px" : "16px 30px",
    fontSize: windowWidth < 500 ? "1rem" : "1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>Log Your Tasks for the Day</header>
      <section style={taskSectionStyle}>
        <textarea
          placeholder="Enter your Task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={inputStyle}
        />
        {taskError && <p style={errorTextStyle}>{taskError}</p>}

        <input
          type="text"
          placeholder="Enter time taken (e.g., 15m)"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          style={timeInputStyle}
        />
        {timeError && <p style={errorTextStyle}>{timeError}</p>}

        <button
          style={addBtnStyle}
          onClick={handleAddTask}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          Add ➕
        </button>

        <ul style={taskListStyle}>
          {tasks.map((task) => (
            <li key={task.id} style={taskItemStyle}>
              <span style={{ fontWeight: "bold", flex: "1 1 60%" }}>{task.task}</span>
              <span style={{ fontWeight: "bold", color: "#666", flex: "0 0 20%" }}>{task.duration}</span>
              <button style={deleteBtnStyle} onClick={() => handleDeleteTask(task.id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <div style={submitContainerStyle}>
            <button style={submitBtnStyle} onClick={handleSubmit}>
              Submit All Tasks
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeDashboard;
