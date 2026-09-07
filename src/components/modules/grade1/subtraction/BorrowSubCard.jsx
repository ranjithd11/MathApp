import React, { useEffect, useState, useRef, useCallback } from 'react';
import CountdownTimer from '../../../ui/CountdownTimer';
import { useTimer } from '../../../../hooks/useTimer';
import { useSettings } from '../../../../context/SettingsContext';
import { playCorrect, playWrong, playClick } from '../../../../utils/sounds';
import MascotElephant from '../../../ui/MascotElephant';
import NumberPad from '../../../ui/NumberPad';
import './BorrowSubCard.css';

/**
 * Step-by-step borrowing subtraction card.
 * For 42 - 27:
 *   Step 1: Enter reduced tens (3) above the 4 → 4 gets struck through
 *   Step 2: Enter borrowed ones (12) above the 2
 *   Step 3: Enter ones answer (5)
 *   Step 4: Enter tens answer (1)
 */
export default function BorrowSubCard({
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

  // Step tracking
  // 'reducedTens' | 'borrowedOnes' | 'onesAnswer' | 'tensAnswer' | 'done'
  const [borrowStep, setBorrowStep] = useState('reducedTens');

  // Input values
  const [reducedTensInput, setReducedTensInput]   = useState('');
  const [borrowedOnesInput, setBorrowedOnesInput] = useState('');
  const [onesAnsInput, setOnesAnsInput]           = useState('');
  const [tensAnsInput, setTensAnsInput]           = useState('');

  // Validation state for each field
  const [rtStatus, setRtStatus]  = useState('idle'); // reduced tens
  const [boStatus, setBoStatus]  = useState('idle'); // borrowed ones
  const [oaStatus, setOaStatus]  = useState('idle'); // ones answer
  const [taStatus, setTaStatus]  = useState('idle'); // tens answer

  const reducedTensRef  = useRef(null);
  const borrowedOnesRef = useRef(null);
  const onesAnsRef      = useRef(null);
  const tensAnsRef      = useRef(null);

  const handleTimeUp = () => {
    if (status === 'idle') {
      setTimedOut(true);
      if (soundEnabled) playWrong();
    }
  };
  const timer = useTimer(handleTimeUp);

  // Reset on new question
  useEffect(() => {
    setBorrowStep('reducedTens');
    setReducedTensInput(''); setBorrowedOnesInput('');
    setOnesAnsInput(''); setTensAnsInput('');
    setRtStatus('idle'); setBoStatus('idle');
    setOaStatus('idle'); setTaStatus('idle');
    setTimedOut(false);
    if (timerEnabled) timer.start(); else timer.stop();
    setTimeout(() => reducedTensRef.current?.focus(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, timerEnabled]);

  useEffect(() => {
    if (status !== 'idle') timer.stop();
  }, [status]);

  const isAnswerable = status === 'idle' && !timedOut;

  /* ── Math ── */
  const tensA       = Math.floor(problem.a / 10);
  const onesA       = problem.a % 10;
  const tensB       = Math.floor(problem.b / 10);
  const onesB       = problem.b % 10;
  const expectedRt  = tensA - 1;           // reduced tens digit
  const expectedBo  = onesA + 10;          // borrowed ones (2-digit, e.g. 12)
  const expectedOa  = expectedBo - onesB;  // ones answer
  const expectedTa  = expectedRt - tensB;  // tens answer

  /* ── Handlers ── */

  const onReducedTensChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setReducedTensInput(val);
    if (!val) { setRtStatus('idle'); return; }
    if (soundEnabled) playClick();
    if (parseInt(val, 10) === expectedRt) {
      setRtStatus('correct');
      if (soundEnabled) playCorrect();
      setBorrowStep('borrowedOnes');
      setTimeout(() => borrowedOnesRef.current?.focus(), 150);
    } else {
      setRtStatus('wrong');
      if (soundEnabled) playWrong();
    }
  };

  const onBorrowedOnesChange = (e) => {
    // Allow up to 2 digits (e.g. 12, 13)
    const val = e.target.value.replace(/\D/g, '').slice(-2);
    setBorrowedOnesInput(val);
    if (!val) { setBoStatus('idle'); return; }
    if (soundEnabled) playClick();
    if (parseInt(val, 10) === expectedBo) {
      setBoStatus('correct');
      if (soundEnabled) playCorrect();
      setBorrowStep('onesAnswer');
      setTimeout(() => onesAnsRef.current?.focus(), 150);
    } else if (val.length === 2) {
      setBoStatus('wrong');
      if (soundEnabled) playWrong();
    }
  };

  const onOnesAnsChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setOnesAnsInput(val);
    if (!val) { setOaStatus('idle'); return; }
    if (soundEnabled) playClick();
    if (parseInt(val, 10) === expectedOa) {
      setOaStatus('correct');
      if (soundEnabled) playCorrect();
      setBorrowStep('tensAnswer');
      setTimeout(() => tensAnsRef.current?.focus(), 150);
    } else {
      setOaStatus('wrong');
      if (soundEnabled) playWrong();
    }
  };

  const onTensAnsChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    setTensAnsInput(val);
    if (!val) { setTaStatus('idle'); return; }
    if (soundEnabled) playClick();
    if (parseInt(val, 10) === expectedTa) {
      setTaStatus('correct');
      setBorrowStep('done');
      // Build final answer and submit
      const finalAnswer = String(expectedTa) + String(expectedOa);
      setUserAnswer(finalAnswer);
      if (soundEnabled) playCorrect();
      timer.stop();
      setTimeout(() => checkAnswer(finalAnswer), 100);
    } else {
      setTaStatus('wrong');
      if (soundEnabled) playWrong();
    }
  };

  // Helper for NumberPad
  const getActiveValue = () => {
    if (borrowStep === 'reducedTens') return reducedTensInput;
    if (borrowStep === 'borrowedOnes') return borrowedOnesInput;
    if (borrowStep === 'onesAnswer') return onesAnsInput;
    if (borrowStep === 'tensAnswer') return tensAnsInput;
    return '';
  };

  const handleActiveChange = (val) => {
    const e = { target: { value: val } };
    if (borrowStep === 'reducedTens') onReducedTensChange(e);
    else if (borrowStep === 'borrowedOnes') onBorrowedOnesChange(e);
    else if (borrowStep === 'onesAnswer') onOnesAnsChange(e);
    else if (borrowStep === 'tensAnswer') onTensAnsChange(e);
  };

  const handleNext = useCallback(() => {
    setTimedOut(false);
    nextQuestion();
  }, [nextQuestion]);

  // Auto-advance after celebration
  useEffect(() => {
    if (status === 'idle') return;
    const handler = (e) => {
      if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
        if (e.type === 'keydown') e.preventDefault();
        if (e.type === 'click' && e.target.closest('button')) return;
        handleNext();
      }
    };
    const t    = setTimeout(() => {
      window.addEventListener('click', handler);
      window.addEventListener('keydown', handler);
    }, 100);
    const auto = setTimeout(handleNext, 2000);
    return () => {
      clearTimeout(t); clearTimeout(auto);
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [status, handleNext]);

  const stepLabels = {
    reducedTens:  'Step 1: Enter the reduced tens digit above the ' + tensA,
    borrowedOnes: 'Step 2: Enter the borrowed ones value above the ' + onesA,
    onesAnswer:   'Step 3: Enter the ones answer (' + expectedBo + ' − ' + onesB + ')',
    tensAnswer:   'Step 4: Enter the tens answer (' + expectedRt + ' − ' + tensB + ')',
    done:         'Perfect! 🎉',
  };

  return (
    <>
      <div className={`problem-card borrow-card ${status} ${timedOut ? 'timed-out' : ''}`}>

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

        {/* Step hint */}
        <div className="borrow-step-hint">
          {stepLabels[borrowStep]}
        </div>

        {/* ── Vertical Math Layout ── */}
        <div className="borrow-math-wrap">

          {/* The whole subtraction is laid out as a CSS grid with rows:
              Row 1: above-inputs (reduced tens, borrowed ones)
              Row 2: top number (42)
              Row 3: minus sign + bottom number (27)
              Divider
              Row 4: answer inputs              */}

          <div className="borrow-vgrid">

            {/* ── ROW 1: Above-inputs ── */}
            <div className="bv-op-spacer"></div>   {/* op column spacer */}
            <div className="bv-cell above-cell">
              <input
                ref={reducedTensRef}
                type="text"
                className={`bg-input above-input ${rtStatus}`}
                value={reducedTensInput}
                onChange={onReducedTensChange}
                disabled={!isAnswerable || borrowStep !== 'reducedTens'}
                maxLength={1}
                aria-label="Reduced tens"
                placeholder="?"
                inputMode="numeric"
                onFocus={() => setBorrowStep('reducedTens')}
              />
            </div>
            <div className="bv-cell above-cell">
              <input
                ref={borrowedOnesRef}
                type="text"
                className={`bg-input above-input wide ${boStatus}`}
                value={borrowedOnesInput}
                onChange={onBorrowedOnesChange}
                disabled={!isAnswerable || borrowStep !== 'borrowedOnes'}
                maxLength={2}
                aria-label="Borrowed ones"
                placeholder="?"
                inputMode="numeric"
                onFocus={() => setBorrowStep('borrowedOnes')}
              />
            </div>

            {/* ── ROW 2: Top number (42) ── */}
            <div className="bv-op-spacer"></div>
            <div className={`bv-cell bv-digit ${rtStatus === 'correct' ? 'struck' : ''}`}>
              {tensA}
            </div>
            <div className="bv-cell bv-digit">
              {onesA}
            </div>

            {/* ── ROW 3: Minus + Bottom number (27) ── */}
            <div className="bv-op-cell">−</div>
            <div className="bv-cell bv-digit dimmed">{tensB}</div>
            <div className="bv-cell bv-digit dimmed">{onesB}</div>

            {/* ── Divider spanning all 3 columns ── */}
            <div className="bv-divider-span"></div>
            <div className="bv-divider-span"></div>
            <div className="bv-divider-span"></div>

            {/* ── ROW 4: Answer inputs ── */}
            <div className="bv-op-spacer"></div>
            <div className="bv-cell">
              <input
                ref={tensAnsRef}
                type="text"
                className={`bg-input ans-input ${taStatus}`}
                value={tensAnsInput}
                onChange={onTensAnsChange}
                disabled={!isAnswerable || (borrowStep !== 'tensAnswer' && borrowStep !== 'done')}
                maxLength={1}
                aria-label="Tens answer"
                placeholder="?"
                inputMode="numeric"
                onFocus={() => { if (borrowStep !== 'done') setBorrowStep('tensAnswer'); }}
              />
            </div>
            <div className="bv-cell">
              <input
                ref={onesAnsRef}
                type="text"
                className={`bg-input ans-input ${oaStatus}`}
                value={onesAnsInput}
                onChange={onOnesAnsChange}
                disabled={!isAnswerable || (borrowStep !== 'onesAnswer' && borrowStep !== 'tensAnswer' && borrowStep !== 'done')}
                maxLength={1}
                aria-label="Ones answer"
                placeholder="?"
                inputMode="numeric"
                onFocus={() => { if (borrowStep !== 'done' && borrowStep !== 'tensAnswer') setBorrowStep('onesAnswer'); }}
              />
            </div>
        
        {/* Floating NumberPad */}
        <NumberPad
          value={getActiveValue()}
          onChange={handleActiveChange}
          disabled={!isAnswerable || borrowStep === 'done'}
          actionButton={
            borrowStep === 'done' || timedOut ? (
              <button
                className="np-action-btn next"
                onClick={handleNext}
                aria-label="Next question"
              >
                ▶ Next
              </button>
            ) : null
          }
        />

          </div>{/* end borrow-vgrid */}
        </div>{/* end borrow-math-wrap */}

        {/* Feedback */}
        {status === 'correct' && (
          <div className="feedback correct animate-bounce-in">
            <span className="fb-emoji">🎉</span>
            <div className="fb-text"><strong>Correct!</strong><span>You nailed the borrowing!</span></div>
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
