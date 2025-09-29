// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const { protect, managerOnly } = require('../middleware/authmiddleware');
const {
  applyLeave,
  getLeaves,
  getLeaveBalances,
  getManagerLeaves,
  updateLeave,
  getUserLeaves
} = require('../controllers/leaveController');

// Apply for leave (employee only)
router.post('/apply', protect, applyLeave);

// Get employee’s own leave requests
router.get('/', protect, getLeaves);

// Get leave balances (for cards)
router.get('/balances', protect, getLeaveBalances);

// Manager: view all leave requests with filters
router.get('/manager', protect, managerOnly, getManagerLeaves);

// Manager: approve or reject leave
router.put('/manager/:id', protect, managerOnly, updateLeave);




router.get('/employee/:id', protect, managerOnly, getUserLeaves); // Manager views a specific user's leaves

module.exports = router;