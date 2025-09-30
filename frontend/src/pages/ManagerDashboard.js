import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/users/employees", // ✅ Corrected URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-dashboard">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search employee by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="employee-card-container">
        {filteredEmployees.map((employee) => (
          <div
            key={employee._id}
            className="employee-card"
            onClick={() => navigate(`/employee-details/${employee._id}`)}
          >
            <h3>{employee.name}</h3>
            <p>{employee.email}</p>
            <p>{employee.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
