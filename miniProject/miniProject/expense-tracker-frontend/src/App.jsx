import React, { useState, useEffect } from 'react';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseFilters from './components/ExpenseFilters';
import MonthlySummary from './components/MonthlySummary';
import { getExpensesByCategory, getExpensesByDateRange, deleteAllExpenses, resetMonthlyExpenses } from './services/api'; // Added deleteAllExpenses

function App() {
  const [refresh, setRefresh] = useState(0);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [salary, setSalary] = useState(() => {
    // Persist salary in localStorage
    const saved = localStorage.getItem('salary');
    return saved ? Number(saved) : '';
  });
  const [expenses, setExpenses] = useState([]);
  const [remaining, setRemaining] = useState(salary);

  // Fetch all expenses for balance and charts
  useEffect(() => {
    fetchExpenses();
  }, [refresh]);

  useEffect(() => {
    // Calculate remaining balance
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    console.log('Salary:', salary, 'Total Expenses:', total);
    // Ensure remaining is a number or empty string
    setRemaining(salary !== '' ? Number(salary) - total : '');
    console.log('Calculated Remaining:', remaining);
  }, [salary, expenses]);

  // Auto-reset on 1st of month
  useEffect(() => {
    const today = new Date();
    // Only run on the 1st day of the month AND if there are expenses to clear
    // Also, ensure it only runs once per app load on the 1st by using a flag in localStorage
    const lastResetMonth = localStorage.getItem('lastResetMonth');
    if (today.getDate() === 1 && expenses.length > 0 && lastResetMonth !== String(today.getMonth())) {
      handleReset();
      localStorage.setItem('lastResetMonth', String(today.getMonth()));
    } else if (today.getDate() !== 1) {
        // Clear the reset flag if it's not the 1st of the month, so it can reset next month
        localStorage.removeItem('lastResetMonth');
    }
  }, [expenses]); // Re-run if expenses change, to check reset condition

  const fetchExpenses = async () => {
    // Get all expenses for balance and charts
    try {
      const res = await fetch('http://localhost:8080/api/expenses');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Fetched Expenses Data:', data); // Add this line
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]); // Reset expenses on error to prevent issues
    }
  };

  const handleAdd = () => setRefresh(r => r + 1);

  const handleFilter = async ({ category, start, end }) => {
    if (category) {
      const res = await getExpensesByCategory(category);
      setFilteredExpenses(res.data);
    } else if (start && end) {
      const res = await getExpensesByDateRange(start, end);
      setFilteredExpenses(res.data);
    } else {
      setFilteredExpenses([]);
    }
  };

  const handleSalaryChange = e => {
    // Ensure salary is stored as a number or empty string
    const value = e.target.value;
    setSalary(value !== '' ? Number(value) : '');
    localStorage.setItem('salary', value);
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all expenses for the new month?")) {
      try {
        await resetMonthlyExpenses(); // Changed from deleteAllExpenses()
        setRefresh(r => r + 1);
        localStorage.setItem('lastResetMonth', String(new Date().getMonth())); // Mark reset for current month
      } catch (error) {
        console.error("Error deleting expenses:", error);
        alert("Failed to reset expenses. Please check the backend.");
      }
    }
  };

  // Helper for balance color
  const getBalanceClass = () => {
    if (remaining === '') return '';
    // Convert remaining to a number for comparison if it's not already
    const numRemaining = Number(remaining);
    if (numRemaining <= 0) return 'balance negative';
    // Use Number(salary) for comparison if salary might be a string
    if (numRemaining < (Number(salary) * 0.2)) return 'balance low';
    return 'balance positive';
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div className="summary-box" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <label htmlFor="salary">Monthly Salary:</label>
        <input
          id="salary"
          type="number"
          value={salary}
          onChange={handleSalaryChange}
          min="0"
          placeholder="Enter your monthly salary"
        />
        <span className={getBalanceClass()}>
          Remaining Balance: <b>{remaining !== '' ? remaining.toFixed(2) : 'N/A'}</b>
        </span>
        <button style={{ marginLeft: 'auto' }} onClick={handleReset}>Reset Expenses</button>
      </div>
      <div className="card">
        <AddExpenseForm onAdd={handleAdd} remaining={remaining} />
      </div>
      <div className="card">
        <ExpenseFilters onFilter={handleFilter} onClear={() => setFilteredExpenses([])} />
      </div>
      <div className="card">
        <ExpenseList refresh={refresh} expenses={expenses} filteredExpenses={filteredExpenses} />
      </div>
      <MonthlySummary expenses={expenses} salary={salary} remaining={remaining} />
    </div>
  );
}

export default App;
