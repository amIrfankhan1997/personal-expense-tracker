# Personal Expense Tracker

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing personal expenses. This project provides an interface to log expenses, detect duplicates, and view a list of previously entered expenses.

---

## Project Overview

- **Frontend**: React (located in `frontend/` directory)
- **Backend**: Node.js, Express, and MongoDB (located in `backend/` directory)
- **Database**: MongoDB for persistent data storage

### Features

- **Expense Logging**: Add expenses with details like date, description, amount, and category.
- **Duplicate Detection**: Alerts the user if they try to add a duplicate expense.
- **Expense List Display**: View a list of all logged expenses with details.

---

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (https://nodejs.org/).
- **MongoDB**: Install MongoDB locally or use a cloud provider (e.g., MongoDB Atlas).

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install Dependencies
   Backend
   Navigate to the backend directory and install dependencies:

bash
Copy code
cd backend
npm install

Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies:

bash
Copy code
cd ../frontend
npm install

4. Start the Application
   Backend
   In the backend directory, start the backend server:

bash
Copy code
npm run server
The server will start on http://localhost:5000.

Frontend
In the frontend directory, start the frontend application:

bash
Copy code
npm start
The frontend will open in your browser at http://localhost:3000.

Running Tests
The project includes tests for key components and functionalities, written using Jest and React Testing Library.

Running Tests for Specific Components
To test the frontend components, navigate to the frontend directory and run the following commands:

bash
Copy code

# To test ExpenseForm functionality

npm test src/test/ExpenseForm.test.js

# To test ExpenseList functionality

npm test src/test/ExpenseList.test.js
To run all tests:

bash
Copy code
npm test
Test Cases
ExpenseForm Component:
Tests for form submission and checking if form fields work as expected.
Verifies duplicate expense detection.
ExpenseList Component:
Ensures the expense list displays correctly with all expense details.
