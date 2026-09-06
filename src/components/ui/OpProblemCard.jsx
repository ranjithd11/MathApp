import React, { useEffect, useState, useCallback } from 'react';
import NumberPad from './NumberPad';
import CountdownTimer from './CountdownTimer';
import { useTimer } from '../../hooks/useTimer';
import { useSettings } from '../../context/SettingsContext';
import { playCorrect, playWrong, playClick } from '../../utils/sounds';
import MascotElephant from './MascotElephant';
import './OpProblemCard.css';

/**
 * Generic problem card for Multiplication and Division.
 * No animation popup. Problem displayed as: a  OP  b  =  ?
 * accentColor: CSS color string for the operator highlight
 */
export default function OpProblemCard({
  problem,
  userAnswer,
  setUserAnswer,
  status,
  score,
  streak,
  questionIndex,
  checkAnswer,
  nextQuestion,
  accentColor = 'var(--accent-primary)',
}) {
  const { timerEnabled, soundEnabled } = useSettings();
  const [timedOut, setTimedOut] = useState(false);

  const handleTimeUp = () => {
    if (status === 'idle') { setTimedOut(true); if (soundEnabled) playWrong(); }
  };
  const timer = useTimer(handleTimeUp);

  useEffect(() => {
    setTimedOut(false);
    if (timerEnabled) timer.start(); else timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, timerEnabled]);

  useEffect(() => { if (status !== 'idle') timer.stop(); }, [status]);

  const isAnswerable = status === 'idle' && !timedOut;

  // Auto-submit after 2s if correct
  useEffect(() => {
    let t;
    if (isAnswerable && userAnswer !== '') {
      if (parseInt(userAnswer, 10) === problem.answer) {
        t = setTimeout(() => handleCheck(), 2000);
      }
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, isAnswerable, problem.answer]);

  const handleCheck = () => {
    if (!isAnswerable || userAnswer === '') return;
    timer.stop();
    if (soundEnabled) {
      parseInt(userAnswer, 10) === problem.answer ? playCorrect() : playWrong();
    }
    checkAnswer(userAnswer);
  };

  const handleNext = useCallback(() => {
    setTimedOut(false);
    nextQuestion();
  }, [nextQuestion]);

  // Auto-advance 2s after answer, or click/Enter to dismiss
  useEffect(() => {
    if (status === 'idle') return;
    const handler = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
        if (e.type === 'keydown') e.preventDefault();
        if (e.type === 'click' && e.target.closest('button')) return;
        handleNext();
      }
    };
    const t    = setTimeout(() => { window.addEventListener('click', handler); window.addEventListener('keydown', handler); }, 100);
    const auto = setTimeout(handleNext, 2000);
    return () => {
      clearTimeout(t); clearTimeout(auto);
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [status, handleNext]);

  // Keyboard: digits, backspace, enter
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      if (/^[0-9]$/.test(e.key) && isAnswerable) {
        e.preventDefault(); if (soundEnabled) playClick();
        setUserAnswer(prev => prev.length >= 3 ? prev : prev + e.key);
        return;
      }
      if (e.key === 'Backspace' && isAnswerable) { e.preventDefault(); setUserAnswer(prev => prev.slice(0,-1)); return; }
      if ((e.key === 'Delete' || e.key === 'Escape') && isAnswerable) { e.preventDefault(); setUserAnswer(''); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (isAnswerable && userAnswer !== '') handleCheck();
        else if (!isAnswerable || timedOut) handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswerable, userAnswer, timedOut, status, soundEnabled]);

  return (
    <>
      <div className={`problem-card op-card ${status} ${timedOut ? 'timed-out' : ''}`}
           style={{ '--op-accent': accentColor }}>

        {/* Top bar */}
        <div className="card-top-bar">
          <div className="score-bar">
            {[['⭐', score, 'Score'], ['🔥', streak, 'Streak'], ['📝', `#${questionIndex + 1}`, 'Q']].map(([icon, val, lbl], i, arr) => (
              <React.Fragment key={lbl}>
                <div className="score-item">
                  <span className="score-icon">{icon}</span>
                  <span className="score-val">{val}</span>
                  <span className="score-label">{lbl}</span>
                </div>
                {i < arr.length - 1 && <div className="score-divider" />}
              </React.Fragment>
            ))}
          </div>
          {timerEnabled && (
            <CountdownTimer secondsLeft={timer.secondsLeft} total={timer.total} running={timer.running} />
          )}
        </div>

        {/* Question */}
        <div className="question-area">
          <div className="question-nums">
            <span className="q-num animate-bounce-in" style={{ animationDelay: '0ms' }}>{problem.a}</span>
            <span className="q-op op-accent">{problem.op}</span>
            <span className="q-num animate-bounce-in" style={{ animationDelay: '100ms' }}>{problem.b}</span>
            <span className="q-op">=</span>
            <span className="q-blank">{timedOut ? problem.answer : '?'}</span>
          </div>
        </div>

        {/* NumberPad */}
        <div className="numpad-row">
          <NumberPad value={userAnswer} onChange={setUserAnswer} disabled={!isAnswerable} />
          {isAnswerable ? (
            <button className="side-btn check" onClick={handleCheck} disabled={userAnswer === ''}>
              <span className="side-btn-icon">✅</span>
              <span className="side-btn-label">Check</span>
              <span className="side-btn-hint">Enter ↵</span>
            </button>
          ) : (
            <button className="side-btn next" onClick={handleNext}>
              <span className="side-btn-icon">▶</span>
              <span className="side-btn-label">Next</span>
              <span className="side-btn-hint">Enter ↵</span>
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
          {['⭐','✨','⭐','💫','✨'].map((s,i) => <span key={i} style={{animationDelay:`${i*0.5}s`}}>{s}</span>)}
        </div>
      </div>

      <MascotElephant status={status} timedOut={timedOut} timerRunning={timer.running} />
    </>
  );
}
