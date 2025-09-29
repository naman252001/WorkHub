// controllers/holidayController.js
const Holiday = require('../models/Holiday');
const asyncHandler = require('express-async-handler');

// Get all holidays
const getHolidays = asyncHandler(async (req, res) => {
  const holidays = await Holiday.find().sort({ date: 1 });
  res.status(200).json(holidays);
});

// Add a new holiday (manager only)
const addHoliday = asyncHandler(async (req, res) => {
  const { date, name } = req.body;

  if (!date || !name) {
    return res.status(400).json({ message: 'Date and name are required' });
  }

  const holiday = await Holiday.create({ date: new Date(date), name });
  res.status(201).json(holiday);
});

// Delete a holiday (manager only)
const deleteHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) {
    return res.status(404).json({ message: 'Holiday not found' });
  }

  await holiday.deleteOne();
  res.status(200).json({ message: 'Holiday deleted' });
});

module.exports = { getHolidays, addHoliday, deleteHoliday };