// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional for OAuth users
    role: { type: String, required: true, enum: ["Employee", "Manager"] },
    dateOfBirth: { type: Date },

    // Contact & Company Info
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    employeeId: { type: String, trim: true },
    profilePicture: { type: String, default: "/default-avatar.png" },
    JobProfile : {type: String},

    // OAuth IDs
    googleId: { type: String },
    microsoftId: { type: String },

    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // OTP Login
    otpCode: { type: String },
    otpExpires: { type: Date },

    // Leave Balances
    leaveBalances: {
      sick: { type: Number, default: 10 },
      casual: { type: Number, default: 15 },
      vacation: { type: Number, default: 20 },
      emergency: { type: Number, default: 5 },
      other: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

// Optional: Add indexes
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);