// Updated backend: controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const asyncHandler = require('express-async-handler');

// Mark attendance for today (employee only)
const markAttendance = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // Time check in backend for security (10:00 AM to 12:30 PM)
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(10, 0, 0, 0);
  const endTime = new Date(now);
  endTime.setHours(12, 30, 0, 0);

  if (now < startTime || now > endTime) {
    return res.status(400).json({ message: 'Attendance can only be marked between 10:00 AM and 12:30 PM' });
  }

  let attendance = await Attendance.findOne({ user: req.user._id, date: today });

  if (attendance) {
    if (attendance.status === 'present') {
      return res.status(400).json({ message: 'Attendance already marked as present today' });
    }
    attendance.status = 'present';
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      user: req.user._id,
      date: today,
      status: 'present',
    });
  }

  // Emit socket event for real-time update (assuming io is attached to app via req.app.get('io'))
  const io = req.app.get('io');
  if (io) {
    io.emit('attendance_updated', { userId: req.user._id, status: 'present' });
  }

  res.status(200).json({ message: 'Attendance marked as present', attendance });
});

// Get attendance records (for calendar, employee own; manager can query by user)
const getAttendance = asyncHandler(async (req, res) => {
  const { month, year, userId } = req.query;

  let query = { user: req.user._id };

  if (req.user.role === 'manager' && userId) {
    query.user = userId;
  }

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    query.date = { $gte: start, $lte: end };
  }

  const attendances = await Attendance.find(query).sort({ date: 1 });

  res.status(200).json(attendances);
});

// Get today's employee attendance (manager only)
// Returns blank '' if before 10 AM, 'present' if marked, else 'absent'
// GET /api/attendance/today?userId=<EMPLOYEE_ID>
const getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const now = new Date();
    const tenAM = new Date(now);
    tenAM.setHours(10, 0, 0, 0);

    // If before 10 AM today, return blank
    if (now < tenAM) {
      return res.json({ status: "" });
    }

    // Start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      return res.json({ status: "absent" });
    }
    
    return res.json({ status: attendance.status || "present" });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { markAttendance, getAttendance, getTodayAttendance };