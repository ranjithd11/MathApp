import React, { useState } from 'react';
import { useMultiplication } from '../../../../hooks/useMultiplication';
import OpProblemCard from '../../../ui/OpProblemCard';
import '../addition/AdditionPage.css';

const LEVELS = [
  { id: 'single', label: 'Level 1', title: 'Single Digit', desc: 'Multiply numbers 1 to 9', emoji: '🌱', color: 'teal', example: '6 × 7' },
  { id: 'double', label: 'Level 2', title: 'Double × Single', desc: 'Multiply 11–19 by 2–9', emoji: '🚀', color: 'primary', example: '13 × 4' },
];

export default function MultiplicationPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const { problem, userAnswer, setUserAnswer, status, score, streak, questionIndex, checkAnswer, nextQuestion } =
    useMultiplication(selectedLevel?.id || 'single');

  if (!selectedLevel) {
    return (
      <div className="addition-page mult-page">
        <div className="page-hero">
          <div className="hero-badge">✖️ Multiplication</div>
          <h1 className="hero-title">Choose Your Level</h1>
          <p className="hero-sub">Times tables made fun! 🌟</p>
        </div>
        <div className="level-grid">
          {LEVELS.map((lv) => (
            <div
              key={lv.id}
              className={`level-card color-${lv.color}`}
              onClick={() => setSelectedLevel(lv)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedLevel(lv)}
            >
              <div className="lv-top">
                <span className="lv-emoji">{lv.emoji}</span>
                <span className="lv-badge">{lv.label}</span>
              </div>
              <h2 className="lv-title">{lv.title}</h2>
              <p className="lv-desc">{lv.desc}</p>
              <div className="lv-example">
                <span className="ex-label">Example:</span>
                <span className="ex-val">{lv.example} = ?</span>
              </div>
              <button className={`lv-play-btn color-${lv.color}`}>Play Now! ▶</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="addition-page mult-page">
      <div className="level-header">
        <button className="back-btn" onClick={() => setSelectedLevel(null)}>← Levels</button>
        <div className="level-info">
          <span className="level-chip">{selectedLevel.emoji} {selectedLevel.label}</span>
          <h1 className="level-title-sm">{selectedLevel.title} Multiplication</h1>
        </div>
      </div>
      <OpProblemCard
        problem={problem}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        status={status}
        score={score}
        streak={streak}
        questionIndex={questionIndex}
        checkAnswer={checkAnswer}
        nextQuestion={nextQuestion}
        accentColor="#7c3aed"
      />
    </div>
  );
}
