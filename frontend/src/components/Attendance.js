// // Updated frontend: components/Attendance.js (employee side - time window adjusted)
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import axios from 'axios';
// import './Attendance.css';

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const Attendance = () => {
//     const navigate = useNavigate();
//     const [date, setDate] = useState(new Date());
//     const [attendances, setAttendances] = useState([]);
//     const [holidays, setHolidays] = useState([]);
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
    
//     // ✅ NEW: State for leave balances
//     const [leaveBalances, setLeaveBalances] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     setError('No authentication token found');
//                     return;
//                 }

//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 const attendanceRes = await axios.get(`${API_BASE_URL}/api/attendance`, config);
//                 setAttendances(attendanceRes.data);

//                 const holidaysRes = await axios.get(`${API_BASE_URL}/api/holidays`, config);
//                 setHolidays(holidaysRes.data);
                
//                 // ✅ NEW: Fetch leave balances from the backend
//                 const leaveBalancesRes = await axios.get(`${API_BASE_URL}/api/leave/balances`, config);
//                 setLeaveBalances(leaveBalancesRes.data);

//             } catch (err) {
//                 setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
//             }
//         };
//         fetchData();
//     }, []);

//     const { totalPresent, totalAbsent } = useMemo(() => {
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         let presentCount = 0;
//         let absentCount = 0;

//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const now = new Date();
//         const tenAM = new Date(now);
//         tenAM.setHours(10, 0, 0, 0);
//         const isBefore10AM = now < tenAM;

//         for (let day = 1; day <= daysInMonth; day++) {
//             const currentDate = new Date(year, month, day);
//             if (currentDate > today) continue;

//             const dayOfWeek = currentDate.getDay();
//             const isHoliday = holidays.some(h => new Date(h.date).toDateString() === currentDate.toDateString());

//             if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) continue;

//             // For today, if before 10 AM, don't count as absent
//             if (currentDate.toDateString() === today.toDateString() && isBefore10AM) {
//                 continue;
//             }

//             const attendance = attendances.find(a => new Date(a.date).toDateString() === currentDate.toDateString());

//             if (attendance && attendance.status === 'present') {
//                 presentCount++;
//             } else {
//                 absentCount++;
//             }
//         }
//         return { totalPresent: presentCount, totalAbsent: absentCount };
//     }, [attendances, holidays, date]);

//     const tileClassName = ({ date, view }) => {
//         if (view !== 'month') return null;

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const now = new Date();
//         const tenAM = new Date(now);
//         tenAM.setHours(10, 0, 0, 0);
//         const isBefore10AM = now < tenAM;

//         const dayOfWeek = date.getDay();
//         const isHoliday = holidays.some(h => new Date(h.date).toDateString() === date.toDateString());

//         if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) {
//             return 'weekend-holiday';
//         }

//         const attendance = attendances.find(a => new Date(a.date).toDateString() === date.toDateString());

//         // For today, if before 10 AM, no class (blank/pending)
//         if (date.toDateString() === today.toDateString() && isBefore10AM) {
//             return null;
//         }

//         if (attendance) {
//             if (attendance.status === 'present') {
//                 return 'present'; 
//             }
//             if (attendance.status === 'absent' && date <= today) {
//                 return 'absent';
//             }
//         }

//         if (!attendance && date < today) {
//             return 'absent';
//         }

//         return null;
//     };

//     const markPresent = async () => {
//         try {
//             const now = new Date();

//             const startTime = new Date();
//             startTime.setHours(10, 0, 0, 0);
//             const endTime = new Date();
//             endTime.setHours(12, 30, 0, 0);

//             if (now < startTime || now > endTime) {
//                 setMessage("⏰ You can only mark present between 10:00 AM and 12:30 PM.");
//                 return;
//             }

//             const token = localStorage.getItem("token");
//             const res = await axios.post(
//                 `${API_BASE_URL}/api/attendance/mark`,
//                 { date: now.toISOString(), status: "present" },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             const todayString = now.toDateString();
//             const updatedAttendances = attendances.filter(a => new Date(a.date).toDateString() !== todayString);

//             setAttendances([...updatedAttendances, { date: now.toISOString(), status: "present" }]);
//             setMessage(res.data.message || "✅ Marked Present for today!");

//         } catch (err) {
//             setMessage(err.response?.data?.message || "❌ Failed to mark present.");
//         }
//     };

//     return (
//         <div className="attendance-page">
//             <div className="attendance-header">
//                 <button className="back-btn" onClick={() => navigate("/employee")}>⬅ Back</button>
//                 <button className="present-btn" onClick={markPresent}>✔ Present</button>
//             </div>

//             {message && <p className="info-msg">{message}</p>}

//             <div className="left-content">
//                 <div className="calendar-wrapper">
//                     <Calendar
//                         onChange={setDate}
//                         value={date}
//                         tileClassName={tileClassName}
//                     />
//                     <div className="attendance-summary">
//                         <p>Total Present Days: {totalPresent}</p>
//                         <p>Total Absent Days: {totalAbsent}</p>
//                     </div>
//                 </div>

//                 <div className="leave-cards-wrapper">
//                     <div className="card-row">
//                         <div className="leave-card sick">
//                             <h4>Sick Leave</h4>
//                             {/* ✅ FIX: Display dynamic leave balance */}
//                             <p>{leaveBalances ? leaveBalances.sick : '...'}</p>
//                         </div>
//                         <div className="leave-card casual">
//                             <h4>Casual Leave</h4>
//                              {/* ✅ FIX: Display dynamic leave balance */}
//                             <p>{leaveBalances ? leaveBalances.casual : '...'}</p>
//                         </div>
//                     </div>
//                     <div className="card-row">
//                         <div className="leave-card vacation">
//                             <h4>Emergency Leave</h4>
//                             {/* ✅ FIX: Display dynamic leave balance */}
//                             <p>{leaveBalances ? leaveBalances.emergency : '...'}</p>
//                         </div>
//                         <div className="leave-card other">
//                             <h4>Other Leave</h4>
//                             {/* ✅ FIX: Display dynamic leave balance */}
//                             <p>{leaveBalances ? leaveBalances.other : '...'}</p>
//                         </div>
//                     </div>
//                     <div className="actions">
//                         <button onClick={() => navigate('/leave/apply')}>Apply for Leave</button>
//                     </div>
//                 </div>
//             </div>

//             <div className="right-content">
//                 <div className="holiday-section">
//                     <h3>Holidays</h3>
//                     <ul className="holiday-list">
//                         {holidays.map((holiday, index) => (
//                             <li key={index}>
//                                 {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
//                             </li>
//                         ))}
//                     </ul>
//                     {error && <p className="error">{error}</p>}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Attendance; 

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

// Custom CSS for react-calendar styling (FIXED: Removed the display: none for day numbers)
const calendarStyles = `
  /* Set the main calendar background to white and text to black */
  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 12px;
    background-color: white;
    font-family: inherit;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Style all text inside the calendar to be black */
  .react-calendar *,
  .react-calendar button {
    color: black !important;
  }

  /* General tile styling */
  .react-calendar__tile {
    /* Adjust height for better spacing */
    height: 60px;
  }
  
  /* Day number inside the tile should be black */
  .react-calendar__tile abbr {
    color: black !important;
  }

  /* Today's date styling to avoid confusion with the color-coded days */
  .react-calendar__tile--now {
    background: #e6f7ff !important; /* Light blue for today */
    color: black !important;
  }
  
  .react-calendar__tile--active:enabled:focus {
    background: #007bff !important; /* Blue for selected day */
  }
  
  /* Ensure the day names (Sun, Mon, etc.) are black */
  .react-calendar__month-view__weekdays__weekday {
    color: black !important;
  }
  
  /* Custom background styles for colored days */
  .present-day {
    background-color: #4caf50 !important; /* green */
    color: white !important;
    border-radius: 50%;
  }

  .absent-day {
    background-color: #f44336 !important; /* red */
    color: white !important;
    border-radius: 50%;
  }

  .holiday-day {
    background-color: #d3d3d3 !important; /* grey */
    color: black !important; /* Keep holiday text dark for contrast on light grey */
    border-radius: 50%;
  }

  /* Ensure the day number (abbr) is white inside the colored backgrounds */
  .present-day abbr, 
  .absent-day abbr {
    color: white !important;
    font-weight: bold;
  }
  
  /* Apply the styles directly to the button element (tile) */
  .react-calendar__tile.present-day, 
  .react-calendar__tile.absent-day, 
  .react-calendar__tile.holiday-day {
    /* Flex is needed to center the content within the tile */
    display: flex; 
    justify-content: center;
    align-items: center;
  }
  
  .react-calendar__tile.present-day abbr, 
  .react-calendar__tile.absent-day abbr,
  .react-calendar__tile.holiday-day abbr {
    /* This centers the number inside the circle area */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    margin: auto;
    font-size: 14px;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Attendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [attendances, setAttendances] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [leaveBalances, setLeaveBalances] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("No authentication token found");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [attendanceRes, holidaysRes, leaveRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/attendance`, config),
          axios.get(`${API_BASE_URL}/api/holidays`, config),
          axios.get(`${API_BASE_URL}/api/leave/balances`, config),
        ]);

        setAttendances(attendanceRes.data);
        setHolidays(holidaysRes.data);
        setLeaveBalances(leaveRes.data);
      } catch (err) {
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, []);

  const { totalPresent, totalAbsent } = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    let presentCount = 0;
    let absentCount = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const tenAM = new Date(now);
    tenAM.setHours(10, 0, 0, 0);
    const isBefore10AM = now < tenAM;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      if (currentDate > today) continue;
      const dayOfWeek = currentDate.getDay();
      const isHoliday = holidays.some(
        (h) => new Date(h.date).toDateString() === currentDate.toDateString()
      );
      if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) continue;
      if (currentDate.toDateString() === today.toDateString() && isBefore10AM) continue;
      const attendance = attendances.find(
        (a) => new Date(a.date).toDateString() === currentDate.toDateString()
      );
      if (attendance?.status === "present") presentCount++;
      else absentCount++;
    }
    return { totalPresent: presentCount, totalAbsent: absentCount };
  }, [attendances, holidays, date]);

  const markPresent = async () => {
    try {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(10, 0, 0, 0);
      const endTime = new Date();
      endTime.setHours(12, 30, 0, 0);
      
      // Time check logic
      if (now < startTime || now > endTime)
        return setMessage("⏰ You can only mark present between 10:00 AM and 12:30 PM.");

      const token = localStorage.getItem("token");
      
      const res = await axios.post(
        `${API_BASE_URL}/api/attendance/mark`, 
        { date: now.toISOString(), status: "present" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const todayString = now.toDateString();
      const updatedAttendances = attendances.filter(
        (a) => new Date(a.date).toDateString() !== todayString
      );
      setAttendances([...updatedAttendances, { date: now.toISOString(), status: "present" }]);
      setMessage(res.data.message || "✅ Marked Present for today!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Unknown error.";
      setMessage(`❌ Failed to mark present: ${errorMsg}. Check console/network tab for details.`);
    }
  };

  // 🟩🟥🩶 Applied custom CSS classes to the tile to change the background.
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't apply custom colors to future days
    if (date > today) return null;

    const attendance = attendances.find(
      (a) => new Date(a.date).toDateString() === date.toDateString()
    );
    const isHoliday =
      holidays.some((h) => new Date(h.date).toDateString() === date.toDateString()) ||
      date.getDay() === 0 ||
      date.getDay() === 6;

    if (isHoliday) {
      return "holiday-day"; // grey
    } else if (attendance?.status === "present") {
      return "present-day"; // green
    } else if (date < today && (!attendance || attendance.status === "absent")) {
      return "absent-day"; // red (Only mark absent if the day has passed)
    }

    return null; // Return null for default calendar styling (future days, today before 10 AM, uncolored workdays)
  };
  
  // NOTE: tileContent is no longer needed since we are using tileClassName
  // and custom CSS for styling. It is commented out for cleanliness.
  // const tileContent = ({ date, view }) => { /* ... */ };


  return (
    <>
      <style>{calendarStyles}</style> {/* Injecting the custom CSS */}
      <div
        style={{
          backgroundColor: "#f7f7f7",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Left Section */}
        <div style={{ flex: "2", minWidth: "320px", maxWidth: "700px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <button
              style={{
                backgroundColor: "darkblue",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/employee")}
            >
              ⬅ Back
            </button>
            <button
              style={{
                backgroundColor: "darkgreen",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={markPresent}
            >
              ✔ Present
            </button>
          </div>

          {message && (
            <p style={{ color: "#333", textAlign: "center", marginBottom: "15px" }}>{message}</p>
          )}

          {/* Calendar Box */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              border: "3px solid #007bff",
            }}
          >
            {/* Using tileClassName to apply background colors and keep numbers visible */}
            <Calendar onChange={setDate} value={date} tileClassName={tileClassName} />

            {/* ✅ Color Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "#4caf50", label: "Present" },
                { color: "#f44336", label: "Absent" },
                { color: "#d3d3d3", label: "Holiday" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      backgroundColor: item.color,
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Attendance Summary */}
            <div style={{ textAlign: "center", marginTop: "15px", fontWeight: "500" }}>
              <p>Total Present Days: {totalPresent}</p>
              <p>Total Absent Days: {totalAbsent}</p>
            </div>
          </div>

          {/* Leave Balances */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              border: "3px solid #4caf50",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
              {[
                { type: "Sick Leave", color: "#3b82f6", key: "sick" },
                { type: "Casual Leave", color: "#22c55e", key: "casual" },
                { type: "Emergency Leave", color: "#eab308", key: "emergency" },
                { type: "Other Leave", color: "#8b5cf6", key: "other" },
              ].map((leave) => (
                <div
                  key={leave.key}
                  style={{
                    flex: "1 1 40%",
                    margin: "10px",
                    padding: "20px",
                    borderRadius: "10px",
                    borderLeft: `6px solid ${leave.color}`,
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ color: "#333", marginBottom: "8px" }}>{leave.type}</h4>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#4caf50" }}>
                    {leaveBalances ? leaveBalances[leave.key] : "..."}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                onClick={() => navigate("/leave/apply")}
                style={{
                  padding: "12px 25px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Apply for Leave
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Holidays */}
        <div
          style={{
            flex: "1",
            minWidth: "280px",
            maxWidth: "400px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
            height: "fit-content",
          }}
        >
          <h3 style={{ textAlign: "center", color: "#333", marginBottom: "15px" }}>Holidays</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {holidays.map((holiday, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#f7f7f7",
                  padding: "10px 12px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >
                <span>{new Date(holiday.date).toLocaleDateString()}</span>
                <span>{holiday.name}</span>
              </li>
            ))}
          </ul>
          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Attendance;
