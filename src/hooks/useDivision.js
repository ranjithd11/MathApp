import { useState, useCallback, useEffect, useRef } from 'react';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(mode) {
  if (mode === 'simple') {
    // answer 1-9, divisor 2-9
    const answer = randomInt(1, 9);
    const b = randomInt(2, 9);
    return { a: answer * b, b, answer, op: '÷' };
  } else {
    // larger: answer 10-12, divisor 2-9
    const answer = randomInt(10, 12);
    const b = randomInt(2, 9);
    return { a: answer * b, b, answer, op: '÷' };
  }
}

export function useDivision(mode = 'simple') {
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
