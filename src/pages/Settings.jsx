import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './Settings.css';

const TIMER_OPTIONS = [
  { value: 0,  label: 'No Timer',  emoji: '∞' },
  { value: 15, label: '15 sec',    emoji: '⚡' },
  { value: 20, label: '20 sec',    emoji: '🏃' },
  { value: 30, label: '30 sec',    emoji: '⏱' },
  { value: 45, label: '45 sec',    emoji: '🧘' },
  { value: 60, label: '1 minute',  emoji: '🐢' },
];

export default function Settings() {
  const { timerDuration, timerEnabled, soundEnabled, updateSetting } = useSettings();

  return (
    <main className="settings-page">
      <div className="settings-hero">
        <div className="settings-hero-badge">⚙️ Settings</div>
        <h1 className="settings-title">Customize Your Experience</h1>
        <p className="settings-sub">Adjust how MathKids works for you!</p>
      </div>

      <div className="settings-grid">
        {/* Sound Settings */}
        <section className="settings-card animate-fade-up">
          <div className="card-icon-header">
            <span className="card-icon">🔊</span>
            <div>
              <h2 className="card-title">Sound Effects</h2>
              <p className="card-sub">Fun sounds for correct and wrong answers</p>
            </div>
          </div>
          <div className="toggle-row">
            <span className="toggle-label">{soundEnabled ? '🔔 Sounds On' : '🔕 Sounds Off'}</span>
            <button
              className={`big-toggle ${soundEnabled ? 'on' : 'off'}`}
              onClick={() => updateSetting('soundEnabled', !soundEnabled)}
              aria-pressed={soundEnabled}
              aria-label="Toggle sound effects"
            >
              <div className="big-toggle-thumb" />
              <span className="big-toggle-on">ON</span>
              <span className="big-toggle-off">OFF</span>
            </button>
          </div>
        </section>

        {/* Timer Settings */}
        <section className="settings-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon-header">
            <span className="card-icon">⏱</span>
            <div>
              <h2 className="card-title">Countdown Timer</h2>
              <p className="card-sub">Set how long each question lasts</p>
            </div>
          </div>

          <div className="toggle-row" style={{ marginBottom: '16px' }}>
            <span className="toggle-label">{timerEnabled ? '⏰ Timer On' : '⏸ Timer Off'}</span>
            <button
              className={`big-toggle ${timerEnabled ? 'on' : 'off'}`}
              onClick={() => updateSetting('timerEnabled', !timerEnabled)}
              aria-pressed={timerEnabled}
              aria-label="Toggle timer"
            >
              <div className="big-toggle-thumb" />
              <span className="big-toggle-on">ON</span>
              <span className="big-toggle-off">OFF</span>
            </button>
          </div>

          {timerEnabled && (
            <div className="timer-options">
              <p className="options-label">Time per question:</p>
              <div className="timer-grid">
                {TIMER_OPTIONS.filter(o => o.value > 0).map(opt => (
                  <button
                    key={opt.value}
                    className={`timer-opt ${timerDuration === opt.value ? 'selected' : ''}`}
                    onClick={() => updateSetting('timerDuration', opt.value)}
                    aria-pressed={timerDuration === opt.value}
                  >
                    <span className="opt-emoji">{opt.emoji}</span>
                    <span className="opt-label">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Visual timer preview */}
              <div className="timer-preview">
                <div className="preview-label">Preview: {timerDuration}s countdown</div>
                <div className="preview-bar">
                  <div
                    className="preview-fill"
                    style={{ width: `${(timerDuration / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Info card */}
        <section className="settings-card info-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon-header">
            <span className="card-icon">💡</span>
            <div>
              <h2 className="card-title">Tips</h2>
              <p className="card-sub">Getting the most out of MathKids</p>
            </div>
          </div>
          <ul className="tips-list">
            <li><span>🌱</span> Start with Level 1 (Single Digit) in Addition</li>
            <li><span>🔓</span> Score 5+ to unlock Level 2 (Double Digit)</li>
            <li><span>✨</span> Tap the <strong>Show Me!</strong> button to see animated explanations</li>
            <li><span>⏱</span> Set a shorter timer for more challenge!</li>
            <li><span>🔥</span> Keep your streak alive for bonus motivation!</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
