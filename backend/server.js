//POST FEATURE
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Temporary in-memory storage
const expenses = [];

// POST /expenses
app.post("/expenses", (req, res) => {
  const { name, amount } = req.body;

  const expense = {
    id: expenses.length + 1,
    name: name,
    amount: amount,
  };

  expenses.push(expense);

  res.status(201).json(expense);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// DELETE /expenses/:id
app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const deletedExpense = expenses.splice(index, 1)[0];

  res.status(200).json({
    message: "Expense deleted successfully",
    deletedExpense: deletedExpense,
  });
});
