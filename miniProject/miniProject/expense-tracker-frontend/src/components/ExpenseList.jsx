import React, { useEffect, useState } from 'react';
import { getExpenses } from '../services/api';

function ExpenseList({ refresh, expenses = [], filteredExpenses = [] }) {
  const [currentExpenses, setCurrentExpenses] = useState(expenses);
  const [sortBy, setSortBy] = useState('dateDesc'); // Default sort by newest date

  // Update currentExpenses when the expenses prop changes or on refresh
  useEffect(() => {
    // Decide which list to use: filtered or all expenses
    const dataToDisplay = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    setCurrentExpenses(dataToDisplay);
    // Apply sort whenever the displayed data or sort criteria changes
    sortExpenses(dataToDisplay, sortBy);
  }, [expenses, filteredExpenses, sortBy]); // Removed refresh from here as it's handled by outer useEffect

  // Refetch expenses based on refresh prop (from App.jsx) for the main list
  useEffect(() => {
    if (refresh > 0) {
      getExpenses().then(res => {
        // Only update if no active filter is set by user, or if filteredExpenses is empty
        if (filteredExpenses.length === 0) {
          setCurrentExpenses(res.data);
          sortExpenses(res.data, sortBy); // Sort fresh data
        }
      });
    }
  }, [refresh]);

  const sortExpenses = (data, criterion) => {
    let sorted = [...data];
    switch (criterion) {
      case 'dateDesc':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'dateAsc':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amountAsc':
        sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;
      case 'amountDesc':
        sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;
      default:
        break;
    }
    setCurrentExpenses(sorted);
  };

  const handleSortChange = e => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="dateDesc">Date (Newest First)</option>
          <option value="dateAsc">Date (Oldest First)</option>
          <option value="amountDesc">Amount (High to Low)</option>
          <option value="amountAsc">Amount (Low to High)</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.date}</td>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td>{exp.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
