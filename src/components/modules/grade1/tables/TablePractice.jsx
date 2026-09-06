import React, { useState, useRef, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';
import { playCorrect, playWrong } from '../../../../utils/sounds';
import { useSettings } from '../../../../context/SettingsContext';

export default function TablePractice({ tableNum, onBack }) {
  const { soundEnabled } = useSettings();
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [statuses, setStatuses] = useState(Array(10).fill('idle')); // 'idle' | 'correct' | 'wrong'

  const inputRefs = useRef([]);

  // Auto-focus first row on mount or table change
  useEffect(() => {
    // Wait for the 0.4s fade-in animation to complete before grabbing focus
    const t = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 450);
    return () => clearTimeout(t);
  }, [tableNum]);

  const handleInputChange = (idx, val) => {
    // Only allow numbers
    if (!/^\d*$/.test(val)) return;

    const newAnswers = [...answers];
    newAnswers[idx] = val;
    setAnswers(newAnswers);

    // reset status when typing
    if (statuses[idx] !== 'idle') {
      const newStatuses = [...statuses];
      newStatuses[idx] = 'idle';
      setStatuses(newStatuses);
    }
  };

  const checkAnswer = (idx, forcedValue = null) => {
    const valToParse = forcedValue !== null ? forcedValue : answers[idx];
    const userAnswer = parseInt(valToParse, 10);
    if (isNaN(userAnswer)) return;

    const correctAnswer = tableNum * (idx + 1);
    const isCorrect = userAnswer === correctAnswer;

    const newStatuses = [...statuses];
    newStatuses[idx] = isCorrect ? 'correct' : 'wrong';
    setStatuses(newStatuses);

    if (soundEnabled) {
      if (isCorrect) playCorrect();
      else playWrong();
    }

    // Auto-advance focus to next empty if correct
    if (isCorrect && idx < 9) {
      // Find next idle or wrong
      const nextIdx = newStatuses.findIndex((s, i) => i > idx && s !== 'correct');
      if (nextIdx !== -1 && inputRefs.current[nextIdx]) {
        inputRefs.current[nextIdx].focus();
      }
    }
  };

  // Auto-submit after 1s if correct
  useEffect(() => {
    const timeouts = [];
    answers.forEach((val, idx) => {
      if (val !== '' && statuses[idx] !== 'correct') {
        const parsed = parseInt(val, 10);
        const correctAnswer = tableNum * (idx + 1);
        if (parsed === correctAnswer) {
          const t = setTimeout(() => {
            // Check answer using the exact value to avoid stale closures
            checkAnswer(idx, val);
          }, 1000); // 1 second delay for correct
          timeouts.push(t);
        } else {
          const t = setTimeout(() => {
            // Check answer using the exact value to avoid stale closures
            checkAnswer(idx, val);
          }, 2000); // 2 second delay for wrong
          timeouts.push(t);
        }
      }
    });

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, tableNum, statuses]); // checkAnswer omitted intentionally to avoid loops

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer(idx);
    }
    // Up/Down arrows to navigate rows easily
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < 9 && inputRefs.current[idx + 1]) inputRefs.current[idx + 1].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0 && inputRefs.current[idx - 1]) inputRefs.current[idx - 1].focus();
    }
  };

  return (
    <div className="table-practice">
      <div className="tp-list">
        {Array.from({ length: 10 }).map((_, idx) => {
          const multiplier = idx + 1;
          const status = statuses[idx];

          return (
            <div key={multiplier} className={`tp-row ${status}`}>
              <div className="tp-equation">
                <span>{tableNum}</span>
                <span className="tp-op">×</span>
                <span>{multiplier}</span>
                <span className="tp-op">=</span>
              </div>
              
              <input
                ref={el => inputRefs.current[idx] = el}
                type="text"
                className="tp-input"
                value={answers[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onBlur={() => answers[idx] !== '' && checkAnswer(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                disabled={status === 'correct'}
                aria-label={`${tableNum} times ${multiplier} answer`}
              />

              <div className="tp-feedback-icon">
                {status === 'correct' && '✅'}
                {status === 'wrong' && '❌'}
              </div>

            </div>
          );
        })}
      </div>

      {statuses.every(s => s === 'correct') && (
        <div className="tp-completion-backdrop">
          <div className="tp-completion-modal">
            <h3>Great Job! 🎉</h3>
            <p>You have mastered the table of {tableNum}!</p>
            <div className="tp-completion-actions">
              <button 
                className="tp-btn-repeat"
                onClick={() => {
                  setAnswers(Array(10).fill(''));
                  setStatuses(Array(10).fill('idle'));
                  setTimeout(() => inputRefs.current[0]?.focus(), 450);
                }}
              >
                Repeat Again
              </button>
              <button className="tp-btn-back" onClick={onBack}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
