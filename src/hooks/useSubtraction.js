import { useState, useCallback, useEffect, useRef } from 'react';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(mode) {
  if (mode === 'single') {
    const b = randomInt(1, 9);
    const a = randomInt(b, 9);
    return { a, b, answer: a - b };
  } else if (mode === 'double-no-borrow') {
    // Ones digit of a >= ones digit of b (no borrowing needed)
    let a, b;
    do {
      b = randomInt(11, 49);
      a = randomInt(b + 1, 89);
    } while ((a % 10) < (b % 10)); // retry if borrow would be needed
    return { a, b, answer: a - b };
  } else {
    // 'double-borrow': Ones digit of a < ones digit of b (borrow required)
    let a, b;
    do {
      b = randomInt(11, 49);
      a = randomInt(b + 1, 89);
    } while ((a % 10) >= (b % 10)); // retry until borrow IS needed
    return { a, b, answer: a - b };
  }
}

export function useSubtraction(mode = 'single') {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [problem, setProblem] = useState(() => generateProblem(mode));
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const checkAnswer = useCallback((forcedAnswer = null) => {
    const val = forcedAnswer !== null ? forcedAnswer : userAnswer;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return;
    if (parsed === problem.answer) {
      setStatus('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStatus('wrong');
      setStreak(0);
    }
  }, [userAnswer, problem]);

  const nextQuestion = useCallback(() => {
    setProblem(generateProblem(mode));
    setUserAnswer('');
    setStatus('idle');
    setQuestionIndex(i => i + 1);
  }, [mode]);

  const reset = useCallback(() => {
    setProblem(generateProblem(mode));
    setUserAnswer('');
    setStatus('idle');
    setScore(0);
    setStreak(0);
    setQuestionIndex(0);
  }, [mode]);

  const prevMode = useRef(mode);
  useEffect(() => {
    if (prevMode.current !== mode) {
      reset();
      prevMode.current = mode;
    }
  }, [mode, reset]);

  return {
    problem,
    userAnswer,
    setUserAnswer,
    status,
    score,
    streak,
    questionIndex,
    checkAnswer,
    nextQuestion,
    reset,
    showPopup,
    setShowPopup,
  };
}
