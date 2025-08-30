import React, { useState } from 'react';
import { addExpense } from '../services/api';

const initialForm = { amount: '', category: '', date: '', description: '' };

function AddExpenseForm({ onAdd, remaining }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.amount <= 0 || !form.category || !form.date) {
      setError('Please enter valid data');
      setSuccess(false);
      return;
    }
    if (remaining !== '' && Number(form.amount) > Number(remaining)) {
      setError('Expense exceeds remaining balance!');
      setSuccess(false);
      return;
    }
    setError('');
    await addExpense(form);
    setForm(initialForm);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
    if (onAdd) onAdd();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', alignItems: 'center' }}>
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
        min="0.01"
        step="0.01"
      />
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit">Add Expense</button>
      {error && <div style={{ color: 'red', marginTop: '0.5rem', width: '100%' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '0.5rem', width: '100%' }}>Expense added!</div>}
    </form>
  );
}

export default AddExpenseForm;
