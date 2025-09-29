const User = require("../models/User");

const getAllEmployees = async (req, res) => {
  try {
    // Find only employees
    const employees = await User.find({ role: "Employee" })
      .select("name email role"); // Only send needed fields

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .select("name email role tasks"); // Include tasks if you store them here

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllEmployees, getEmployeeById };
