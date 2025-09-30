// Updated frontend: pages/ManagerAttendanceDashboard.js (manager side)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// ✅ IMPORT SOCKET.IO CLIENT
import { io } from "socket.io-client";
import "./ManagerAttendanceDashboard.css";

// Use the correct backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/users/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ IMPROVEMENT: Fetch attendance for today for all employees
        const employeesWithStatus = await Promise.all(
          res.data.map(async (emp) => {
            try {
              const attendanceRes = await axios.get(`${API_BASE_URL}/api/attendance/today?userId=${emp._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              // The backend now returns a simple status object ('' for blank/pending)
              return {
                ...emp,
                status: attendanceRes.data.status,
              };
            } catch (attendanceErr) {
              console.error(`Error fetching attendance for ${emp._id}:`, attendanceErr);
              return { ...emp, status: '' };
            }
          })
        );
        
        setEmployees(employeesWithStatus);
        setFilteredEmployees(employeesWithStatus);
      } catch (error) {
        console.error("Error fetching employees:", error.response ? error.response.data : error.message);
        setError("Failed to fetch employees: " + (error.response?.data?.message || error.message));
      }
    };
    fetchEmployees();
  }, []);

  // ✅ NEW useEffect for Socket.IO connection
  useEffect(() => {
    const socket = io(API_BASE_URL); // Connect to your backend server

    // Listen for the 'attendance_updated' event from the server
    socket.on('attendance_updated', ({ userId, status }) => {
      console.log(`Received attendance update for user ${userId}: ${status}`);
      // Update the state of the specific employee
      setEmployees(prevEmployees => 
        prevEmployees.map(emp => 
          emp._id === userId ? { ...emp, status } : emp
        )
      );
      // Also update filtered if needed
      setFilteredEmployees(prevFiltered => 
        prevFiltered.map(emp => 
          emp._id === userId ? { ...emp, status } : emp
        )
      );
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
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
        const url = `${API_BASE_URL}/api/leave/employee/${selectedEmployeeId}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ FIX: Remove the filter to show ALL leaves, not just past ones
        setEmployeeLeaves(res.data);
      } catch (error) {
        console.error("Error fetching employee leaves:", error);
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

    const monthKey = leaveDate.toLocaleString("default", { year: "numeric", month: "long" });
    const dateKey = leaveDate.toISOString().split("T")[0];

    if (!acc[monthKey]) acc[monthKey] = {};
    if (!acc[monthKey][dateKey]) acc[monthKey][dateKey] = [];
    acc[monthKey][dateKey].push(leave);

    return acc;
  }, {});

  return (
    <div className="manager-attendance-container">
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
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const statusToShow = emp.status === 'present' ? 'present' : 
                                   emp.status === 'absent' ? 'absent' : '';
              const statusClass = emp.status === 'present' ? 'present' : 
                                  emp.status === 'absent' ? 'absent' : '';
              return (
                <li
                  key={emp._id}
                  className={`employee-list-item ${emp._id === selectedEmployeeId ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedEmployeeId(emp._id);
                    setSelectedEmployeeName(emp.name);
                  }}
                >
                  {emp.name} - <span className={statusClass}>{statusToShow}</span>
                </li>
              );
            })
          ) : (
            <li className="no-results">No employees found.</li>
          )}
          {error && <li className="error">{error}</li>}
        </ul>
      </aside>

      <main className="manager-leave-panel">
        <div className="manager-leave-header">
          <h2>
            Leave History {selectedEmployeeName ? `- ${selectedEmployeeName}` : ""}
          </h2>
          <button className="leave-applications-button" onClick={() => navigate('/manager-leave-applications')}>
            Leave Applications
          </button>
        </div>

        {loadingLeaves ? (
          <p className="loading-text">Loading leaves...</p>
        ) : employeeLeaves.length === 0 ? (
          <p className="no-leaves-text">No leave records found.</p>
        ) : (
          Object.entries(groupedLeaves).map(([month, dates]) => (
            <section key={month} className="month-group">
              <h3 className="month-title">{month}</h3>
              {Object.entries(dates).map(([date, leavesForDate]) => (
                <div key={date} className="date-group">
                  <h4 className="date-title">{new Date(date).toDateString()}</h4>
                  <ul className="leaves-list">
                    {leavesForDate.map((leave, idx) => (
                      <li key={idx} className="leave-item">
                        <span className="leave-dates">{new Date(leave.from).toLocaleDateString()} to {new Date(leave.to).toLocaleDateString()}</span>
                        <span className="leave-reason">Reason: {leave.reason}</span>
                        <span className="leave-status">Status: {leave.status}</span>
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