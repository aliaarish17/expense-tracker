# 💰 Simple Expense Tracker

A beginner-friendly **Expense Tracker** built using **HTML, CSS, and JavaScript**.

The main purpose of this project is to help our team practice **Git, GitHub, branches, commits, pull requests, and collaboration** while building something small and functional.

---

<img width="1895" height="925" alt="Screenshot 2026-09-25 213512" src="https://github.com/user-attachments/assets/1898b259-7639-4c09-8752-14a7f43e69b1" />


## 🎯 Project Goal

Build a simple expense tracker where a user can:

1. **Add an expense**
2. **View all expenses**
3. **Delete an expense**

That's it. Keep the project simple.

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Storage
- Simple in-memory array

> No database for this project.

---

# 📁 Project Structure

```text
expense-tracker/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⭐ Features

## 1. Add Expense

User enters:

- Expense name
- Amount

Example:

```text
Name: Food
Amount: 250
```

Click **Add Expense**.

The frontend sends the expense to the backend.

---

## 2. View Expenses

Display all added expenses.

Example:

```text
Food       ₹250
Travel     ₹100
Shopping   ₹500
```

The expenses are stored temporarily in the backend.

---

## 3. Delete Expense

Each expense has a **Delete** button.

Example:

```text
Food       ₹250       [Delete]
Travel     ₹100       [Delete]
```

Clicking Delete removes the expense.

---

# 🔄 How the Project Works

Very simple:

```text
User
  ↓
HTML/CSS/JS
  ↓
Backend API
  ↓
Expenses Array
```

Example:

```text
Frontend
   |
   | POST /expenses
   ↓
Backend
   |
   ↓
[
  { name: "Food", amount: 250 },
  { name: "Travel", amount: 100 }
]
```

---

# 🔌 API Endpoints

The backend will have only **3 endpoints**.

### GET `/expenses`

Get all expenses.

```text
GET /expenses
```

---

### POST `/expenses`

Add a new expense.

```text
POST /expenses
```

Example data:

```json
{
  "name": "Food",
  "amount": 250
}
```

---

### DELETE `/expenses/:id`

Delete an expense.

```text
DELETE /expenses/1
```

---

# 👥 Team GitHub Workflow

We are using GitHub mainly to practice collaboration.

## Main branches

```text
main
  ↑
dev
  ↑
feature branches
```

### `main`

Stable version of the project.

**Don't directly work on `main`.**

### `dev`

Where everyone's completed features are combined.

### Feature branches

Each person creates their own branch.

Examples:

```text
feature/frontend
feature/backend
feature/expense-ui
feature/api
```

---

# 🚀 Basic Git Workflow

## First time

Clone the repository:

```bash
git clone <github-repo-url>
```

Enter the project:

```bash
cd expense-tracker
```

Go to `dev`:

```bash
git checkout dev
```

---

## Start working

Create your feature branch:

```bash
git checkout -b feature/my-feature
```

Example:

```bash
git checkout -b feature/frontend
```

---

## After making changes

Check your changes:

```bash
git status
```

Add them:

```bash
git add .
```

Commit:

```bash
git commit -m "add expense form"
```

Push:

```bash
git push -u origin feature/frontend
```

---

## Create Pull Request

Go to GitHub.

Create:

```text
feature/frontend → dev
```

After review, merge the Pull Request.

---

# 🔄 Before Starting New Work

Always get the latest `dev`:

```bash
git checkout dev
git pull origin dev
```

Then create a new branch:

```bash
git checkout -b feature/my-new-feature
```

---

# ⚠️ Important Rules

### 1. Don't directly push to `main`

❌

```bash
git push origin main
```

### 2. Don't work directly on `dev`

Create a feature branch.

### 3. Pull before starting new work

```bash
git checkout dev
git pull origin dev
```

### 4. Make small commits

Good:

```text
add expense form
add delete button
create GET expenses API
fix amount validation
```

Avoid:

```text
final changes
everything
update
asdf
```

---

# 🧑‍💻 Suggested Team Division

For 3 people:

### Person 1 — Frontend

```text
HTML
CSS
Frontend JavaScript
```

Branch:

```text
feature/frontend
```

### Person 2 — Backend

```text
Node.js
Express
API endpoints
```

Branch:

```text
feature/backend
```

### Person 3 — Integration

```text
Connect frontend to backend
Test APIs
Fix bugs
```

Branch:

```text
feature/integration
```

If there are only 2 people, one person can handle frontend and the other backend.

---

# ▶️ Running the Project

## Backend

Go inside backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start server:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:3000
```

---

## Frontend

Open:

```text
frontend/index.html
```

You can use **VS Code Live Server** to run the frontend.

---

# 📌 Current Scope

This project intentionally does **NOT** include:

- ❌ Login/signup
- ❌ Database
- ❌ Authentication
- ❌ Payment system
- ❌ AI
- ❌ Charts
- ❌ Cloud deployment
- ❌ Complex architecture

The goal is simply:

> **Build a small working project while learning GitHub collaboration.**

---

# 🎓 What We Should Learn From This

By the end of this project, everyone should understand:

- How to clone a repository
- How branches work
- How to create feature branches
- How to commit changes
- How to push code
- How to pull changes
- How to create Pull Requests
- How to merge code
- How to resolve basic merge conflicts
- How frontend communicates with a backend API

---

# ✅ Final Goal

A user should be able to:

```text
Open Expense Tracker
        ↓
Add Expense
        ↓
See Expense
        ↓
Delete Expense
```

Keep it simple.

**The GitHub collaboration is the main purpose of this project. 🚀**
