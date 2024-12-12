const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userName: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
