/**
 * sounds.js — Programmatic sound effects using Web Audio API
 * No external files needed.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.15, gain = 0.4, delay = 0 }) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    vol.gain.setValueAtTime(0, ctx.currentTime + delay);
    vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) {
    // Silently fail if audio not available
  }
}

/** 🎉 Happy ascending chime for correct answer */
export function playCorrect() {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'sine', duration: 0.22, gain: 0.3, delay: i * 0.1 });
  });
}

/** ❌ Descending buzz for wrong answer */
export function playWrong() {
  playTone({ frequency: 320, type: 'sawtooth', duration: 0.12, gain: 0.25, delay: 0 });
  playTone({ frequency: 240, type: 'sawtooth', duration: 0.18, gain: 0.2, delay: 0.13 });
}

/** 🕐 Soft tick for each timer second */
export function playTick() {
  playTone({ frequency: 880, type: 'sine', duration: 0.04, gain: 0.15, delay: 0 });
}

/** ⏰ Urgent beep sequence for last 3 seconds */
export function playUrgentTick() {
  playTone({ frequency: 1100, type: 'sine', duration: 0.06, gain: 0.25, delay: 0 });
}

/** ⌛ Time's up alarm */
export function playTimeUp() {
  [0, 0.18, 0.36].forEach(delay => {
    playTone({ frequency: 440, type: 'square', duration: 0.14, gain: 0.3, delay });
  });
}

/** 🔢 Soft click for number pad press */
export function playClick() {
  playTone({ frequency: 660, type: 'sine', duration: 0.06, gain: 0.18, delay: 0 });
}
