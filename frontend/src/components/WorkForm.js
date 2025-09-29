import React, { useState } from 'react';
import axios from 'axios';

const WorkForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/work', { employeeName, taskDescription });
      setMessage('Work log submitted!');
      setEmployeeName('');
      setTaskDescription('');
    } catch (error) {
      console.error('Error submitting work:', error);
      setMessage('Failed to submit work log');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Work Log Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-2 p-2 border rounded"
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          required
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default WorkForm;
