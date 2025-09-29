// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Assuming protect middleware for authentication
const { markAttendance, getAttendance, getTodayAttendance } = require('../controllers/attendanceController');

router.post('/mark', protect, markAttendance); // Employee marks present
router.get('/', protect, getAttendance); // Get for calendar (employee own; manager by userId)

// ✅ FIX: Add 'protect' middleware to secure this endpoint
router.get("/today", protect, getTodayAttendance); 

module.exports = router;