// routes/userRoute.js
const express = require("express");
const router = express.Router();
const { getAllEmployees, getEmployeeById } = require("../controllers/userController");

router.get("/employees", getAllEmployees);

// ✅ Add this route to fetch employee by ID
router.get("/:id", getEmployeeById);

module.exports = router;
