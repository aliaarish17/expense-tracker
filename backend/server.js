// Expense Tracker Backend



const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
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

// GET /expenses
app.get("/expenses", (req, res) => {
  res.status(200).json(expenses);
});

// DELETE /expenses/:id
app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = expenses.findIndex((expense) => expense.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }

  const deletedExpense = expenses.splice(index, 1)[0];

  res.status(200).json({
    message: "Expense deleted successfully",
    deletedExpense: deletedExpense,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});