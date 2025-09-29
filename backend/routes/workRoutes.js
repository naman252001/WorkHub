const express = require('express');
const router = express.Router();
const { saveWorkLog, getWorkLogs, deleteTaskFromLog } = require('../controllers/workController');
const verifyToken = require("../middleware/verifyToken");

// ✅ Save or update a work log
router.post("/save", verifyToken, saveWorkLog);

// ✅ Get all logs for the logged-in user
router.get('/', verifyToken, getWorkLogs);

// ✅ Delete a specific task from a specific log
router.delete("/:logId/task/:taskIndex", verifyToken, deleteTaskFromLog);

module.exports = router;
