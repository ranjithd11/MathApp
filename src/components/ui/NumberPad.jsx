import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './NumberPad.css';
import { playClick } from '../../utils/sounds';
import { useSettings } from '../../context/SettingsContext';

const PAD_KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['C', '0', '⌫'],
];

export default function NumberPad({ value, onChange, disabled, actionButton }) {
  const { soundEnabled } = useSettings();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleKey = (key) => {
    if (disabled) return;
    if (soundEnabled) playClick();

    if (key === 'C') {
      onChange('');
      return;
    }
    if (key === '⌫') {
      onChange(value.slice(0, -1));
      return;
    }
    // Prevent leading zeros and max 3 digits
    if (value.length >= 3) return;
    if (value === '0' && key === '0') return;
    onChange(value === '' ? key : value + key);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={`numpad-drawer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle Bar */}
      <button 
        className="np-toggle-bar" 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Collapse number pad" : "Expand number pad"}
      >
        {isExpanded ? <FiChevronDown size={24} /> : <FiChevronUp size={24} />}
      </button>

      <div className="numpad-content">
        <div className="numpad-top-row">
          {/* Display */}
          <div className={`numpad-display ${disabled ? 'disabled' : ''}`}>
            <span className="display-value">{value || '—'}</span>
          </div>
          {/* Action Button (Check / Next) */}
          {actionButton && (
            <div className="numpad-action-wrap">
              {actionButton}
            </div>
          )}
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
    </div>,
    document.body
  );
}
