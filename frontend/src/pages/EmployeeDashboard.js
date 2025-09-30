import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskError, setTaskError] = useState("");
  const [timeError, setTimeError] = useState("");


  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("tasksData"));
    if (stored?.date === today) setTasks(stored.tasks || []);
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
  } else {
    setTaskError("");
  }

  if (!taskTime.trim()) {
    setTimeError("⚠️ Time taken is mandatory");
    hasError = true;
  } else {
    setTimeError("");
  }

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
        "http://localhost:5000/api/work/save",
        {
          userId: user._id || user.id,
          date,
          tasks: tasks.map((t) => ({
            taskName: t.task,
            taskTime: t.duration,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ All tasks submitted to backend!");
      setTasks([]);
      localStorage.setItem("tasksData", JSON.stringify({ date: new Date().toDateString(), tasks: [] }));
      window.dispatchEvent(new Event("refreshPastWork"));
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to submit tasks");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-headers">Log Your Tasks for the Day</header>

      <section className="task-section">
        <textarea
          placeholder="Enter your Task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="task-input-field"
        />
        {taskError && <p className="error-text">{taskError}</p>}

        <input
          type="text"
          placeholder="Enter time taken (e.g., 15m)"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          className="task-time-field"
        />
        {timeError && <p className="error-text">{timeError}</p>}


        <button onClick={handleAddTask} className="add-btn">
          Add ➕
        </button>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <span className="task-text">{task.task}</span>
              <span className="task-duration">{task.duration}</span>
              <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                ❌
              </button>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <div className="submit-container">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit All Tasks
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeeDashboard;
