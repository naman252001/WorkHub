// import React, { useState, useEffect } from 'react';
// import './PastWorkPanel.css';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import Papa from 'papaparse';
// import axios from 'axios';

// // Use the correct backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


// const PastWorkPanel = ({ darkMode }) => {
//   const [pastWorkData, setPastWorkData] = useState({});
//   const [filteredData, setFilteredData] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const fetchPastWork = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("User not logged in. Please log in again.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/work`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data && Array.isArray(response.data)) {
//         const grouped = {};
//         response.data.forEach((entry) => {
//           grouped[entry.date] = {
//             logId: entry._id,
//             tasks: entry.tasks.map((t) => ({
//               name: t.task,
//               time: t.duration,
//             })),
//           };
//         });

//         setPastWorkData(grouped);
//         setFilteredData(grouped);
//       } else {
//         setPastWorkData({});
//         setFilteredData({});
//       }
//     } catch (error) {
//       console.error("Error fetching past work:", error);
//       alert("Failed to fetch your past tasks. Please try again.");
//       setPastWorkData({});
//       setFilteredData({});
//     }
//   };

//   useEffect(() => {
//     fetchPastWork();
//     const handleRefresh = () => fetchPastWork();
//     window.addEventListener('refreshPastWork', handleRefresh);
//     return () => window.removeEventListener('refreshPastWork', handleRefresh);
//   }, []);

//   const formatDate = (dateStr) => new Date(dateStr).toDateString();
//   const isWeekend = (dateStr) => {
//     const day = new Date(dateStr).getDay();
//     return day === 0 || day === 6;
//   };
//   const isToday = (dateStr) => {
//     const today = new Date().toDateString();
//     return new Date(dateStr).toDateString() === today;
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
//     const filtered = {};
//     Object.keys(pastWorkData).forEach((date) => {
//       const tasks = pastWorkData[date].tasks.filter((task) =>
//         task.name.toLowerCase().includes(value) || date.toLowerCase().includes(value)
//       );
//       if (tasks.length) {
//         filtered[date] = { ...pastWorkData[date], tasks };
//       }
//     });
//     setFilteredData(filtered);
//   };

//   const handleExportCSV = () => {
//     const rows = [];
//     Object.entries(filteredData).forEach(([date, { tasks }]) => {
//       tasks.forEach((task) => {
//         rows.push({ Date: formatDate(date), Task: task.name, Time: task.time });
//       });
//     });
//     const csv = Papa.unparse(rows);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'PastWork.csv';
//     link.click();
//   };

//   const handleDeleteTask = async (logId, taskIndex) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("User not logged in");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const response = await axios.delete(
//         `${API_BASE_URL}/api/work/${logId}/task/${taskIndex}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         fetchPastWork();
//         alert("Task deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       alert("Failed to delete task");
//     }
//   };

//   const handlePrint = () => window.print();
//   const handleRefresh = () => fetchPastWork();

//   const handleDateFilter = () => {
//     if (!startDate || !endDate) return setFilteredData(pastWorkData);

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const filtered = {};

//     Object.entries(pastWorkData).forEach(([date, data]) => {
//       const current = new Date(date);
//       if (current >= start && current <= end) {
//         filtered[date] = data;
//       }
//     });

//     setFilteredData(filtered);
//   };

//   const groupedByMonth = {};
//   Object.entries(filteredData).forEach(([date, data]) => {
//     const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
//     if (!groupedByMonth[monthYear]) groupedByMonth[monthYear] = [];
//     groupedByMonth[monthYear].push({ date, ...data });
//   });

//   return (
//     <div className={`past-work-panel ${darkMode ? 'dark-body' : ''}`}>
      

//       <div className="header-row fixed-header">
//         <h2>📅 Past Work (Last 90 Days)</h2>
//         <div className="controls-row">
//           <div className="left-controls">
//             <input
//               type="text"
//               placeholder="Search by task/date..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//             <button onClick={handleDateFilter}>Filter</button>
//           </div>
//           <div className="right-controls">
//             <button onClick={handleRefresh}>🔁 Refresh</button>
//             <button onClick={handleExportCSV}>Export CSV</button>
//             <button onClick={handlePrint}>🖨️ Print</button>
//           </div>
//         </div>
//       </div>

//       <div className="work-list scrollable-content">
//         {Object.keys(filteredData).length === 0 && <p>No past work data found.</p>}
//         {Object.entries(groupedByMonth).map(([month, entries]) => (
//           <div key={month} className="month-group">
//             <h3 className="month-title">{month}</h3>
//             {entries.map(({ date, logId, tasks }) => (
//               <div
//                 key={date}
//                 className={`day-entry ${isToday(date) ? 'highlight-today' : isWeekend(date) ? 'highlight-weekend' : ''}`}
//               >
//                 <h4>{formatDate(date)}</h4>
//                 <ul>
//                   {tasks.map((task, idx) => (
//                     <li key={idx} className="task-item">
//                       <span>{task.name} — {task.time}</span>
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDeleteTask(logId, idx)}
//                       >
//                         🗑️
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PastWorkPanel;

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PastWorkPanel = ({ darkMode }) => {
  const [pastWorkData, setPastWorkData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchPastWork = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in. Please log in again.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/work`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        const grouped = {};
        response.data.forEach((entry) => {
          grouped[entry.date] = {
            logId: entry._id,
            tasks: entry.tasks.map((t) => ({
              name: t.task,
              time: t.duration,
            })),
          };
        });

        setPastWorkData(grouped);
        setFilteredData(grouped);
      } else {
        setPastWorkData({});
        setFilteredData({});
      }
    } catch (error) {
      console.error("Error fetching past work:", error);
      alert("Failed to fetch your past tasks. Please try again.");
      setPastWorkData({});
      setFilteredData({});
    }
  };

  useEffect(() => {
    fetchPastWork();
    const handleRefresh = () => fetchPastWork();
    window.addEventListener('refreshPastWork', handleRefresh);
    return () => window.removeEventListener('refreshPastWork', handleRefresh);
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toDateString();
  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6;
  };
  const isToday = (dateStr) => new Date(dateStr).toDateString() === new Date().toDateString();

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = {};
    Object.keys(pastWorkData).forEach((date) => {
      const tasks = pastWorkData[date].tasks.filter((task) =>
        task.name.toLowerCase().includes(value) || date.toLowerCase().includes(value)
      );
      if (tasks.length) filtered[date] = { ...pastWorkData[date], tasks };
    });
    setFilteredData(filtered);
  };

  const handleExportCSV = () => {
    const rows = [];
    Object.entries(filteredData).forEach(([date, { tasks }]) => {
      tasks.forEach((task) => {
        rows.push({ Date: formatDate(date), Task: task.name, Time: task.time });
      });
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'PastWork.csv';
    link.click();
  };

  const handleDeleteTask = async (logId, taskIndex) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not logged in");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/work/${logId}/task/${taskIndex}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        fetchPastWork();
        alert("Task deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const handlePrint = () => window.print();
  const handleRefresh = () => fetchPastWork();

  const handleDateFilter = () => {
    if (!startDate || !endDate) return setFilteredData(pastWorkData);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = {};

    Object.entries(pastWorkData).forEach(([date, data]) => {
      const current = new Date(date);
      if (current >= start && current <= end) filtered[date] = data;
    });

    setFilteredData(filtered);
  };

  const groupedByMonth = {};
  Object.entries(filteredData).forEach(([date, data]) => {
    const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groupedByMonth[monthYear]) groupedByMonth[monthYear] = [];
    groupedByMonth[monthYear].push({ date, ...data });
  });

  // Inline styles
  const panelStyle = {
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: darkMode ? '#1c1c1c' : '#e9f2fd',
    color: darkMode ? '#ddd' : '#222',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: darkMode ? '#2a2a2a' : '#e9ebf1',
    padding: '15px 20px',
    zIndex: 10,
    borderBottom: darkMode ? '2px solid #444' : '2px solid #ccc'
  };

  const controlsRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '10px'
  };

  const leftControlsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center'
  };

  const rightControlsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center'
  };

  const inputStyle = {
    padding: '6px',
    border: `1px solid ${darkMode ? '#555' : '#bbb'}`,
    borderRadius: '4px',
    backgroundColor: darkMode ? '#333' : '#f8f8f8',
    color: darkMode ? '#ddd' : '#222',
    minWidth: '120px'
  };

  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#4a6cf7',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const scrollableContentStyle = {
    overflowY: 'auto',
    padding: '20px',
    flex: 1
  };

  const monthTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: darkMode ? '#444' : '#d1d9ec',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '10px'
  };

  const dayEntryStyle = (date) => ({
    backgroundColor: darkMode ? '#2a2a2a' : '#fdfdfd',
    padding: '10px 15px',
    marginBottom: '10px',
    borderLeft: `5px solid ${
      isToday(date) ? '#ff9800' : isWeekend(date) ? '#f44336' : '#6cbf84'
    }`,
    borderRadius: '4px',
    boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
  });

  const taskItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const taskSpanStyle = {
    flex: 1,
    minWidth: '150px'
  };

  const deleteBtnStyle = {
    marginLeft: '10px',
    padding: '3px 6px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginTop: '5px'
  };

  // Responsive adjustments
  const responsiveFlex = {
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
    gap: '10px'
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2>📅 Past Work (Last 90 Days)</h2>
        <div style={controlsRowStyle}>
          <div style={{ ...leftControlsStyle, ...responsiveFlex }}>
            <input
              type="text"
              placeholder="Search by task/date..."
              value={searchTerm}
              onChange={handleSearch}
              style={inputStyle}
            />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
            <button onClick={handleDateFilter} style={buttonStyle}>Filter</button>
          </div>
          <div style={{ ...rightControlsStyle, ...responsiveFlex }}>
            <button onClick={handleRefresh} style={buttonStyle}>🔁 Refresh</button>
            <button onClick={handleExportCSV} style={buttonStyle}>Export CSV</button>
            <button onClick={handlePrint} style={buttonStyle}>🖨️ Print</button>
          </div>
        </div>
      </div>

      <div style={scrollableContentStyle}>
        {Object.keys(filteredData).length === 0 && <p>No past work data found.</p>}
        {Object.entries(groupedByMonth).map(([month, entries]) => (
          <div key={month}>
            <h3 style={monthTitleStyle}>{month}</h3>
            {entries.map(({ date, logId, tasks }) => (
              <div key={date} style={dayEntryStyle(date)}>
                <h4>{formatDate(date)}</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {tasks.map((task, idx) => (
                    <li key={idx} style={taskItemStyle}>
                      <span style={taskSpanStyle}>{task.name} — {task.time}</span>
                      <button
                        style={deleteBtnStyle}
                        onClick={() => handleDeleteTask(logId, idx)}
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastWorkPanel;
