import { useState, useEffect, useRef, useCallback } from 'react';
import { playTick, playUrgentTick, playTimeUp } from '../utils/sounds';
import { useSettings } from '../context/SettingsContext';

export function useTimer(onTimeUp) {
  const { timerDuration, soundEnabled } = useSettings();
  const [secondsLeft, setSecondsLeft] = useState(timerDuration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setSecondsLeft(timerDuration);
    setRunning(true);
  }, [timerDuration]);

  const stop = useCallback(() => {
    setRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setSecondsLeft(timerDuration);
  }, [stop, timerDuration]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (soundEnabled) playTimeUp();
          onTimeUp?.();
          return 0;
        }
        const next = s - 1;
        if (soundEnabled) {
          if (next <= 3) playUrgentTick();
          else playTick();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, soundEnabled, onTimeUp]);

  const progress = timerDuration > 0 ? secondsLeft / timerDuration : 0;

  return { secondsLeft, running, progress, start, stop, reset, total: timerDuration };
}
