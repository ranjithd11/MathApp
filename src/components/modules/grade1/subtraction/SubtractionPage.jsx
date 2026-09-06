import React, { useState } from 'react';
import { useSubtraction } from '../../../../hooks/useSubtraction';
import SubProblemCard from './SubProblemCard';
import DoubleDigitSubCard from './DoubleDigitSubCard';
import BorrowSubCard from './BorrowSubCard';
import './SubtractionPage.css';

const LEVELS = [
  {
    id: 'single',
    label: 'Level 1',
    title: 'Single Digit',
    desc: 'Subtract numbers from 1 to 9',
    emoji: '🌱',
    color: 'teal',
    example: '9 − 4',
  },
  {
    id: 'double-no-borrow',
    label: 'Level 2',
    title: 'Double Digit',
    desc: 'No borrowing needed (ones ≥ ones)',
    emoji: '🚀',
    color: 'primary',
    example: '57 − 23',
  },
  {
    id: 'double-borrow',
    label: 'Level 3',
    title: 'Double Digit + Borrow',
    desc: 'Borrow from the tens column!',
    emoji: '🔥',
    color: 'purple',
    example: '53 − 28',
  },
];

export default function SubtractionPage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [level1Best, setLevel1Best] = useState(
    () => parseInt(localStorage.getItem('mathapp-sub-l1-best') || '0', 10)
  );

  const {
    problem, userAnswer, setUserAnswer,
    status, score, streak, questionIndex,
    checkAnswer, nextQuestion, showPopup, setShowPopup,
  } = useSubtraction(selectedLevel?.id || 'single');

  const handleNextQuestion = () => {
    if (selectedLevel?.id === 'single' && score > level1Best) {
      const nb = score;
      setLevel1Best(nb);
      localStorage.setItem('mathapp-sub-l1-best', String(nb));
    }
    nextQuestion();
  };

  const level2Unlocked = true;

  if (!selectedLevel) {
    return (
      <div className="addition-page sub-page">
        <div className="page-hero">
          <div className="hero-badge">➖ Subtraction</div>
          <h1 className="hero-title">Choose Your Level</h1>
          <p className="hero-sub">Master taking away! 🌟</p>
        </div>

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
                      <div className="unlock-fill"
                        style={{ width: `${Math.min(100, (level1Best / LEVELS[1].requiresScore) * 100)}%` }}
                      />
                    </div>
                    <span className="unlock-count">{level1Best} / {LEVELS[1].requiresScore}</span>
                  </div>
                )}

                {!isLocked && (
                  <button className={`lv-play-btn color-${lv.color}`}>Play Now! ▶</button>
                )}

                {idx === 0 && level1Best > 0 && (
                  <div className="best-score-badge">🏆 Best: {level1Best}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="addition-page sub-page">
      <div className="level-header">
        <button className="back-btn" onClick={() => setSelectedLevel(null)}>← Levels</button>
        <div className="level-info">
          <span className="level-chip">{selectedLevel.emoji} {selectedLevel.label}</span>
          <h1 className="level-title-sm">{selectedLevel.title} Subtraction</h1>
        </div>
      </div>

      {selectedLevel.id === 'double-borrow' ? (
        <BorrowSubCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          status={status}
          score={score}
          streak={streak}
          questionIndex={questionIndex}
          checkAnswer={checkAnswer}
          nextQuestion={handleNextQuestion}
        />
      ) : selectedLevel.id === 'double-no-borrow' ? (
        <DoubleDigitSubCard
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          status={status}
          score={score}
          streak={streak}
          questionIndex={questionIndex}
          checkAnswer={checkAnswer}
          nextQuestion={handleNextQuestion}
        />
      ) : (
        <SubProblemCard
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
