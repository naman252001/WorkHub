// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const nodemailer = require("nodemailer");

// 📧 Setup Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🎂 Manual trigger for birthday email
router.get("/birthday", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0].slice(5); // MM-DD
    const users = await User.find();

    let sentTo = [];

    for (const user of users) {
      if (user.dateOfBirth) {
        const dob = user.dateOfBirth.toISOString().split("T")[0].slice(5);
        if (dob === today) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Happy Birthday 🎉",
            text: `Dear ${user.name},\n\nWishing you a very Happy Birthday! 🥳🎂\n\nBest wishes,\nYour Company`,
          });
          sentTo.push(user.email);
        }
      }
    }

    res.json({ message: "Birthday emails sent", sentTo });
  } catch (error) {
    console.error("Birthday test error:", error);
    res.status(500).json({ error: "Failed to send birthday emails" });
  }
});

// 📅 Manual trigger for attendance marking
router.get("/attendance", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const users = await User.find({ role: "employee" });

    let marked = [];

    for (const user of users) {
      const existingRecord = await Attendance.findOne({
        employeeId: user._id,
        date: today,
      });

      if (!existingRecord) {
        const newAttendance = new Attendance({
          employeeId: user._id,
          date: today,
          status: "Absent",
        });
        await newAttendance.save();
        marked.push(user.name);
      }
    }

    res.json({ message: "Attendance marked", marked });
  } catch (error) {
    console.error("Attendance test error:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// 🔄 Reset today's attendance (for testing)
router.delete("/reset-attendance", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await Attendance.deleteMany({ date: today });
    res.json({ message: "Today's attendance reset", deleted: result.deletedCount });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ error: "Failed to reset attendance" });
  }
});

module.exports = router;
