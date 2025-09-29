const WorkLog = require('../models/WorkLog');

// POST: Add or update today's work log
// POST: Add or update today's work log
exports.saveWorkLog = async (req, res) => {
  try {
    const { userId, date, tasks } = req.body;

    if (!userId || !date || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ msg: "userId, date, and tasks are required" });
    }

    const formattedTasks = tasks.map(({ taskName, taskTime }) => ({
      task: taskName,
      duration: taskTime,
    }));

    let log = await WorkLog.findOne({ userId, date });

    if (log) {
      log.tasks = formattedTasks;
      await log.save();
    } else {
      log = await WorkLog.create({ userId, date, tasks: formattedTasks });
    }

    res.status(200).json({ msg: "Work log saved", log });
  } catch (error) {
    console.error("Error saving work log:", error);
    res.status(500).json({ msg: "Server error" });
  }
};



const mongoose = require("mongoose");

exports.getWorkLogs = async (req, res) => {
  try {
    // ✅ Always take user ID from the verified token
    const userIdFromToken = req.user.id;
    console.log("userIdFromToken:", userIdFromToken);

    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userIdFromToken)) {
      console.log("Invalid userId format from token:", userIdFromToken);
      return res.status(400).json({ msg: "Invalid user ID format" });
    }

    // ✅ Fetch only this user's logs
    const logs = await WorkLog.find({ userId: userIdFromToken }).sort({ date: -1 });

    console.log("Fetched logs:", logs);
    res.json(logs);
  } catch (err) {
    console.error("Error in getWorkLogs:", err.message, err.stack);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.deleteTaskFromLog = async (req, res) => {
  try {
    const { logId, taskIndex } = req.params;
    const userId = req.user.id;

    const log = await WorkLog.findOne({ _id: logId, userId });
    if (!log) return res.status(404).json({ msg: "Work log not found" });

    log.tasks.splice(taskIndex, 1); // Remove task at index
    await log.save();

    res.status(200).json({ msg: "Task deleted successfully", log });
  } catch (err) {
    console.error("Delete task error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};



