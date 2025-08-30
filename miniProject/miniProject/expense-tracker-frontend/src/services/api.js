import axios from 'axios';

const API_URL = 'http://localhost:8080/api/expenses';

export const getExpenses = () => axios.get(API_URL);
export const addExpense = (expense) => axios.post(API_URL, expense);
export const getExpensesByCategory = (category) => axios.get(`${API_URL}/category/${category}`);
export const getExpensesByDateRange = (start, end) => axios.get(`${API_URL}/date?start=${start}&end=${end}`);
export const deleteAllExpenses = () => axios.delete(API_URL);
export const resetMonthlyExpenses = () => axios.post(`${API_URL}/resetMonthly`);
