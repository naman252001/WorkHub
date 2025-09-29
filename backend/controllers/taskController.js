const WorkLog = require("../models/WorkLog");

// GET today's tasks for a specific employee
exports.getTodayTasksByEmployee = async (req, res) => {
  try {
    const { id } = req.params; // employee ID
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const workLog = await WorkLog.findOne({
      userId: id,
      date: today
    }).populate("userId", "name email role"); // Optional: fetch employee details

    if (!workLog) {
      return res.json([]); // No tasks found for today
    }

    res.json(workLog.tasks);
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPastTasksByEmployee = async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    // Find all work logs for this employee, sorted by date descending
    const workLogs = await WorkLog.find({ userId: employeeId }).sort({ date: -1 });

    if (!workLogs || workLogs.length === 0) {
      return res.json([]); // no tasks found
    }

    // Flatten tasks with their date
    const tasks = [];
    workLogs.forEach((log) => {
      log.tasks.forEach((task) => {
        tasks.push({
          date: log.date,
          task: task.task,
          duration: task.duration,
        });
      });
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching past tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
