import React, { useEffect, useState, useCallback } from 'react';
import { FiInfo } from 'react-icons/fi';
import NumberPad from '../../../ui/NumberPad';
import CountdownTimer from '../../../ui/CountdownTimer';
import AnimationPopup from './AnimationPopup';
import { useTimer } from '../../../../hooks/useTimer';
import { useSettings } from '../../../../context/SettingsContext';
import { playCorrect, playWrong, playClick } from '../../../../utils/sounds';
import MascotElephant from '../../../ui/MascotElephant';
import './ProblemCard.css';

export default function ProblemCard({
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

  const handleTimeUp = () => {
    if (status === 'idle') {
      setTimedOut(true);
      if (soundEnabled) playWrong();
    }
  };

  const timer = useTimer(handleTimeUp);

  // Start/reset timer on new question
  useEffect(() => {
    setTimedOut(false);
    if (timerEnabled) timer.start();
    else timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, timerEnabled]);

  // Stop timer when answered
  useEffect(() => {
    if (status !== 'idle') timer.stop();
  }, [status]);

  const isAnswerable = status === 'idle' && !timedOut;

  // Auto-submit after 2 seconds if full answer is correct
  useEffect(() => {
    let t;
    if (isAnswerable && userAnswer !== '') {
      const parsed = parseInt(userAnswer, 10);
      if (parsed === problem.answer) {
        t = setTimeout(() => {
          handleCheck();
        }, 2000);
      }
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, isAnswerable, problem.answer]);

  const handleCheck = () => {
    if (!isAnswerable || userAnswer === '') return;
    timer.stop();
    if (soundEnabled) {
      const parsed = parseInt(userAnswer, 10);
      if (parsed === problem.answer) playCorrect();
      else playWrong();
    }
    checkAnswer(userAnswer);
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

  // ── Full keyboard input: digits, Backspace, Delete, Enter ──
  useEffect(() => {
    const onKey = (e) => {
      // Let browser handle if focus is inside an input/button (shouldn't happen, but safety)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Digit entry
      if (/^[0-9]$/.test(e.key) && isAnswerable) {
        e.preventDefault();
        if (soundEnabled) playClick();
        setUserAnswer(prev => {
          if (prev.length >= 3) return prev;
          return prev + e.key;
        });
        return;
      }

      // Backspace — remove last digit
      if (e.key === 'Backspace' && isAnswerable) {
        e.preventDefault();
        setUserAnswer(prev => prev.slice(0, -1));
        return;
      }

      // Delete / Escape — clear all
      if ((e.key === 'Delete' || e.key === 'Escape') && isAnswerable) {
        e.preventDefault();
        setUserAnswer('');
        return;
      }

      // Enter — Check or Next
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
      <div className={`problem-card ${status} ${timedOut ? 'timed-out' : ''}`}>

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

        {/* Question display */}
        <div className="question-area">
          <div className="question-nums">
            <span className="q-num animate-bounce-in" style={{ animationDelay: '0ms' }}>
              {problem.a}
            </span>
            <span className="q-op">+</span>
            <span className="q-num animate-bounce-in" style={{ animationDelay: '100ms' }}>
              {problem.b}
            </span>
            <span className="q-op">=</span>
            <span className="q-blank">{timedOut ? problem.answer : '?'}</span>
          </div>

          <button
            className="info-btn"
            onClick={() => setShowPopup(true)}
            aria-label="Show animated explanation"
            title="Show me how! ✨"
          >
            <FiInfo size={16} />
            <span>Show Me!</span>
          </button>
        </div>

        {/* Floating NumberPad */}
        <NumberPad
          value={userAnswer}
          onChange={setUserAnswer}
          disabled={!isAnswerable}
          actionButton={
            isAnswerable ? (
              <button
                className="np-action-btn check"
                onClick={handleCheck}
                disabled={userAnswer === ''}
                aria-label="Check answer"
              >
                ✅ Check
              </button>
            ) : (
              <button
                className="np-action-btn next"
                onClick={handleNext}
                aria-label="Next question"
              >
                ▶ Next
              </button>
            )
          }
        />

        {/* Feedback */}
        {status === 'correct' && (
          <div className="feedback correct animate-bounce-in">
            <span className="fb-emoji">🎉</span>
            <div className="fb-text">
              <strong>Correct!</strong>
              <span>Amazing job! Keep it up!</span>
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

        {/* Decorative stars */}
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

      {/* Baby Elephant Mascot */}
      <MascotElephant
        status={status}
        timedOut={timedOut}
        timerRunning={timer.running}
      />
    </>
  );
}
