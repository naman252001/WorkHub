import React, { useState, useEffect } from 'react';
import './PastWorkPanel.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import axios from 'axios';

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
      const response = await axios.get("http://localhost:5000/api/work", {
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
  const isToday = (dateStr) => {
    const today = new Date().toDateString();
    return new Date(dateStr).toDateString() === today;
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = {};
    Object.keys(pastWorkData).forEach((date) => {
      const tasks = pastWorkData[date].tasks.filter((task) =>
        task.name.toLowerCase().includes(value) || date.toLowerCase().includes(value)
      );
      if (tasks.length) {
        filtered[date] = { ...pastWorkData[date], tasks };
      }
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
        `http://localhost:5000/api/work/${logId}/task/${taskIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      if (current >= start && current <= end) {
        filtered[date] = data;
      }
    });

    setFilteredData(filtered);
  };

  const groupedByMonth = {};
  Object.entries(filteredData).forEach(([date, data]) => {
    const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!groupedByMonth[monthYear]) groupedByMonth[monthYear] = [];
    groupedByMonth[monthYear].push({ date, ...data });
  });

  return (
    <div className={`past-work-panel ${darkMode ? 'dark-body' : ''}`}>
      

      <div className="header-row fixed-header">
        <h2>📅 Past Work (Last 90 Days)</h2>
        <div className="controls-row">
          <div className="left-controls">
            <input
              type="text"
              placeholder="Search by task/date..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button onClick={handleDateFilter}>Filter</button>
          </div>
          <div className="right-controls">
            <button onClick={handleRefresh}>🔁 Refresh</button>
            <button onClick={handleExportCSV}>Export CSV</button>
            <button onClick={handlePrint}>🖨️ Print</button>
          </div>
        </div>
      </div>

      <div className="work-list scrollable-content">
        {Object.keys(filteredData).length === 0 && <p>No past work data found.</p>}
        {Object.entries(groupedByMonth).map(([month, entries]) => (
          <div key={month} className="month-group">
            <h3 className="month-title">{month}</h3>
            {entries.map(({ date, logId, tasks }) => (
              <div
                key={date}
                className={`day-entry ${isToday(date) ? 'highlight-today' : isWeekend(date) ? 'highlight-weekend' : ''}`}
              >
                <h4>{formatDate(date)}</h4>
                <ul>
                  {tasks.map((task, idx) => (
                    <li key={idx} className="task-item">
                      <span>{task.name} — {task.time}</span>
                      <button
                        className="delete-btn"
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
