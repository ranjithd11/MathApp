import React, { useEffect, useRef, useState } from 'react';
import './SubAnimationPopup.css';

/**
 * Number line animation for subtraction:
 * Step 1 - Draw a big red arc from 0 to 'a' (first number)
 * Step 2 - Draw individual backward green arcs from 'a' one at a time (b times)
 * Step 3 - Highlight the landing number (answer)
 */
export default function SubAnimationPopup({ problem, onClose }) {
  const { a, b, answer } = problem;

  // Phase: 'step1' | 'step2' | 'done'
  const [phase, setPhase] = useState('idle');
  const [jumpsDone, setJumpsDone] = useState(0); // how many backward jumps animated
  const jumpTimerRef = useRef(null);

  // Start animation on mount
  useEffect(() => {
    const t = setTimeout(() => setPhase('step1'), 600);
    return () => clearTimeout(t);
  }, []);

  // After step1 arc fully draws, pause then start backward jumps
  useEffect(() => {
    if (phase === 'step1') {
      const t = setTimeout(() => {
        setPhase('step2');
        setJumpsDone(0);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Animate backward jumps one by one
  useEffect(() => {
    if (phase === 'step2' && jumpsDone < b) {
      jumpTimerRef.current = setTimeout(() => {
        setJumpsDone(prev => prev + 1);
      }, 700);
      return () => clearTimeout(jumpTimerRef.current);
    }
    if (phase === 'step2' && jumpsDone >= b) {
      const t = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(t);
    }
  }, [phase, jumpsDone, b]);

  // Keyboard: Enter or Space to close once done
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'done') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  // Number line range: 0 to max(a+2, 10)
  const lineMax = Math.max(a + 2, 10);
  const numbers = Array.from({ length: lineMax + 1 }, (_, i) => i);

  // SVG geometry helpers
  const PADDING_LEFT = 32;
  const PADDING_RIGHT = 32;
  const SVG_HEIGHT = 170;          // extra room below the line for inverted arcs
  const numberLineY = 80;          // line is higher up so there's space both above and below
  const tickH = 10;

  // We'll compute positions in JS, rendered as SVG
  const svgWidth = 700; // viewBox width
  const usableWidth = svgWidth - PADDING_LEFT - PADDING_RIGHT;
  const step = usableWidth / lineMax;

  const xOf = (n) => PADDING_LEFT + n * step;

  // Arc above the line (Step 1, red)
  const arcAbove = (x1, x2, yBase, arcHeight) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${yBase} Q ${mx} ${yBase - arcHeight} ${x2} ${yBase}`;
  };

  // Arc below the line (Step 2, green — inverted)
  const arcBelow = (x1, x2, yBase, arcHeight) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${yBase} Q ${mx} ${yBase + arcHeight} ${x2} ${yBase}`;
  };

  const bigArcHeight = Math.min(55, step * a * 0.5);

  // Small backward arcs (step 2): from (a - jumpsDone) back by 1 each
  const smallArcs = [];
  for (let i = 0; i < jumpsDone; i++) {
    const from = a - i;
    const to = a - i - 1;
    smallArcs.push({ from, to });
  }

  const smallArcH = Math.min(32, step * 1.0);

  return (
    <div className="sub-anim-backdrop" onClick={phase === 'done' ? onClose : undefined}>
      <div className="sub-anim-modal" onClick={e => e.stopPropagation()}>
        {/* Header equation */}
        <div className="sub-anim-header">
          <span className="sub-eq-num a">{a}</span>
          <span className="sub-eq-op">−</span>
          <span className="sub-eq-num b">{b}</span>
          <span className="sub-eq-op">=</span>
          <span className={`sub-eq-num ans ${phase === 'done' ? 'visible' : ''}`}>
            {phase === 'done' ? answer : '?'}
          </span>
        </div>

        {/* Step indicators */}
        <div className="sub-steps-row">
          <div className={`sub-step-box ${phase !== 'idle' ? 'active' : ''}`}>
            <span className="sub-step-label">Step 1</span>
            <span className="sub-step-desc">Jump from 0 to {a}</span>
          </div>
          <div className={`sub-step-box ${phase === 'step2' || phase === 'done' ? 'active' : ''}`}>
            <span className="sub-step-label">Step 2</span>
            <span className="sub-step-desc">Jump back {b} times</span>
          </div>
          <div className={`sub-step-box ${phase === 'done' ? 'active' : ''}`}>
            <span className="sub-step-label">Step 3</span>
            <span className="sub-step-desc">Land on the answer!</span>
          </div>
        </div>

        {/* Number line SVG */}
        <div className="sub-numline-wrap">
          <svg
            viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
            className="sub-numline-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Arrow line */}
            <line
              x1={PADDING_LEFT - 10} y1={numberLineY}
              x2={svgWidth - PADDING_RIGHT + 10} y2={numberLineY}
              stroke="var(--text-secondary)" strokeWidth="2.5"
            />
            {/* Arrow head */}
            <polygon
              points={`${svgWidth - PADDING_RIGHT + 10},${numberLineY} ${svgWidth - PADDING_RIGHT},${numberLineY - 5} ${svgWidth - PADDING_RIGHT},${numberLineY + 5}`}
              fill="var(--text-secondary)"
            />

            {/* Tick marks & numbers */}
            {numbers.map(n => (
              <g key={n}>
                <line
                  x1={xOf(n)} y1={numberLineY - tickH / 2}
                  x2={xOf(n)} y2={numberLineY + tickH / 2}
                  stroke="var(--text-secondary)" strokeWidth="1.5"
                />
                <text
                  x={xOf(n)} y={numberLineY + 22}
                  textAnchor="middle"
                  fontSize="11"
                  fill={
                    n === answer && phase === 'done' ? '#22c55e'
                    : n === a ? '#ef4444'
                    : 'var(--text-secondary)'
                  }
                  fontWeight={n === answer || n === a ? 'bold' : 'normal'}
                >
                  {n}
                </text>
              </g>
            ))}

            {/* BIG RED ARC: 0 → a (Step 1, above line) */}
            {phase !== 'idle' && (
              <path
                d={arcAbove(xOf(0), xOf(a), numberLineY, bigArcHeight)}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
                className="sub-arc-draw big-arc"
              />
            )}

            {/* SMALL GREEN ARCS: backward jumps (Step 2, below line) */}
            {smallArcs.map(({ from, to }, i) => (
              <path
                key={i}
                d={arcBelow(xOf(from), xOf(to), numberLineY, smallArcH)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="sub-arc-draw small-arc"
              />
            ))}

            {/* Highlight dot on answer */}
            {phase === 'done' && (
              <circle
                cx={xOf(answer)} cy={numberLineY}
                r="8"
                fill="#22c55e"
                className="sub-answer-dot"
              />
            )}

            {/* Highlight dot on 'a' after step 1 */}
            {(phase === 'step1' || phase === 'step2') && (
              <circle
                cx={xOf(a)} cy={numberLineY}
                r="7"
                fill="#ef4444"
                opacity="0.8"
              />
            )}
          </svg>
        </div>

        {/* Footer */}
        <div className="sub-anim-footer">
          {phase === 'done' ? (
            <button className="sub-close-btn" onClick={onClose}>
              Got it! ✨ (Enter)
            </button>
          ) : (
            <p className="sub-anim-hint">Watch the number line…</p>
          )}
        </div>
      </div>
    </div>
  );
}
