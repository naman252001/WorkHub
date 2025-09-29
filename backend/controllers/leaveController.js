// controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const asyncHandler = require('express-async-handler');

// Apply for leave (employee only)
const applyLeave = asyncHandler(async (req, res) => {
  const { from, to, type, reason } = req.body;

  if (!from || !to || !type || !reason) {
    return res.status(400).json({ message: 'All fields (from, to, type, reason) are required' });
  }

  const leave = await Leave.create({
    user: req.user._id,
    from: new Date(from),
    to: new Date(to),
    type,
    reason,
  });

  res.status(201).json({ message: 'Leave applied successfully', leave });
});

// Get leave requests (employee: own; used for employee view)
const getLeaves = asyncHandler(async (req, res) => {
  if (req.user.role.toLowerCase() !== 'employee') {
    return res.status(403).json({ message: 'This endpoint is for employees only' });
  }

  const leaves = await Leave.find({ user: req.user._id })
    .populate('user', 'name email')
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(leaves);
});

// Get leave balances (for cards on attendance page)
const getLeaveBalances = asyncHandler(async (req, res) => {
  // ✅ FIX: Select the correct nested field
  const user = await User.findById(req.user._id).select('leaveBalances');

  if (!user) return res.status(404).json({ message: 'User not found' });

  // ✅ FIX: Return the leaveBalances object directly
  res.status(200).json(user.leaveBalances);
});

// Get all leave requests (manager only, with filters)
const getManagerLeaves = asyncHandler(async (req, res) => {
  if (req.user.role.toLowerCase() !== 'manager') {
    return res.status(403).json({ message: 'This endpoint is for managers only' });
  }

  const { status, userId, startDate, endDate } = req.query;
  let query = {};

  if (status) query.status = status;
  if (userId) query.user = userId;
  if (startDate && endDate) {
    query.from = { $gte: new Date(startDate) };
    query.to = { $lte: new Date(endDate) };
  }

  const leaves = await Leave.find(query)
    .populate('user', 'name email')
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(leaves);
});

// Get leaves for a specific user (for manager to view employee history)
const getUserLeaves = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  if (!id) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  const leaves = await Leave.find({ user: id })
    .populate("user", "name email")
    .populate("approvedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(leaves);
});

// Approve or reject leave (manager only)
const updateLeave = asyncHandler(async (req, res) => {
  const { status, approvedNote } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be "approved" or "rejected"' });
  }

  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave not found' });
  if (leave.status !== 'pending') return res.status(400).json({ message: 'Leave already processed' });

  leave.status = status;
  leave.approvedBy = req.user._id;
  leave.approvedNote = approvedNote || '';

  await leave.save();

  if (status === 'approved') {
    const days = Math.ceil((new Date(leave.to) - new Date(leave.from)) / (1000 * 60 * 60 * 24)) + 1;
    const user = await User.findById(leave.user);

    // ✅ FIX: Use the leave.type directly as the key
    const balanceField = leave.type;
    
    // ✅ FIX: Access the nested leaveBalances object
    if (user.leaveBalances[balanceField] === undefined) {
      return res.status(400).json({ message: `Invalid leave type: ${leave.type}` });
    }
    
    if (user.leaveBalances[balanceField] < days) {
      return res.status(400).json({ message: `Insufficient ${leave.type} leave balance` });
    }
    
    user.leaveBalances[balanceField] -= days;
    await user.save();

    let currentDate = new Date(leave.from);
    while (currentDate <= new Date(leave.to)) {
      const date = new Date(currentDate);
      date.setHours(0, 0, 0, 0);
      await Attendance.findOneAndUpdate(
        { user: leave.user, date },
        { status: 'leave' },
        { upsert: true, new: true }
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  res.status(200).json({ message: `Leave ${status}`, leave });
});

module.exports = { applyLeave, getLeaves, getLeaveBalances, getManagerLeaves, updateLeave, getUserLeaves };