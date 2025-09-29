const cron = require("node-cron");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Runs daily at 7:00 PM
cron.schedule("0 19 * * *", async () => {
  console.log("🔄 Running Attendance Cron at 7:00 PM");

  try {
    const employees = await User.find({ role: "employee" });

    for (let emp of employees) {
      const today = new Date().toISOString().split("T")[0];

      const alreadyMarked = await Attendance.findOne({
        employee: emp._id,
        date: today,
      });

      if (!alreadyMarked) {
        await Attendance.create({
          employee: emp._id,
          date: today,
          status: "Absent",
        });

        console.log(`❌ Marked Absent: ${emp.name}`);
      }
    }
  } catch (err) {
    console.error("⚠️ Error in Attendance Cron:", err);
  }
});
