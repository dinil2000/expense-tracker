// routes/expenseRoutes.js
const express = require('express');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getExpenses); // Get expenses for the logged-in user
router.post('/', authMiddleware, addExpense); // Add a new expense
router.put('/:id', authMiddleware, updateExpense); // Update an expense
router.delete('/:id', authMiddleware, deleteExpense); // Delete an expense

module.exports = router;
