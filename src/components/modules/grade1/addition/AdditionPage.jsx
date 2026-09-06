import React, { useState } from 'react';
import { useAddition } from '../../../../hooks/useAddition';
import ProblemCard from './ProblemCard';
import DoubleDigitProblemCard from './DoubleDigitProblemCard';
import './AdditionPage.css';

const LEVELS = [
  {
    id: 'single',
    label: 'Level 1',
    title: 'Single Digit',
    desc: 'Add numbers from 1 to 9',
    emoji: '🌱',
    color: 'teal',
    maxScore: 10,
    example: '3 + 5',
  },
  {
    id: 'double',
    label: 'Level 2',
    title: 'Double Digit',
    desc: 'Add numbers from 10 to 49',
    emoji: '🚀',
    color: 'primary',
    maxScore: 10,
    example: '24 + 13',
    requiresScore: 5, // need 5/10 on level 1 to unlock
  },
];

export default function AdditionPage() {
  const [selectedLevel, setSelectedLevel] = useState(null); // null = level select screen
  const [level1BestScore, setLevel1BestScore] = useState(
    () => parseInt(localStorage.getItem('mathapp-l1-best') || '0', 10)
  );

  const {
    problem, userAnswer, setUserAnswer,
    status, score, streak, questionIndex,
    checkAnswer, nextQuestion, showPopup, setShowPopup,
  } = useAddition(selectedLevel?.id || 'single');

  // Track best score for level 1 (for unlock logic)
  const handleNextQuestion = () => {
    if (selectedLevel?.id === 'single' && score > level1BestScore) {
      const newBest = score;
      setLevel1BestScore(newBest);
      localStorage.setItem('mathapp-l1-best', String(newBest));
    }
    nextQuestion();
  };

  const level2Unlocked = level1BestScore >= (LEVELS[1].requiresScore || 0);

  if (!selectedLevel) {
    return (
      <div className="addition-page">
        {/* Page header */}
        <div className="page-hero">
          <div className="hero-badge">➕ Addition</div>
          <h1 className="hero-title">Choose Your Level</h1>
          <p className="hero-sub">Start with Level 1 and work your way up! 🌟</p>
        </div>

        {/* Level cards */}
        <div className="level-grid">
          {LEVELS.map((lv, idx) => {
            const isLocked = idx > 0 && !level2Unlocked;
            return (
              <div
                key={lv.id}
                className={`level-card color-${lv.color} ${isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && setSelectedLevel(lv)}
                role={isLocked ? 'presentation' : 'button'}
                tabIndex={isLocked ? -1 : 0}
                onKeyDown={e => e.key === 'Enter' && !isLocked && setSelectedLevel(lv)}
                aria-disabled={isLocked}
                aria-label={`${lv.title} - ${isLocked ? 'Locked' : 'Play'}`}
              >
                <div className="lv-top">
                  <span className="lv-emoji">{isLocked ? '🔒' : lv.emoji}</span>
                  <span className="lv-badge">{lv.label}</span>
                </div>
                <h2 className="lv-title">{lv.title}</h2>
                <p className="lv-desc">{lv.desc}</p>
                <div className="lv-example">
                  <span className="ex-label">Example:</span>
                  <span className="ex-val">{lv.example} = ?</span>
                </div>

                {isLocked && (
                  <div className="lv-unlock-hint">
                    Score {LEVELS[1].requiresScore}+ on Level 1 to unlock!
                    <div className="unlock-progress">
                      <div
                        className="unlock-fill"
                        style={{ width: `${Math.min(100, (level1BestScore / LEVELS[1].requiresScore) * 100)}%` }}
                      />
                    </div>
                    <span className="unlock-count">{level1BestScore} / {LEVELS[1].requiresScore}</span>
                  </div>
                )}

                {!isLocked && (
                  <button className={`lv-play-btn color-${lv.color}`}>
                    Play Now! ▶
                  </button>
                )}

                {/* Best score badge for L1 */}
                {idx === 0 && level1BestScore > 0 && (
                  <div className="best-score-badge">🏆 Best: {level1BestScore}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Game screen ───
  return (
    <div className="addition-page">
      {/* Level header */}
      <div className="level-header">
        <button className="back-btn" onClick={() => setSelectedLevel(null)}>
          ← Levels
        </button>
        <div className="level-info">
          <span className="level-chip">{selectedLevel.emoji} {selectedLevel.label}</span>
          <h1 className="level-title-sm">{selectedLevel.title} Addition</h1>
        </div>
      </div>

      {selectedLevel.id === 'double' ? (
        <DoubleDigitProblemCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          status={status}
          score={score}
          streak={streak}
          questionIndex={questionIndex}
          checkAnswer={checkAnswer}
          nextQuestion={handleNextQuestion}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      ) : (
        <ProblemCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          status={status}
          score={score}
          streak={streak}
          questionIndex={questionIndex}
          checkAnswer={checkAnswer}
          nextQuestion={handleNextQuestion}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
}
