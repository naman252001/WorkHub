const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Format: 'YYYY-MM-DD'
    required: true,
  },
  tasks: [
    {
      task: String,
      duration: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('WorkLog', workLogSchema);



