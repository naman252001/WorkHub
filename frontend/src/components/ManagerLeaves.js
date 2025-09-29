// components/ManagerLeaves.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagerLeaves.css';

const ManagerLeaves = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/leave/manager?status=pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaves');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      }
    };
    fetchLeaves();
  }, [navigate]);

  const handleAction = async (id, status, note) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/leave/manager/${id}`,
        { status, approvedNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves(leaves.filter((leave) => leave._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave');
    }
  };

  return (
    <div className="manager-leaves-container">
      <h2>Manage Leave Requests</h2>
      {error && <p className="error">{error}</p>}
      <div className="leaves-list">
        {leaves.map((leave) => (
          <div key={leave._id} className="leave-item">
            <p><strong>Employee:</strong> {leave.user.name} ({leave.user.email})</p>
            <p><strong>From:</strong> {new Date(leave.from).toLocaleDateString()}</p>
            <p><strong>To:</strong> {new Date(leave.to).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {leave.type}</p>
            <p><strong>Reason:</strong> {leave.reason}</p>
            <div className="actions">
              <input type="text" placeholder="Note" id={`note-${leave._id}`} />
              <button
                onClick={() =>
                  handleAction(leave._id, 'approved', document.getElementById(`note-${leave._id}`).value)
                }
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleAction(leave._id, 'rejected', document.getElementById(`note-${leave._id}`).value)
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerLeaves;