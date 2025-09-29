// routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/authmiddleware');
const { getHolidays, addHoliday, deleteHoliday } = require('../controllers/holidayController');

router.get('/', protect, getHolidays); // Get all holidays (accessible to all authenticated users)
router.post('/', protect, managerOnly, addHoliday); // Add holiday (manager only)
router.delete('/:id', protect, managerOnly, deleteHoliday); // Delete holiday (manager only)

module.exports = router;