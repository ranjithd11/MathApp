import { useState, useCallback, useEffect, useRef } from 'react';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(mode) {
  if (mode === 'single') {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    return { a, b, answer: a * b, op: '×' };
  } else {
    // double: two-digit × one-digit
    const a = randomInt(11, 19);
    const b = randomInt(2, 9);
    return { a, b, answer: a * b, op: '×' };
  }
}

export function useMultiplication(mode = 'single') {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [problem, setProblem] = useState(() => generateProblem(mode));
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const checkAnswer = useCallback((forcedAnswer = null) => {
    const val = forcedAnswer !== null ? forcedAnswer : userAnswer;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) return;
    if (parsed === problem.answer) {
      setStatus('correct'); setScore(s => s + 1); setStreak(s => s + 1);
    } else {
      setStatus('wrong'); setStreak(0);
    }
  }, [userAnswer, problem]);

  const nextQuestion = useCallback(() => {
    setProblem(generateProblem(mode));
    setUserAnswer(''); setStatus('idle');
    setQuestionIndex(i => i + 1);
  }, [mode]);

  const reset = useCallback(() => {
    setProblem(generateProblem(mode));
    setUserAnswer(''); setStatus('idle');
    setScore(0); setStreak(0); setQuestionIndex(0);
  }, [mode]);

  const prevMode = useRef(mode);
  useEffect(() => {
    if (prevMode.current !== mode) { reset(); prevMode.current = mode; }
  }, [mode, reset]);

  return { problem, userAnswer, setUserAnswer, status, score, streak, questionIndex, checkAnswer, nextQuestion, reset };
}
