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
        amount: amount
    };

    expenses.push(expense);

    res.status(201).json(expense);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});