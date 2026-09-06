import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiArrowRight, FiZap } from 'react-icons/fi';
import './TableAnimationPopup.css';

export default function TableAnimationPopup({ tableNum, onClose }) {
  const [currentRow, setCurrentRow] = useState(1);
  const [step, setStep] = useState(0);
  const [revealAll, setRevealAll] = useState(false);

  const eqScrollRef = useRef(null);
  const blocksScrollRef = useRef(null);

  // Step 0: Shows tableNum
  // Step 1: Show '×'
  // Step 2: Show currentRow multiplier & WAIT for Enter
  // Step 3: Show '= answer' & trigger block animation

  useEffect(() => {
    // If reveal all is active, skip this animation
    if (revealAll) return;
    // Reset step whenever currentRow changes
    setStep(0);
    let t1, t2;

    // Start sequence for current row (0.5 second delays) up to step 2
    t1 = setTimeout(() => setStep(1), 50);
    t2 = setTimeout(() => setStep(2), 50);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentRow, revealAll]);

  // Auto-advance to next row after showing answer
  useEffect(() => {
    let t;
    if (!revealAll && step === 3 && currentRow < 10) {
      t = setTimeout(() => {
        setCurrentRow(prev => prev + 1);
      }, 1000);
    }
    return () => clearTimeout(t);
  }, [step, currentRow, revealAll]);

  const handleRevealAll = () => {
    setRevealAll(true);
    setCurrentRow(10);
    setStep(3);
  };

  // Auto-scroll to bottom of lists when currentRow changes or step updates
  useEffect(() => {
    if (eqScrollRef.current) {
      eqScrollRef.current.scrollTop = eqScrollRef.current.scrollHeight;
    }
    if (blocksScrollRef.current) {
      blocksScrollRef.current.scrollTop = blocksScrollRef.current.scrollHeight;
    }
  }, [currentRow, step]);

  // Global keydown to advance step or row
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift+Enter = Reveal All
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        handleRevealAll();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (step === 2) {
          setStep(3); // Reveal answer
        } else if (step === 3 && currentRow < 10) {
          setCurrentRow(prev => prev + 1); // Skip wait and go next
        } else if ((step === 3 && currentRow === 10) || revealAll) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentRow, onClose, revealAll]);

  const answer = tableNum * currentRow;
  const isDone = step >= 3;

  // When revealAll, treat every row as fully visible
  const isRevealed = (idx) => revealAll || idx < currentRow - 1;

  return (
    <div className="table-anim-backdrop">
      <div className="table-anim-modal" role="dialog" aria-modal="true">
        <button className="ta-close-btn" onClick={onClose} aria-label="Close animation">
          <FiX size={24} />
        </button>

        <div className="ta-header">
          <h3 className="ta-title">Table of {tableNum}</h3>
          <p className="ta-subtitle">
            {revealAll
              ? 'Showing all rows! Press Enter to close.'
              : step === 2 ? 'Press Enter to reveal answer!'
                : step === 3 && currentRow < 10 ? 'Auto-advancing to next...'
                  : 'Watch how it adds up!'}
          </p>
        </div>

        <div className="ta-content">

          {/* LEFT: Equation Sequence List */}
          <div className="ta-equation-area" ref={eqScrollRef}>
            {Array.from({ length: revealAll ? 10 : currentRow }).map((_, idx) => {
              const rowMult = idx + 1;
              const rowAns = tableNum * rowMult;
              const isCurrentAnimatingRow = !revealAll && idx === currentRow - 1;

              // Past rows or revealAll => all parts visible
              const s0 = isCurrentAnimatingRow ? step >= 0 : true;
              const s1 = isCurrentAnimatingRow ? step >= 1 : true;
              const s2 = isCurrentAnimatingRow ? step >= 2 : true;
              const s3 = isCurrentAnimatingRow ? step >= 3 : true;

              return (
                <div key={idx} className="ta-eq-row">
                  <div className={`ta-part ta-num1 ${s0 ? 'visible' : ''}`}>
                    {tableNum}
                  </div>
                  <div className={`ta-part ta-op ${s1 ? 'visible' : ''}`}>
                    ×
                  </div>
                  <div className={`ta-part ta-num2 ${s2 ? 'visible' : ''}`}>
                    {rowMult}
                  </div>
                  <div className={`ta-part ta-ans ${s3 ? (isCurrentAnimatingRow ? 'visible bounce' : 'visible') : ''}`}>
                    <span className="ta-equals">=</span>
                    <span className="ta-result">{rowAns}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Sidebar Blocks (accumulates line by line) */}
          <div className="ta-sidebar">
            <h4 className="ta-sidebar-title">Blocks view</h4>
            <div className="ta-blocks-grid" ref={blocksScrollRef}>
              {Array.from({ length: revealAll ? 10 : currentRow }).map((_, rIdx) => {
                const isCurrentAnimatingRow = !revealAll && rIdx === currentRow - 1;

                return (
                  <div key={rIdx} className="ta-block-row">
                    {Array.from({ length: tableNum }).map((_, cIdx) => {
                      const globalIdx = rIdx * tableNum + cIdx;

                      let blockClass = 'ta-block';
                      let animDelay = 0;

                      if (isCurrentAnimatingRow) {
                        if (step >= 3) {
                          blockClass += ' fly-in';
                          animDelay = cIdx * 0.15;
                        } else {
                          blockClass += ' hidden';
                        }
                      } else {
                        blockClass += revealAll ? ' fly-in' : ' static-visible';
                        animDelay = revealAll ? (rIdx * tableNum + cIdx) * 0.02 : 0;
                      }

                      return (
                        <div
                          key={cIdx}
                          className={blockClass}
                          style={animDelay ? { animationDelay: `${animDelay}s` } : {}}
                        >
                          {globalIdx + 1}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {step >= 3 && (
              <div className="ta-total-badge animate-bounce-in">
                Total: {answer}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="ta-footer">
          {!revealAll && step === 2 && (
            <button
              className="ta-next-btn animate-bounce-in"
              onClick={() => setStep(3)}
            >
              Reveal Answer <FiArrowRight size={20} />
            </button>
          )}
          {!revealAll && step === 3 && currentRow < 10 && (
            <button
              className="ta-next-btn animate-bounce-in"
              onClick={() => setCurrentRow(prev => prev + 1)}
            >
              Skip Wait <FiArrowRight size={20} />
            </button>
          )}
          {!revealAll && (
            <button
              className="ta-next-btn reveal-all-btn animate-bounce-in"
              onClick={handleRevealAll}
              title="Shift+Enter"
            >
              <FiZap size={18} /> Reveal All
            </button>
          )}
          {(revealAll || (isDone && currentRow === 10)) && (
            <button
              className="ta-next-btn finish animate-bounce-in"
              onClick={onClose}
            >
              Done! 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
