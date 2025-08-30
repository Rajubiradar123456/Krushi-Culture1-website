import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function MonthlySummary({ expenses, salary, remaining }) {
  if (!expenses.length) return null;

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Pie chart data (category-wise)
  const byCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#B2FF66', '#FF66B2', '#66B2FF', '#B266FF'
        ],
      },
    ],
  };

  // Bar chart data (daily)
  const byDate = expenses.reduce((acc, exp) => {
    acc[exp.date] = (acc[exp.date] || 0) + Number(exp.amount);
    return acc;
  }, {});
  const sortedDates = Object.keys(byDate).sort();
  const barData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Total Spent',
        data: sortedDates.map(date => byDate[date]),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  console.log('byCategory', byCategory);
  console.log('Pie Chart Data:', pieData.datasets[0].data);
  console.log('Bar Chart Data:', barData.datasets[0].data);

  return (
    
    <div className="summary-box">
      <h3>Monthly Summary</h3>
      <p>Total Spent: {total}</p>
      {salary && <p>Salary: {salary} | Remaining Balance: <b>{remaining}</b></p>}
      <div className="charts-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ width: 300, minWidth: 200 }}>
          <h4>By Category</h4>
          <Pie data={pieData} />
        </div>
        <div className="card" style={{ width: 400, minWidth: 250 }}>
          <h4>Daily Spend</h4>
          <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>
      <ul>
        {Object.entries(byCategory).map(([cat, amt]) => (
          <li key={cat}>{cat}: {Number(amt)}</li>
        ))}
    </ul>
    </div>
  );
}

export default MonthlySummary;
