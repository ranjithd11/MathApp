import React from 'react';
import './NumberPad.css';
import { playClick } from '../../utils/sounds';
import { useSettings } from '../../context/SettingsContext';

const PAD_KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['C', '0', '⌫'],
];

export default function NumberPad({ value, onChange, disabled }) {
  const { soundEnabled } = useSettings();

  const handleKey = (key) => {
    if (disabled) return;
    if (soundEnabled) playClick();

    if (key === 'C') {
      onChange('');
      return;
    }
    if (key === '⌫') {
      onChange(prev => prev.slice(0, -1));
      return;
    }
    // Prevent leading zeros and max 3 digits
    if (value.length >= 3) return;
    if (value === '0' && key === '0') return;
    onChange(prev => (prev === '' ? key : prev + key));
  };

  return (
    <div className="numpad" role="group" aria-label="Number pad">
      {/* Display */}
      <div className={`numpad-display ${disabled ? 'disabled' : ''}`}>
        <span className="display-value">{value || '—'}</span>
      </div>

      {/* Grid */}
      <div className="numpad-grid">
        {PAD_KEYS.map((row, ri) =>
          row.map((key) => {
            const isSpecial = key === 'C' || key === '⌫';
            const isClear   = key === 'C';
            return (
              <button
                key={key}
                className={`numpad-key ${isSpecial ? 'special' : 'digit'} ${isClear ? 'clear' : ''} ${key === '⌫' ? 'backspace' : ''}`}
                onClick={() => handleKey(key)}
                disabled={disabled}
                aria-label={key === '⌫' ? 'backspace' : key === 'C' ? 'clear' : key}
              >
                {key}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
