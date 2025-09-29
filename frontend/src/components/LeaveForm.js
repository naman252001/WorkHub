// components/LeaveForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LeaveForm.css';

// Use the correct backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LeaveForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    type: '',
    reason: '',
  });
  const [pastLeaves, setPastLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch past leaves on component mount
  useEffect(() => {
    const fetchPastLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your leaves.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/leave`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPastLeaves(response.data);
      } catch (err) {
        console.error('Error fetching past leaves:', err);
        setError('Failed to load past leaves: ' + (err.response?.data?.message || 'Check server connection.'));
      } finally {
        setLoading(false);
      }
    };
    fetchPastLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = { from: formData.from, to: formData.to, type: formData.type, reason: formData.reason };
    if (!Object.values(requiredFields).every((field) => field && field.trim() !== '')) {
      setError('All fields (From Date, To Date, Leave Type, Reason) are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        from: formData.from,
        to: formData.to,
        type: formData.type,
        reason: formData.reason,
      };
      await axios.post(`${API_BASE_URL}/api/leave/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError('');
      alert('Leave applied successfully with pending status');
      const response = await axios.get(`${API_BASE_URL}/api/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPastLeaves(response.data);
      setFormData({ from: '', to: '', type: '', reason: '' });
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to apply leave: ' + (err.response?.data?.message || 'Check server connection.'));
    }
  };

  return (
    <div className="leave-form-page">
      <div className="leave-form-container">
        <aside className="leave-form-sidebar">
          <form onSubmit={handleSubmit} className="leave-form">
            <h2>Apply for Leave</h2>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <label>From Date:</label>
              <input type="date" name="from" value={formData.from} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>To Date:</label>
              <input type="date" name="to" value={formData.to} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Leave Type:</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="emergency">Emergency Leave</option>
                <option value="other">Other Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason:</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </aside>

        <main className="leave-applications-panel">
          <h2>Past Leave Applications</h2>
          {loading ? (
            <p className="loading-text">Loading past leaves...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : pastLeaves.length === 0 ? (
            <p className="no-leaves-text">No past leave applications.</p>
          ) : (
            <ul className="leave-list">
              {pastLeaves.map((leave) => (
                <li key={leave._id} className="leave-item">
                  <div>
                    <span>From: {new Date(leave.from).toLocaleDateString()}</span>
                    <span>To: {new Date(leave.to).toLocaleDateString()}</span>
                    <span>Reason: {leave.reason}</span>
                    <span>Status: {leave.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default LeaveForm;