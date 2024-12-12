// controllers/expenseController.js
const { getExpensesCollection } = require('../config/db');
const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  const { userName } = req.user; // Extract userName from authMiddleware

  try {
    const expenses = getExpensesCollection();
    const userExpenses = await expenses.find({ userName }).toArray(); // Fetch expenses for the logged-in user


    // Debugging log to ensure _id is present in the response
    console.log('Fetched expenses:', userExpenses);

    res.status(200).json(userExpenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses.', error: err.message });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  const { userName } = req.user; // Extract userName from authMiddleware
  const { name, amount, date, category } = req.body;

  try {
    const expenses = getExpensesCollection();
    const newExpense = {
      userName, // Associate with the logged-in user
      name,
      amount,
      date: new Date(date),
      category,
      createdAt: new Date(),
    };
    const result = await expenses.insertOne(newExpense);

    res.status(201).json({
      message: 'Expense added successfully.',
      expense: { ...newExpense, id: result.insertedId },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense.', error: err.message });
n  }
  // res.render('/')
};

// Update an expense
// Update an expense
exports.updateExpense = async (req, res) => {
  const { id } = req.params; // Extract the expense ID from request parameters
  const { name, amount, date, category } = req.body; // Extract updated expense details from the request body

  try {
    const expenses = getExpensesCollection(); // Access the expenses collection
    const updatedExpense = { 
      name, 
      amount, 
      date: new Date(date), 
      category 
    };

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID format.' });
    }

    // Update the document in the database
    const result = await expenses.updateOne(
      { _id: new ObjectId(id) }, // Instantiate ObjectId with `new`
      { $set: updatedExpense }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    res.status(200).json({ message: 'Expense updated successfully.' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error updating expense.', 
      error: err.message 
    });
  }
};


// Delete an expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expenses = getExpensesCollection();
    await expenses.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense.', error: err.message });
  }
};
