import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkList = () => {
  const [workLogs, setWorkLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/work');
        setWorkLogs(res.data);
      } catch (error) {
        console.error('Error fetching work logs:', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">All Work Logs</h2>
      {workLogs.map((log) => (
        <div key={log._id} className="mb-4 p-3 border-b">
          <h3 className="font-bold">{log.employeeName}</h3>
          <p>{log.taskDescription}</p>
          <p className="text-sm text-gray-500">{new Date(log.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkList;
