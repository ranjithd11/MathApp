import React, { useState } from 'react';
import { useDivision } from '../../../../hooks/useDivision';
import OpProblemCard from '../../../ui/OpProblemCard';
import '../addition/AdditionPage.css';

const LEVELS = [
  { id: 'simple', label: 'Level 1', title: 'Simple Division', desc: 'Answer is 1 to 9', emoji: '🌱', color: 'teal', example: '18 ÷ 3' },
  { id: 'larger', label: 'Level 2', title: 'Larger Division', desc: 'Answer is 10 to 12', emoji: '🚀', color: 'primary', example: '84 ÷ 7' },
];

export default function DivisionPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const { problem, userAnswer, setUserAnswer, status, score, streak, questionIndex, checkAnswer, nextQuestion } =
    useDivision(selectedLevel?.id || 'simple');

  if (!selectedLevel) {
    return (
      <div className="addition-page div-page">
        <div className="page-hero">
          <div className="hero-badge">➗ Division</div>
          <h1 className="hero-title">Choose Your Level</h1>
          <p className="hero-sub">Sharing made easy! 🌟</p>
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
    <div className="addition-page div-page">
      <div className="level-header">
        <button className="back-btn" onClick={() => setSelectedLevel(null)}>← Levels</button>
        <div className="level-info">
          <span className="level-chip">{selectedLevel.emoji} {selectedLevel.label}</span>
          <h1 className="level-title-sm">{selectedLevel.title} Division</h1>
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
        accentColor="#f59e0b"
      />
    </div>
  );
}
