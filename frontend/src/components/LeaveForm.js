// // components/LeaveForm.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './LeaveForm.css';

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const LeaveForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     from: '',
//     to: '',
//     type: '',
//     reason: '',
//   });
//   const [pastLeaves, setPastLeaves] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Fetch past leaves on component mount
//   useEffect(() => {
//     const fetchPastLeaves = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('Please log in to view your leaves.');
//           setLoading(false);
//           return;
//         }
//         const response = await axios.get(`${API_BASE_URL}/api/leave`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPastLeaves(response.data);
//       } catch (err) {
//         console.error('Error fetching past leaves:', err);
//         setError('Failed to load past leaves: ' + (err.response?.data?.message || 'Check server connection.'));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPastLeaves();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const requiredFields = { from: formData.from, to: formData.to, type: formData.type, reason: formData.reason };
//     if (!Object.values(requiredFields).every((field) => field && field.trim() !== '')) {
//       setError('All fields (From Date, To Date, Leave Type, Reason) are required');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const payload = {
//         from: formData.from,
//         to: formData.to,
//         type: formData.type,
//         reason: formData.reason,
//       };
//       await axios.post(`${API_BASE_URL}/api/leave/apply`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setError('');
//       alert('Leave applied successfully with pending status');
//       const response = await axios.get(`${API_BASE_URL}/api/leave`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPastLeaves(response.data);
//       setFormData({ from: '', to: '', type: '', reason: '' });
//     } catch (err) {
//       console.error('Submit error:', err);
//       setError('Failed to apply leave: ' + (err.response?.data?.message || 'Check server connection.'));
//     }
//   };

//   return (
//     <div className="leave-form-page">
//       <div className="leave-form-container">
//         <aside className="leave-form-sidebar">
//           <form onSubmit={handleSubmit} className="leave-form">
//             <h2>Apply for Leave</h2>
//             {error && <p className="error">{error}</p>}
//             <div className="form-group">
//               <label>From Date:</label>
//               <input type="date" name="from" value={formData.from} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>To Date:</label>
//               <input type="date" name="to" value={formData.to} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Leave Type:</label>
//               <select name="type" value={formData.type} onChange={handleChange} required>
//                 <option value="">Select</option>
//                 <option value="sick">Sick Leave</option>
//                 <option value="casual">Casual Leave</option>
//                 <option value="emergency">Emergency Leave</option>
//                 <option value="other">Other Leave</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Reason:</label>
//               <textarea name="reason" value={formData.reason} onChange={handleChange} required />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </aside>

//         <main className="leave-applications-panel">
//           <h2>Past Leave Applications</h2>
//           {loading ? (
//             <p className="loading-text">Loading past leaves...</p>
//           ) : error ? (
//             <p className="error">{error}</p>
//           ) : pastLeaves.length === 0 ? (
//             <p className="no-leaves-text">No past leave applications.</p>
//           ) : (
//             <ul className="leave-list">
//               {pastLeaves.map((leave) => (
//                 <li key={leave._id} className="leave-item">
//                   <div>
//                     <span>From: {new Date(leave.from).toLocaleDateString()}</span>
//                     <span>To: {new Date(leave.to).toLocaleDateString()}</span>
//                     <span>Reason: {leave.reason}</span>
//                     <span>Status: {leave.status}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default LeaveForm;

// components/LeaveForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LeaveForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    type: "",
    reason: "",
  });
  const [pastLeaves, setPastLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch past leaves
  useEffect(() => {
    const fetchPastLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your leaves.");
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/leave`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPastLeaves(response.data);
      } catch (err) {
        console.error("Error fetching past leaves:", err);
        setError(
          "Failed to load past leaves: " +
            (err.response?.data?.message || "Check server connection.")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPastLeaves();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from, to, type, reason } = formData;
    if (!from || !to || !type || !reason) {
      setError("All fields (From, To, Type, Reason) are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = { from, to, type, reason };
      await axios.post(`${API_BASE_URL}/api/leave/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Leave applied successfully (Pending status)");
      const res = await axios.get(`${API_BASE_URL}/api/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastLeaves(res.data);
      setFormData({ from: "", to: "", type: "", reason: "" });
      setError("");
    } catch (err) {
      setError(
        "Failed to apply leave: " +
          (err.response?.data?.message || "Check server connection.")
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: windowWidth <= 768 ? "column" : "row",
        height: "100vh",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "rgba(255,255,255,0.9)",
        overflowY: "auto",
      }}
    >
      {/* Apply for Leave Sidebar */}
      <aside
        style={{
          width: windowWidth <= 768 ? "100%" : "500px",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          overflowY: "auto",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
              color: "#fff",
            }}
          >
            Apply for Leave
          </h2>
          {error && <p style={{ color: "#f44336", textAlign: "center" }}>{error}</p>}

          {/* Date Inputs */}
          {[
            { label: "From Date:", type: "date", name: "from" },
            { label: "To Date:", type: "date", name: "to" },
          ].map((f) => (
            <div
              key={f.name}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label style={{ fontWeight: "bold" }}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                }}
              />
            </div>
          ))}

          {/* Leave Type */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "bold" }}>Leave Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
                backgroundColor: "#f9f9f9",
                color: "#333",
              }}
            >
              <option value="">Select</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="other">Other Leave</option>
            </select>
          </div>

          {/* Reason */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "bold" }}>Reason:</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
                backgroundColor: "#f9f9f9",
                color: "#333",
                height: "100px",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              width: "50%",
              alignSelf: "center",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#025b06")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
          >
            Submit
          </button>
        </form>
      </aside>

      {/* Past Leave Applications */}
      <main
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            color: "#333",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Past Leave Applications
        </h2>
        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Loading past leaves...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : pastLeaves.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No past leave applications.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pastLeaves.map((leave) => (
              <li
                key={leave._id}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ display: "block", marginBottom: "5px" }}>
                    From: {new Date(leave.from).toLocaleDateString()}
                  </span>
                  <span style={{ display: "block", marginBottom: "5px" }}>
                    To: {new Date(leave.to).toLocaleDateString()}
                  </span>
                  <span style={{ display: "block", marginBottom: "5px" }}>
                    Reason: {leave.reason}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontWeight: "bold",
                      color:
                        leave.status === "approved"
                          ? "green"
                          : leave.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    Status: {leave.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default LeaveForm;
