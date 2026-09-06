import React, { useEffect, useRef } from 'react';
import './CountdownTimer.css';

export default function CountdownTimer({ secondsLeft, total, running }) {
  const isUrgent = secondsLeft <= 5 && secondsLeft > 0;
  const isDone   = secondsLeft === 0;

  // SVG clock ring
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? secondsLeft / total : 0;
  const dashOffset = circumference * (1 - progress);

  // Minute and second hands for clock face
  const seconds = secondsLeft % 60;
  const secondDeg = (seconds / 60) * 360;

  return (
    <div className={`countdown-timer ${isUrgent ? 'urgent' : ''} ${isDone ? 'done' : ''} ${!running ? 'paused' : ''}`}>
      {/* SVG ring clock */}
      <div className="timer-ring-wrap">
        <svg className="timer-svg" viewBox="0 0 70 70" width="70" height="70">
          {/* Background track */}
          <circle
            cx="35" cy="35" r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="5"
          />
          {/* Progress arc */}
          <circle
            cx="35" cy="35" r={radius}
            fill="none"
            stroke={isUrgent ? 'var(--accent-red)' : isDone ? 'var(--accent-red)' : 'var(--accent-secondary)'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '35px 35px',
              transition: running ? 'stroke-dashoffset 1s linear, stroke 0.3s ease' : 'none',
            }}
          />
          {/* Center display */}
          <text
            x="35" y="35"
            textAnchor="middle"
            dominantBaseline="central"
            className="timer-text"
            fill={isUrgent ? 'var(--accent-red)' : 'var(--text-primary)'}
          >
            {secondsLeft}
          </text>
        </svg>

        {/* Urgency pulse ring */}
        {isUrgent && <div className="pulse-ring" />}
      </div>

      {/* Label */}
      <span className={`timer-label ${isUrgent ? 'urgent-label' : ''}`}>
        {isDone ? '⌛ Time Up!' : isUrgent ? '⚡ Hurry!' : '⏱ Time'}
      </span>
    </div>
  );
}
