import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiInfo } from 'react-icons/fi';
import CountdownTimer from '../../../ui/CountdownTimer';
import { useTimer } from '../../../../hooks/useTimer';
import { useSettings } from '../../../../context/SettingsContext';
import { playCorrect, playWrong, playClick } from '../../../../utils/sounds';
import MascotElephant from '../../../ui/MascotElephant';
import './DoubleDigitSubCard.css';

export default function DoubleDigitSubCard({
  problem,
  userAnswer,
  setUserAnswer,
  status,
  score,
  streak,
  questionIndex,
  checkAnswer,
  nextQuestion,
}) {
  const { timerEnabled, soundEnabled } = useSettings();
  const [timedOut, setTimedOut] = useState(false);

  const [onesInput, setOnesInput] = useState('');
  const [tensInput, setTensInput] = useState('');
  const [borrowInput, setBorrowInput] = useState('');

  const borrowRef = useRef(null);
  const tensRef   = useRef(null);
  const onesRef   = useRef(null);

  const handleTimeUp = () => {
    if (status === 'idle') {
      setTimedOut(true);
      if (soundEnabled) playWrong();
    }
  };

  const timer = useTimer(handleTimeUp);

  useEffect(() => {
    setOnesInput(''); setTensInput(''); setBorrowInput('');
    setTimedOut(false);
    if (timerEnabled) timer.start(); else timer.stop();
    setTimeout(() => onesRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, timerEnabled]);

  useEffect(() => {
    if (status !== 'idle') timer.stop();
  }, [status]);

  const isAnswerable = status === 'idle' && !timedOut;

  /* ── Math logic ── */
  const onesA    = problem.a % 10;
  const onesB    = problem.b % 10;
  const needsBorrow = onesA < onesB;
  const effOnesA = needsBorrow ? onesA + 10 : onesA;
  const expectedOnes   = effOnesA - onesB;
  const expectedBorrow = needsBorrow ? 1 : 0;
  const tensA    = Math.floor(problem.a / 10) - expectedBorrow;
  const tensB    = Math.floor(problem.b / 10);
  const expectedTens   = tensA - tensB;

  const onesCorrect  = onesInput  !== '' && parseInt(onesInput, 10)  === expectedOnes;
  const onesWrong    = onesInput  !== '' && parseInt(onesInput, 10)  !== expectedOnes;
  const borrowCorrect= (borrowInput === '' && expectedBorrow === 0) ||
                       (borrowInput !== '' && parseInt(borrowInput, 10) === expectedBorrow);
  const borrowWrong  = borrowInput !== '' && parseInt(borrowInput, 10) !== expectedBorrow;

  /* ── Auto-submit when full answer correct ── */
  useEffect(() => {
    let t;
    if (isAnswerable && onesInput !== '' && tensInput !== '') {
      const finalAnswer = (tensInput || '0') + (onesInput || '0');
      if (parseInt(finalAnswer, 10) === problem.answer) {
        t = setTimeout(() => executeCheck(finalAnswer), 2000);
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
      if (parsed === problem.answer) playCorrect(); else playWrong();
    }
    checkAnswer(answerString);
  };

  const handleCheck = () => {
    if (!isAnswerable) return;
    executeCheck((tensInput || '0') + (onesInput || '0'));
  };

  const handleNext = useCallback(() => {
    setTimedOut(false);
    nextQuestion();
  }, [nextQuestion]);

  /* ── Auto-advance after celebration ── */
  useEffect(() => {
    if (status === 'idle') return;
    const handleGlobalAction = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
        if (e.type === 'keydown') e.preventDefault();
        if (e.type === 'click' && e.target.closest('button')) return;
        handleNext();
      }
    };
    const t    = setTimeout(() => {
      window.addEventListener('click', handleGlobalAction);
      window.addEventListener('keydown', handleGlobalAction);
    }, 100);
    const auto = setTimeout(handleNext, 2000);
    return () => {
      clearTimeout(t); clearTimeout(auto);
      window.removeEventListener('click', handleGlobalAction);
      window.removeEventListener('keydown', handleGlobalAction);
    };
  }, [status, handleNext]);

  /* ── Input handlers ── */
  const onOnesChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setOnesInput(val);
    if (soundEnabled && val) playClick();
    if (val !== '' && parseInt(val, 10) === expectedOnes) {
      if (needsBorrow) borrowRef.current?.focus();
      else tensRef.current?.focus();
    }
  };

  const onBorrowChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setBorrowInput(val);
    if (soundEnabled && val) playClick();
    if (val !== '' && parseInt(val, 10) === expectedBorrow) tensRef.current?.focus();
  };

  const onTensChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setTensInput(val);
    if (soundEnabled && val) playClick();
  };

  const onKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isAnswerable) handleCheck(); else handleNext();
    }
    if (e.key === 'Backspace' && e.target.value === '') {
      if (field === 'tens') {
        if (needsBorrow) borrowRef.current?.focus(); else onesRef.current?.focus();
      } else if (field === 'borrow') {
        onesRef.current?.focus();
      }
    }
  };

  return (
    <>
      <div className={`problem-card vertical-card ddsub-card ${status} ${timedOut ? 'timed-out' : ''}`}>

        {/* Top bar */}
        <div className="card-top-bar">
          <div className="score-bar">
            {[['⭐', score, 'Score'], ['🔥', streak, 'Streak'], ['📝', `#${questionIndex + 1}`, 'Q']].map(([icon, val, lbl]) => (
              <React.Fragment key={lbl}>
                <div className="score-item">
                  <span className="score-icon">{icon}</span>
                  <span className="score-val">{val}</span>
                  <span className="score-label">{lbl}</span>
                </div>
                {lbl !== 'Q' && <div className="score-divider" />}
              </React.Fragment>
            ))}
          </div>
          {timerEnabled && (
            <CountdownTimer secondsLeft={timer.secondsLeft} total={timer.total} running={timer.running} />
          )}
        </div>

        {/* Vertical subtraction layout */}
        <div className="vertical-math-area">
          <div className="math-grid">
            {/* Borrow row */}
            <div className="mg-cell ddsub-borrow-cell">
              {needsBorrow ? (
                <input
                  ref={borrowRef}
                  type="text"
                  className={`mg-input carry-input ${borrowCorrect && borrowInput !== '' ? 'correct' : ''} ${borrowWrong ? 'wrong' : ''}`}
                  value={borrowInput}
                  onChange={onBorrowChange}
                  onKeyDown={(e) => onKeyDown(e, 'borrow')}
                  disabled={!isAnswerable}
                  placeholder="b"
                  aria-label="Borrow digit"
                />
              ) : (
                <div className="ddsub-no-borrow" />
              )}
            </div>

            {/* Top number */}
            <div className="mg-row">
              <div className="mg-cell op-cell"></div>
              <div className="mg-cell digit-cell">{Math.floor(problem.a / 10) || ''}</div>
              <div className="mg-cell digit-cell">{problem.a % 10}</div>
            </div>

            {/* Bottom number */}
            <div className="mg-row">
              <div className="mg-cell op-cell">−</div>
              <div className="mg-cell digit-cell">{Math.floor(problem.b / 10) || ''}</div>
              <div className="mg-cell digit-cell">{problem.b % 10}</div>
            </div>

            <div className="mg-divider"></div>

            {/* Answer row */}
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

          {needsBorrow && (
            <div className="ddsub-borrow-hint">
              💡 <em>Borrow from the tens column!</em>
            </div>
          )}
        </div>

        {/* Actions */}
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
            <button className="side-btn next full-width" onClick={handleNext}>
              <span className="side-btn-icon">▶</span>
              <span className="side-btn-label">Next Question</span>
            </button>
          )}
        </div>

        {/* Feedback */}
        {status === 'correct' && (
          <div className="feedback correct animate-bounce-in">
            <span className="fb-emoji">🎉</span>
            <div className="fb-text"><strong>Correct!</strong><span>Amazing!</span></div>
          </div>
        )}
        {(status === 'wrong' || timedOut) && (
          <div className="feedback wrong animate-shake">
            <span className="fb-emoji">{timedOut ? '⌛' : '😅'}</span>
            <div className="fb-text">
              <strong>{timedOut ? "Time's Up!" : 'Not quite!'}</strong>
              <span>Answer: <strong className="correct-ans">{problem.answer}</strong></span>
            </div>
          </div>
        )}

        <div className="card-stars" aria-hidden="true">
          {['⭐', '✨', '⭐', '💫', '✨'].map((s, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.5}s` }}>{s}</span>
          ))}
        </div>
      </div>

      <MascotElephant status={status} timedOut={timedOut} timerRunning={timer.running} />
    </>
  );
}
