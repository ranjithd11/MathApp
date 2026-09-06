import React, { useState, useEffect, useRef } from 'react';
import { getSingleEmojiForQuestion } from '../../../../data/animationAssets';
import './AnimationPopup.css';

function runSequence(setters, a, b) {
  const timers = [];
  const t = (fn, delay) => timers.push(setTimeout(fn, delay));
  const staggerA = a * 150;
  const staggerB = b * 150;

  t(() => setters.setPhase('groupA'), 300);
  t(() => setters.setPhase('plus'),   300 + staggerA + 200);
  t(() => setters.setPhase('groupB'), 300 + staggerA + 450);
  // Skip merge — go straight to counting after Group B finishes appearing
  t(() => setters.setPhase('total'),  300 + staggerA + 450 + staggerB + 600);
  return timers;
}

export default function AnimationPopup({ problem, questionIndex, onClose }) {
  const { a, b, answer } = problem;
  const [phase, setPhase]               = useState('idle');
  const [displayCount, setDisplayCount] = useState(0);
  const timersRef = useRef([]);

  const { emoji, label } = getSingleEmojiForQuestion(questionIndex);
  const emojisA = Array.from({ length: a }, () => emoji);
  const emojisB = Array.from({ length: b }, () => emoji);

  const clearTimers = () => timersRef.current.forEach(clearTimeout);

  const startSequence = () => {
    clearTimers();
    timersRef.current = runSequence({ setPhase }, a, b);
  };

  useEffect(() => {
    startSequence();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count-up: 0 → answer, highlighting across A then B
  useEffect(() => {
    if (phase !== 'total') return;
    setDisplayCount(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayCount(current);
      if (current >= answer) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [phase, answer]);

  const handleReplay = () => {
    setPhase('idle');
    setDisplayCount(0);
    setTimeout(startSequence, 100);
  };

  const showGroupA = ['groupA', 'plus', 'groupB', 'total'].includes(phase);
  const showPlus   = ['plus', 'groupB', 'total'].includes(phase);
  const showGroupB = ['groupB', 'total'].includes(phase);
  const isCountingPhase = phase === 'total';
  const isDone          = displayCount >= answer;

  // Which group the counter is currently in
  const countingGroupA = isCountingPhase && displayCount <= a;
  const countingGroupB = isCountingPhase && displayCount > a;

  // Emoji state helpers
  const stateA = (i) => {
    if (!isCountingPhase) return 'ready';           // before counting starts
    if (i < displayCount - 1)  return 'counted';
    if (i === displayCount - 1) return 'counting';
    return 'waiting';
  };
  const stateB = (i) => {
    const globalIdx = a + i;
    if (!isCountingPhase) return 'ready';
    if (globalIdx < displayCount - 1)  return 'counted';
    if (globalIdx === displayCount - 1) return 'counting';
    return 'waiting';
  };

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-container animate-zoom-in" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="popup-header">
          <div className="popup-title">
            <span className="popup-title-icon">✨</span>
            Let me show you how!
          </div>
          <button className="popup-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Equation banner */}
        <div className="popup-equation">
          <span className="eq-num">{a}</span>
          <span className="eq-op">+</span>
          <span className="eq-num">{b}</span>
          <span className="eq-op">=</span>
          <span className={`eq-ans ${isDone ? 'revealed' : 'hidden-ans'}`}>
            {isDone ? answer : '?'}
          </span>
        </div>

        {/* Status label */}
        <p className="popup-label">
          {!isCountingPhase && <>We're counting <strong>{label}</strong>! {emoji}</>}
          {isCountingPhase && countingGroupA && <>Counting <strong>Group A</strong>… {displayCount} of {a}</>}
          {isCountingPhase && countingGroupB && <>Now adding <strong>Group B</strong>… {displayCount} total!</>}
          {isCountingPhase && isDone && <> 🎉 <strong>{answer}</strong> {label} altogether!</>}
        </p>

        {/* Both groups — always separate, never merge */}
        <div className="anim-stage">

          {/* Group A */}
          <div className={`emoji-group ${countingGroupA ? 'group-active' : ''}`}>
            <div className={`group-label ${countingGroupA ? 'label-active-a' : ''}`}>
              {a} {label}
            </div>
            <div className="emoji-row">
              {emojisA.map((em, i) => {
                const s = stateA(i);
                return (
                  <span
                    key={i}
                    className={`anim-emoji state-${s}`}
                    style={{
                      opacity: showGroupA ? 1 : 0,
                      animation: showGroupA && !isCountingPhase
                        ? `bounceIn 0.45s ${i * 150}ms cubic-bezier(0.36,0.07,0.19,0.97) both,
                           bob 2.2s ${i * 150 + 500}ms ease-in-out infinite`
                        : undefined,
                    }}
                  >
                    {em}
                    {s === 'counting' && (
                      <span className="count-badge">{i + 1}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Plus sign */}
          <div className={`anim-plus ${showPlus ? 'visible' : ''}`}>+</div>

          {/* Group B */}
          <div className={`emoji-group ${countingGroupB ? 'group-active' : ''}`}>
            <div className={`group-label ${countingGroupB ? 'label-active-b' : ''}`}>
              {b} {label}
            </div>
            <div className="emoji-row">
              {emojisB.map((em, i) => {
                const s = stateB(i);
                return (
                  <span
                    key={i}
                    className={`anim-emoji state-${s}`}
                    style={{
                      opacity: showGroupB ? 1 : 0,
                      animation: showGroupB && !isCountingPhase
                        ? `bounceIn 0.45s ${i * 150}ms cubic-bezier(0.36,0.07,0.19,0.97) both,
                           bob 2.2s ${i * 150 + 500}ms ease-in-out infinite`
                        : undefined,
                    }}
                  >
                    {em}
                    {s === 'counting' && (
                      <span className="count-badge">{a + i + 1}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Running total counter */}
        {isCountingPhase && (
          <div className="count-total animate-fade-up">
            <span className="count-total-label">Total so far:</span>
            <span className="result-number" key={displayCount}>{displayCount}</span>
            {isDone && (
              <span className="done-label">= {answer}! 🎊</span>
            )}
          </div>
        )}

        {/* Replay */}
        <button className="replay-btn" onClick={handleReplay}>
          🔄 Watch Again
        </button>
      </div>
    </div>
  );
}
