import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManagerLeaveApplications.css";

const ManagerLeaveApplications = () => {
  const navigate = useNavigate();

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const leaveRes = await axios.get("https://workhub-6jze.onrender.com/api/leave/manager?status=pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveRequests(leaveRes.data);

        const holidayRes = await axios.get("https://workhub-6jze.onrender.com/api/holidays", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHolidays(holidayRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data: " + (error.response?.data?.message || error.message));
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (leaveId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://workhub-6jze.onrender.com/api/leave/manager/${leaveId}`, { status: 'approved' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(leaveRequests.map(lr => lr._id === leaveId ? res.data.leave : lr));
      setError(""); // Clear error on success
    } catch (error) {
      console.error("Error approving leave:", error);
      setError("Failed to approve leave: " + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://workhub-6jze.onrender.com/api/leave/manager/${leaveId}`, { status: 'rejected' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(leaveRequests.map(lr => lr._id === leaveId ? res.data.leave : lr));
      setError(""); // Clear error on success
    } catch (error) {
      console.error("Error rejecting leave:", error);
      setError("Failed to reject leave: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://workhub-6jze.onrender.com/api/holidays", newHoliday, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays([...holidays, res.data]);
      setNewHoliday({ date: '', name: '' });
      setError("");
    } catch (error) {
      console.error("Error adding holiday:", error);
      setError("Failed to add holiday: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://workhub-6jze.onrender.com/api/holidays/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(holidays.filter(h => h._id !== id));
      setError("");
    } catch (error) {
      console.error("Error deleting holiday:", error);
      setError("Failed to delete holiday: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="manager-leave-container">
      <main className="holiday-panel">
        <h3>Add Holiday</h3>
        <form onSubmit={handleAddHoliday} className="holiday-form">
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            required
          />
          <input
            type="text"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
            placeholder="Holiday Name"
            required
            maxLength={50} // Prevent overly long holiday names
          />
          <button type="submit">Add Holiday</button>
        </form>

        <h3>Holidays</h3>
        <ul className="holiday-list">
          {holidays.length > 0 ? (
            holidays.map((holiday) => (
              <li key={holiday._id} className="holiday-item">
                <span>
                  {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
                </span>
                <button className="delete-button" onClick={() => handleDeleteHoliday(holiday._id)}>
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="no-results">No holidays listed</li>
          )}
          {error && <li className="error">{error}</li>}
        </ul>
      </main>

      <aside className="leave-applications-sidebar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h3>Leave Applications</h3>

        <ul className="leave-list">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <li key={request._id} className="leave-item">
                <div>
                  <span>Employee: {request.user.name.slice(0, 50)}</span>
                  <span>
                    Dates: {new Date(request.from).toLocaleDateString()} to{" "}
                    {new Date(request.to).toLocaleDateString()}
                  </span>
                  <span>Reason: {request.reason.slice(0, 100)}</span>
                  <span>Status: {request.status}</span>
                </div>
                <div className="button-group">
                  <button className="approve-button" onClick={() => handleApprove(request._id)}>
                    Approve
                  </button>
                  <button className="reject-button" onClick={() => handleReject(request._id)}>
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="no-results">No pending leave requests</li>
          )}
          {error && <li className="error">{error}</li>}
        </ul>
      </aside>
    </div>
  );
};

export default ManagerLeaveApplications;