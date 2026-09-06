import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiInfo } from 'react-icons/fi';
import CountdownTimer from '../../../ui/CountdownTimer';
import AnimationPopup from './AnimationPopup';
import { useTimer } from '../../../../hooks/useTimer';
import { useSettings } from '../../../../context/SettingsContext';
import { playCorrect, playWrong, playClick } from '../../../../utils/sounds';
import MascotElephant from '../../../ui/MascotElephant';
import './DoubleDigitProblemCard.css';

export default function DoubleDigitProblemCard({
  problem,
  userAnswer,
  setUserAnswer,
  status,
  score,
  streak,
  questionIndex,
  checkAnswer,
  nextQuestion,
  showPopup,
  setShowPopup,
}) {
  const { timerEnabled, soundEnabled } = useSettings();
  const [timedOut, setTimedOut] = useState(false);

  // Local state for individual boxes
  const [onesInput, setOnesInput] = useState('');
  const [tensInput, setTensInput] = useState('');
  const [carryInput, setCarryInput] = useState('');

  const carryRef = useRef(null);
  const tensRef = useRef(null);
  const onesRef = useRef(null);

  const handleTimeUp = () => {
    if (status === 'idle') {
      setTimedOut(true);
      if (soundEnabled) playWrong();
    }
  };

  const timer = useTimer(handleTimeUp);

  // Reset inputs on new question
  useEffect(() => {
    setOnesInput('');
    setTensInput('');
    setCarryInput('');
    setTimedOut(false);
    if (timerEnabled) timer.start();
    else timer.stop();
    // Auto-focus ones digit
    setTimeout(() => onesRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, timerEnabled]);

  useEffect(() => {
    if (status !== 'idle') timer.stop();
  }, [status]);

  const isAnswerable = status === 'idle' && !timedOut;

  // Math Logic
  const onesA = problem.a % 10;
  const onesB = problem.b % 10;
  const onesSum = onesA + onesB;
  const expectedOnes = onesSum % 10;
  const expectedCarry = Math.floor(onesSum / 10);
  
  const onesCorrect = onesInput !== '' && parseInt(onesInput, 10) === expectedOnes;
  const onesWrong = onesInput !== '' && parseInt(onesInput, 10) !== expectedOnes;
  
  const carryCorrect = (carryInput === '' && expectedCarry === 0) || (carryInput !== '' && parseInt(carryInput, 10) === expectedCarry);
  const carryWrong = carryInput !== '' && parseInt(carryInput, 10) !== expectedCarry;

  // Auto-submit after 2 seconds if full answer is correct
  useEffect(() => {
    let t;
    if (isAnswerable && onesInput !== '' && tensInput !== '') {
      const finalAnswer = (tensInput || '0') + (onesInput || '0');
      const parsed = parseInt(finalAnswer, 10);
      if (parsed === problem.answer) {
        t = setTimeout(() => {
          // Pass the exact string to avoid stale closures
          executeCheck(finalAnswer);
        }, 2000);
      }
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onesInput, tensInput, isAnswerable, problem.answer]);

  const executeCheck = (answerString) => {
    if (!isAnswerable) return;
    setUserAnswer(answerString);
    timer.stop();
    const parsed = parseInt(answerString, 10);
    if (soundEnabled) {
      if (parsed === problem.answer) playCorrect();
      else playWrong();
    }
    checkAnswer(answerString);
  };

  const handleCheck = () => {
    if (!isAnswerable) return;
    const finalAnswer = (tensInput || '0') + (onesInput || '0');
    executeCheck(finalAnswer);
  };

  const handleNext = useCallback(() => {
    setTimedOut(false);
    nextQuestion();
  }, [nextQuestion]);

  // Global action to advance on click or Enter when answered
  useEffect(() => {
    if (status === 'idle') return;

    const handleGlobalAction = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
        if (e.type === 'keydown') e.preventDefault();
        
        // Let the explicit Next button handle its own click
        if (e.type === 'click' && e.target.closest('button')) return;

        handleNext();
      }
    };

    // Add a slight delay to avoid triggering instantly on the Enter keydown that submitted the answer
    const t = setTimeout(() => {
      window.addEventListener('click', handleGlobalAction);
      window.addEventListener('keydown', handleGlobalAction);
    }, 100);

    // Also auto-advance after 2 seconds of celebration
    const autoAdvanceTimer = setTimeout(() => {
      handleNext();
    }, 2000);

    return () => {
      clearTimeout(t);
      clearTimeout(autoAdvanceTimer);
      window.removeEventListener('click', handleGlobalAction);
      window.removeEventListener('keydown', handleGlobalAction);
    };
  }, [status, handleNext]);

  // Input handlers
  const onOnesChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1); // only 1 digit
    setOnesInput(val);
    if (soundEnabled && val) playClick();

    if (val !== '') {
      const parsed = parseInt(val, 10);
      if (parsed === expectedOnes) {
        if (expectedCarry > 0) {
          carryRef.current?.focus();
        } else {
          tensRef.current?.focus();
        }
      }
    }
  };

  const onCarryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setCarryInput(val);
    if (soundEnabled && val) playClick();

    if (val !== '') {
      const parsed = parseInt(val, 10);
      if (parsed === expectedCarry) {
        tensRef.current?.focus();
      }
    }
  };

  const onTensChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setTensInput(val);
    if (soundEnabled && val) playClick();
  };

  const onKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isAnswerable) handleCheck();
      else handleNext();
    }
    if (e.key === 'Backspace' && e.target.value === '') {
      // Navigate backwards on backspace if empty
      if (field === 'tens') {
        if (expectedCarry > 0) carryRef.current?.focus();
        else onesRef.current?.focus();
      } else if (field === 'carry') {
        onesRef.current?.focus();
      }
    }
  };

  return (
    <>
      <div className={`problem-card vertical-card ${status} ${timedOut ? 'timed-out' : ''}`}>
        
        {/* Top bar: score + timer */}
        <div className="card-top-bar">
          <div className="score-bar">
            <div className="score-item">
              <span className="score-icon">⭐</span>
              <span className="score-val">{score}</span>
              <span className="score-label">Score</span>
            </div>
            <div className="score-divider" />
            <div className="score-item">
              <span className="score-icon">🔥</span>
              <span className="score-val">{streak}</span>
              <span className="score-label">Streak</span>
            </div>
            <div className="score-divider" />
            <div className="score-item">
              <span className="score-icon">📝</span>
              <span className="score-val">#{questionIndex + 1}</span>
              <span className="score-label">Q</span>
            </div>
          </div>

          {timerEnabled && (
            <CountdownTimer
              secondsLeft={timer.secondsLeft}
              total={timer.total}
              running={timer.running}
            />
          )}
        </div>

        {/* Vertical Math Area */}
        <div className="vertical-math-area">
          <button
            className="info-btn-vertical"
            onClick={() => setShowPopup(true)}
            aria-label="Show animated explanation"
            title="Show me how! ✨"
          >
            <FiInfo size={20} />
          </button>

          <div className="math-grid">
            {/* Carry Row */}
            <div className="mg-cell carry-cell">
              <input
                ref={carryRef}
                type="text"
                className={`mg-input carry-input ${carryCorrect && carryInput !== '' ? 'correct' : ''} ${carryWrong ? 'wrong' : ''}`}
                value={carryInput}
                onChange={onCarryChange}
                onKeyDown={(e) => onKeyDown(e, 'carry')}
                disabled={!isAnswerable}
                placeholder="0"
                aria-label="Carry over"
              />
            </div>
            
            {/* Top Number */}
            <div className="mg-row">
              <div className="mg-cell op-cell"></div>
              <div className="mg-cell digit-cell">{Math.floor(problem.a / 10) || ''}</div>
              <div className="mg-cell digit-cell">{problem.a % 10}</div>
            </div>

            {/* Bottom Number */}
            <div className="mg-row">
              <div className="mg-cell op-cell">+</div>
              <div className="mg-cell digit-cell">{Math.floor(problem.b / 10) || ''}</div>
              <div className="mg-cell digit-cell">{problem.b % 10}</div>
            </div>

            {/* Divider */}
            <div className="mg-divider"></div>

            {/* Answer Row */}
            <div className="mg-row answer-row">
              <div className="mg-cell op-cell"></div>
              <div className="mg-cell">
                <input
                  ref={tensRef}
                  type="text"
                  className="mg-input ans-input"
                  value={tensInput}
                  onChange={onTensChange}
                  onKeyDown={(e) => onKeyDown(e, 'tens')}
                  disabled={!isAnswerable}
                  aria-label="Tens digit answer"
                />
              </div>
              <div className="mg-cell">
                <input
                  ref={onesRef}
                  type="text"
                  className={`mg-input ans-input ${onesCorrect ? 'correct' : ''} ${onesWrong ? 'wrong' : ''}`}
                  value={onesInput}
                  onChange={onOnesChange}
                  onKeyDown={(e) => onKeyDown(e, 'ones')}
                  disabled={!isAnswerable}
                  aria-label="Ones digit answer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="vertical-actions">
          {isAnswerable ? (
            <button
              className="side-btn check full-width"
              onClick={handleCheck}
              disabled={onesInput === '' || tensInput === ''}
            >
              <span className="side-btn-icon">✅</span>
              <span className="side-btn-label">Check Answer</span>
            </button>
          ) : (
            <button
              className="side-btn next full-width"
              onClick={handleNext}
            >
              <span className="side-btn-icon">▶</span>
              <span className="side-btn-label">Next Question</span>
            </button>
          )}
        </div>

        {/* Feedback */}
        {status === 'correct' && (
          <div className="feedback correct animate-bounce-in">
            <span className="fb-emoji">🎉</span>
            <div className="fb-text">
              <strong>Correct!</strong>
              <span>Amazing job!</span>
            </div>
          </div>
        )}
        {(status === 'wrong' || timedOut) && (
          <div className="feedback wrong animate-shake">
            <span className="fb-emoji">{timedOut ? '⌛' : '😅'}</span>
            <div className="fb-text">
              <strong>{timedOut ? "Time's Up!" : 'Not quite!'}</strong>
              <span>The answer is <strong className="correct-ans">{problem.answer}</strong></span>
            </div>
          </div>
        )}

        <div className="card-stars" aria-hidden="true">
          {['⭐','✨','⭐','💫','✨'].map((s, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.5}s` }}>{s}</span>
          ))}
        </div>
      </div>

      {showPopup && (
        <AnimationPopup
          problem={problem}
          questionIndex={questionIndex}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Baby Mascot */}
      <MascotElephant
        status={status}
        timedOut={timedOut}
        timerRunning={timer.running}
      />
    </>
  );
}
