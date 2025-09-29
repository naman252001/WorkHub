import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import axios from "axios";
import "./EmployeeDetails.css";

const EmployeeDetails = () => {
  const { id } = useParams(); // employee ID
  const [tasks, setTasks] = useState([]);
  const [employeeName, setEmployeeName] = useState("Loading...");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchEmployeeName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployeeName(response.data.name || "Unknown");
    } catch (error) {
      console.error("Failed to fetch employee name", error);
      setEmployeeName("Unknown");
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/today/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleRefresh = () => {
    fetchTodayTasks();
  };

  return (
    <div className="employee-details-page">
      <h2>📝 {employeeName}'s Task Details (Today)</h2>
      <div className="details-actions">
        <button onClick={() => navigate("/manager")}>🔙 Back</button>
        <div className="right-buttons">
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={handleRefresh}>🔄 Refresh</button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found for {employeeName} today</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{new Date(task.date).toDateString()}</td>
                <td>{task.name}</td>
                <td>{task.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDetails;
