const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// In-memory database to store expenses
let expenses = [];
let lastId = 0;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// Function to calculate Levenshtein distance
function getLevenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,      // Deletion
                dp[i][j - 1] + 1,      // Insertion
                dp[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return dp[len1][len2];
}

// Endpoint to create multiple expenses at once
app.post('/expenses', (req, res) => {
    const expensesToAdd = req.body;

    // Check if the request body is an array
    if (!Array.isArray(expensesToAdd)) {
        return res.status(400).json({ error: "Request body must be an array of expenses" });
    }

    const flaggedDuplicates = [];
    expensesToAdd.forEach(expense => {
        const { date, description, amount, category } = expense;

        // Check if all required fields are present
        if (!date || !description || !amount || !category) {
            return res.status(400).json({ error: "All fields (date, description, amount, category) are required" });
        }

        // Check for duplicates based on Date, Amount, and Category
        const duplicate = expenses.find(existingExpense => {
            return existingExpense.date === date &&
                existingExpense.amount === amount &&
                existingExpense.category === category;
        });

        if (duplicate) {
            // Check for similarity in Description using Levenshtein distance
            const distance = getLevenshteinDistance(description.toLowerCase(), duplicate.description.toLowerCase());
            if (distance < 5) {  // Threshold for duplicate detection
                // Flag as duplicate and add to flaggedDuplicates
                flaggedDuplicates.push({ ...expense, isDuplicate: true });
            }
        } else {
            // No duplicate, add the expense
            lastId += 1;
            expense.id = lastId;
            expenses.push(expense);
        }
    });

    // Return the added expenses and flagged duplicates
    res.json({
        message: "Expenses processed successfully",
        expenses: expensesToAdd,
        flaggedDuplicates: flaggedDuplicates
    });
});


// Endpoint to get all expenses
app.get('/expenses', (req, res) => {
    const { startDate, endDate, category } = req.query;

    let filteredExpenses = [...expenses];

    // Filter by date range if provided
    if (startDate && endDate) {
        filteredExpenses = filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
        });
    }

    // Filter by category if provided
    if (category) {
        filteredExpenses = filteredExpenses.filter(expense => expense.category.toLowerCase() === category.toLowerCase());
    }

    res.json(filteredExpenses);
});

// Endpoint to get summary of expenses (total amount and per category)
app.get('/expenses/summary', (req, res) => {
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    // Calculate total per category
    const categoryTotals = expenses.reduce((totals, expense) => {
        if (!totals[expense.category]) {
            totals[expense.category] = 0;
        }
        totals[expense.category] += expense.amount;
        return totals;
    }, {});

    res.json({
        totalAmount,
        categoryTotals
    });
});

// Endpoint to update an existing expense
app.put('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const updatedExpense = req.body;

    // Find the expense by ID
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));

    if (expenseIndex === -1) {
        return res.status(404).json({ error: "Expense not found" });
    }

    // Update the expense
    expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedExpense };

    res.json({
        message: "Expense updated successfully",
        expense: expenses[expenseIndex]
    });
});

// Endpoint to delete an expense by ID
app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;

    // Find the index of the expense to delete
    const expenseIndex = expenses.findIndex(expense => expense.id === parseInt(id));

    if (expenseIndex === -1) {
        return res.status(404).json({ error: "Expense not found" });
    }

    // Remove the expense from the array
    expenses.splice(expenseIndex, 1);

    res.json({
        message: "Expense deleted successfully"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;