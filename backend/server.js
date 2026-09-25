const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// In-memory storage for expenses
let expenses = [];



// POST endpoint to add a new expense
app.post('/expenses', (req, res) => {
  const expense = req.body;
  expenses.push(expense);
  res.status(201).json(expense);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
