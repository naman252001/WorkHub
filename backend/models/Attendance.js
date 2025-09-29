// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    default: 'absent',
  },
}, { timestamps: true });

// Ensure one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);