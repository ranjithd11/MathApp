import React from 'react';

const TABLES = Array.from({ length: 11 }, (_, i) => i + 2); // 2 to 12

export default function TableSelection({ onSelectTable }) {
  return (
    <div className="table-selection">
      <h3 className="ts-title">Choose a Table to Practice</h3>
      <div className="ts-grid">
        {TABLES.map(num => (
          <button
            key={num}
            className="ts-card"
            onClick={() => onSelectTable(num)}
            aria-label={`Table of ${num}`}
          >
            <span className="ts-number">{num}</span>
            <span className="ts-label">Table</span>
          </button>
        ))}
      </div>
    </div>
  );
}
