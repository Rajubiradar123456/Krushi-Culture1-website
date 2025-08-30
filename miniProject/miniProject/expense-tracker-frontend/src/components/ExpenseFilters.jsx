import React, { useState } from 'react';

function ExpenseFilters({ onFilter, onClear }) {
  const [category, setCategory] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onFilter({ category, start, end });
  };

  const handleClear = () => {
    setCategory('');
    setStart('');
    setEnd('');
    if (onClear) onClear();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <input
        type="date"
        value={start}
        onChange={e => setStart(e.target.value)}
      />
      <input
        type="date"
        value={end}
        onChange={e => setEnd(e.target.value)}
      />
      <button type="submit">Filter</button>
      <button type="button" onClick={handleClear}>Clear Filters</button>
    </form>
  );
}

export default ExpenseFilters;
