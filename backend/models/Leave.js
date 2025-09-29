// models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['sick', 'casual', 'vacation', 'emergency', 'other'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedNote: {
    type: String,
  },
}, { timestamps: true });

// Validation: from <= to
leaveSchema.pre('validate', function (next) {
  if (this.from > this.to) {
    return next(new Error('From date cannot be after to date'));
  }
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);