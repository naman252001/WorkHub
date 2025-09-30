// export default ManagerPastWork;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManagerPastWork.css";

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/employees", {
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
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
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
        const url = `http://localhost:5000/api/tasks/past/${selectedEmployeeId}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  return (
    <div className="manager-pastwork-container">
      {/* Sidebar */}
      <aside className="manager-sidebar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h3>Employees</h3>
        <input
          type="text"
          className="employee-search"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="employee-list">
          {filteredEmployees.map((emp) => (
            <li
              key={emp._id}
              className={`employee-list-item ${emp._id === selectedEmployeeId ? "selected" : ""}`}
              onClick={() => {
                setSelectedEmployeeId(emp._id);
                setSelectedEmployeeName(emp.name);
              }}
            >
              {emp.name}
            </li>
          ))}
          {filteredEmployees.length === 0 && <li className="no-results">No employees found.</li>}
        </ul>
      </aside>

      {/* Main content */}
      <main className="manager-task-panel">
        <h2>
          Past Tasks {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
        </h2>

        {/* Date Filter Controls */}
        <div className="date-filter-row" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={() => {
            setAppliedStart(startDate);
            setAppliedEnd(endDate);
          }}>
            Filter
          </button>
          <button onClick={() => {
            setStartDate("");
            setEndDate("");
            setAppliedStart("");
            setAppliedEnd("");
          }}>
            Clear
          </button>
        </div>

        {loadingTasks ? (
          <p className="loading-text">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="no-tasks-text">No past tasks found.</p>
        ) : (
          Object.entries(groupedTasks).map(([month, dates]) => (
            <section key={month} className="month-group">
              <h3 className="month-title">{month}</h3>
              {Object.entries(dates).map(([date, tasksForDate]) => (
                <div key={date} className="date-group">
                  <h4 className="date-title">{new Date(date).toDateString()}</h4>
                  <ul className="tasks-list">
                    {tasksForDate.map((task, idx) => (
                      <li key={idx} className="task-item">
                        <span className="task-name">{task.task}</span>
                        <span className="task-duration">{task.duration}</span>
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
