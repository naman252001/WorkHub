// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./ManagerLeaveApplications.css";

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const ManagerLeaveApplications = () => {
//   const navigate = useNavigate();

//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });
//   const [holidays, setHolidays] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No authentication token found");
//           return;
//         }

//         const leaveRes = await axios.get(`${API_BASE_URL}/api/leave/manager?status=pending`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setLeaveRequests(leaveRes.data);

//         const holidayRes = await axios.get(`${API_BASE_URL}/api/holidays`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setHolidays(holidayRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch data: " + (error.response?.data?.message || error.message));
//       }
//     };
//     fetchData();
//   }, []);

//   const handleApprove = async (leaveId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(`${API_BASE_URL}/api/leave/manager/${leaveId}`, { status: 'approved' }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaveRequests(leaveRequests.map(lr => lr._id === leaveId ? res.data.leave : lr));
//       setError(""); // Clear error on success
//     } catch (error) {
//       console.error("Error approving leave:", error);
//       setError("Failed to approve leave: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleReject = async (leaveId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(`${API_BASE_URL}/api/leave/manager/${leaveId}`, { status: 'rejected' }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaveRequests(leaveRequests.map(lr => lr._id === leaveId ? res.data.leave : lr));
//       setError(""); // Clear error on success
//     } catch (error) {
//       console.error("Error rejecting leave:", error);
//       setError("Failed to reject leave: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleAddHoliday = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(`${API_BASE_URL}/api/holidays`, newHoliday, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHolidays([...holidays, res.data]);
//       setNewHoliday({ date: '', name: '' });
//       setError("");
//     } catch (error) {
//       console.error("Error adding holiday:", error);
//       setError("Failed to add holiday: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleDeleteHoliday = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_BASE_URL}/api/holidays/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHolidays(holidays.filter(h => h._id !== id));
//       setError("");
//     } catch (error) {
//       console.error("Error deleting holiday:", error);
//       setError("Failed to delete holiday: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div className="manager-leave-container">
//       <main className="holiday-panel">
//         <h3>Add Holiday</h3>
//         <form onSubmit={handleAddHoliday} className="holiday-form">
//           <input
//             type="date"
//             value={newHoliday.date}
//             onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
//             required
//           />
//           <input
//             type="text"
//             value={newHoliday.name}
//             onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
//             placeholder="Holiday Name"
//             required
//             maxLength={50} // Prevent overly long holiday names
//           />
//           <button type="submit">Add Holiday</button>
//         </form>

//         <h3>Holidays</h3>
//         <ul className="holiday-list">
//           {holidays.length > 0 ? (
//             holidays.map((holiday) => (
//               <li key={holiday._id} className="holiday-item">
//                 <span>
//                   {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
//                 </span>
//                 <button className="delete-button" onClick={() => handleDeleteHoliday(holiday._id)}>
//                   Delete
//                 </button>
//               </li>
//             ))
//           ) : (
//             <li className="no-results">No holidays listed</li>
//           )}
//           {error && <li className="error">{error}</li>}
//         </ul>
//       </main>

//       <aside className="leave-applications-sidebar">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <h3>Leave Applications</h3>

//         <ul className="leave-list">
//           {leaveRequests.length > 0 ? (
//             leaveRequests.map((request) => (
//               <li key={request._id} className="leave-item">
//                 <div>
//                   <span>Employee: {request.user.name.slice(0, 50)}</span>
//                   <span>
//                     Dates: {new Date(request.from).toLocaleDateString()} to{" "}
//                     {new Date(request.to).toLocaleDateString()}
//                   </span>
//                   <span>Reason: {request.reason.slice(0, 100)}</span>
//                   <span>Status: {request.status}</span>
//                 </div>
//                 <div className="button-group">
//                   <button className="approve-button" onClick={() => handleApprove(request._id)}>
//                     Approve
//                   </button>
//                   <button className="reject-button" onClick={() => handleReject(request._id)}>
//                     Reject
//                   </button>
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="no-results">No pending leave requests</li>
//           )}
//           {error && <li className="error">{error}</li>}
//         </ul>
//       </aside>
//     </div>
//   );
// };

// export default ManagerLeaveApplications;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ManagerLeaveApplications = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const leaveRes = await axios.get(
          `${API_BASE_URL}/api/leave/manager?status=pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeaveRequests(leaveRes.data);

        const holidayRes = await axios.get(`${API_BASE_URL}/api/holidays`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHolidays(holidayRes.data);
      } catch (error) {
        setError(
          "Failed to fetch data: " + (error.response?.data?.message || error.message)
        );
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (leaveId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/api/leave/manager/${leaveId}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveRequests(
        leaveRequests.map((lr) => (lr._id === leaveId ? res.data.leave : lr))
      );
      setError("");
    } catch (error) {
      setError(
        "Failed to approve leave: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/api/leave/manager/${leaveId}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveRequests(
        leaveRequests.map((lr) => (lr._id === leaveId ? res.data.leave : lr))
      );
      setError("");
    } catch (error) {
      setError(
        "Failed to reject leave: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/api/holidays`, newHoliday, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays([...holidays, res.data]);
      setNewHoliday({ date: "", name: "" });
      setError("");
    } catch (error) {
      setError(
        "Failed to add holiday: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/holidays/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays(holidays.filter((h) => h._id !== id));
      setError("");
    } catch (error) {
      setError(
        "Failed to delete holiday: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: windowWidth < 768 ? "column" : "row",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f7f7f7",
    overflowX: "hidden",
    overflowY: "auto",
  };

  const holidayPanelStyle = {
    width: windowWidth < 768 ? "100%" : "min(500px, 100%)",
    backgroundColor: "#2c3e50",
    color: "white",
    padding: windowWidth < 768 ? "12px" : "15px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  };

  const sidebarStyle = {
    flex: 1,
    padding: windowWidth < 768 ? "12px" : "15px",
  };

  const backButtonStyle = {
    backgroundColor: "#2980b9",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "15px",
  };

  const formStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    flex: 1,
    minWidth: "120px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "8px 15px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const horizontalListStyle = {
    display: "flex",
    overflowX: windowWidth < 768 ? "auto" : "hidden",
    gap: "10px",
    paddingBottom: "10px",
  };

  const holidayItemStyle = {
    minWidth: windowWidth < 768 ? "250px" : "100%",
    padding: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    wordBreak: "break-word",
  };

  const leaveItemStyle = {
    minWidth: windowWidth < 768 ? "300px" : "100%",
    padding: "10px",
    backgroundColor: "#ffad39",
    borderRadius: "5px",
    flexShrink: 0,
    display: "flex",
    flexDirection: windowWidth < 768 ? "column" : "row",
    justifyContent: "space-between",
    alignItems: windowWidth < 768 ? "flex-start" : "center",
    gap: "10px",
    wordBreak: "break-word",
  };

  const spanStyle = { display: "block", fontSize: "16px", marginBottom: "5px" };
  const buttonGroupStyle = { display: "flex", gap: "10px", flexShrink: 0 };

  const approveButtonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#4caf50",
    color: "white",
    flex: windowWidth < 768 ? 1 : "unset",
  };

  const rejectButtonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
    flex: windowWidth < 768 ? 1 : "unset",
  };

  const deleteButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <main style={holidayPanelStyle}>
        <h3>Add Holiday</h3>
        <form style={formStyle} onSubmit={handleAddHoliday}>
          <input
            type="date"
            style={{ ...inputStyle, maxWidth: "150px" }}
            value={newHoliday.date}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, date: e.target.value })
            }
            required
          />
          <input
            type="text"
            style={inputStyle}
            value={newHoliday.name}
            onChange={(e) =>
              setNewHoliday({ ...newHoliday, name: e.target.value })
            }
            placeholder="Holiday Name"
            required
            maxLength={50}
          />
          <button type="submit" style={buttonStyle}>
            Add Holiday
          </button>
        </form>

        <h3>Holidays</h3>
        <div style={horizontalListStyle}>
          {holidays.length > 0 ? (
            holidays.map((holiday) => (
              <div key={holiday._id} style={holidayItemStyle}>
                <span>
                  {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
                </span>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDeleteHoliday(holiday._id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <span style={spanStyle}>No holidays listed</span>
          )}
        </div>
        {error && <div style={{ color: "#f44336" }}>{error}</div>}
      </main>

      <aside style={sidebarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h3>Leave Applications</h3>
        <div style={horizontalListStyle}>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <div key={request._id} style={leaveItemStyle}>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <span style={spanStyle}>
                    Employee: {request.user.name.slice(0, 50)}
                  </span>
                  <span style={spanStyle}>
                    Dates: {new Date(request.from).toLocaleDateString()} to{" "}
                    {new Date(request.to).toLocaleDateString()}
                  </span>
                  <span style={spanStyle}>
                    Reason: {request.reason.slice(0, 100)}
                  </span>
                  <span style={spanStyle}>Status: {request.status}</span>
                </div>
                <div style={buttonGroupStyle}>
                  <button
                    style={approveButtonStyle}
                    onClick={() => handleApprove(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    style={rejectButtonStyle}
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <span style={spanStyle}>No pending leave requests</span>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ManagerLeaveApplications;
