const express = require("express");
const { getTodayTasksByEmployee, getPastTasksByEmployee  } = require("../controllers/taskController");
const router = express.Router();

// GET /api/tasks/today/:id
router.get("/today/:id", getTodayTasksByEmployee);

// Get all past tasks for an employee
router.get("/past/:employeeId", getPastTasksByEmployee);

module.exports = router;
