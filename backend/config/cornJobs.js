// backend/config/cronJobs.js
const cron = require("node-cron");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Setup transporter for emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // app password
  }
});

// ✅ 1. Auto mark absent at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const users = await User.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const user of users) {
      const existing = await Attendance.findOne({ user: user._id, date: today });
      if (!existing) {
        await Attendance.create({ user: user._id, date: today, status: "absent" });
      }
    }
    console.log("✅ Absent users auto-marked");
  } catch (err) {
    console.error("❌ Error auto-marking absent:", err.message);
  }
});

// ✅ 2. Send birthday greetings at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // months are 0-based
    const day = today.getDate();

    // Assuming User model has `dob` field as Date
    const users = await User.find();
    const birthdayUsers = users.filter(u => {
      if (!u.dob) return false;
      const dob = new Date(u.dob);
      return dob.getDate() === day && dob.getMonth() + 1 === month;
    });

    for (const user of birthdayUsers) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "🎉 Happy Birthday!",
        text: `Dear ${user.name},\n\nWishing you a very Happy Birthday from the whole team! 🎂🎉\n\nBest Regards,\nCompany HR`
      });
      console.log(`🎂 Birthday mail sent to ${user.email}`);
    }
  } catch (err) {
    console.error("❌ Error sending birthday emails:", err.message);
  }
});
