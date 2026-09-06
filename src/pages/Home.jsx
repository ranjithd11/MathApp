import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const GRADES = Array.from({ length: 10 }, (_, i) => i + 1);

const GRADE_THEMES = [
  { emoji: '🌱', color: 'teal',    tagline: 'Counting Begins!' },
  { emoji: '🌿', color: 'green',   tagline: 'Growing Stronger!' },
  { emoji: '🌳', color: 'emerald', tagline: 'Building Up!' },
  { emoji: '⭐', color: 'gold',    tagline: 'Rising Star!' },
  { emoji: '🚀', color: 'purple',  tagline: 'Blast Off!' },
  { emoji: '🧠', color: 'indigo',  tagline: 'Mind Power!' },
  { emoji: '💡', color: 'orange',  tagline: 'Bright Ideas!' },
  { emoji: '🔬', color: 'cyan',    tagline: 'Explorer Mode!' },
  { emoji: '🏆', color: 'gold',    tagline: 'Champion!' },
  { emoji: '👑', color: 'primary', tagline: 'Math Master!' },
];

export default function Home() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="floating-shapes" aria-hidden="true">
          {['➕','➖','✖️','➗','🔢','📐','📏','🔣'].map((s, i) => (
            <span key={i} className="float-shape" style={{ animationDelay: `${i * 0.7}s`, animationDuration: `${3 + (i % 3)}s` }}>{s}</span>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-pill animate-fade-up">🎓 Interactive Math Learning</div>
          <h1 className="hero-heading animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Make Math <span className="highlight-text">Fun!</span>
          </h1>
          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Learn addition, subtraction, multiplication and more — step by step with animations!
          </p>
          <Link to="/grade/1" className="hero-cta animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Start with Grade 1 🚀
          </Link>
        </div>
      </section>

      {/* Grade grid */}
      <section className="grade-section">
        <h2 className="section-title">Pick Your Grade</h2>
        <div className="grade-grid">
          {GRADES.map((g, idx) => {
            const theme = GRADE_THEMES[idx];
            const isAvailable = g === 1;
            return isAvailable ? (
              <Link
                key={g}
                to={`/grade/${g}`}
                className={`grade-card color-${theme.color} available`}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <span className="gc-emoji">{theme.emoji}</span>
                <span className="gc-grade">Grade {g}</span>
                <span className="gc-tagline">{theme.tagline}</span>
                <span className="gc-arrow">→</span>
              </Link>
            ) : (
              <div
                key={g}
                className={`grade-card color-${theme.color} locked`}
                style={{ animationDelay: `${idx * 0.06}s` }}
                aria-label={`Grade ${g} — Coming Soon`}
              >
                <span className="gc-emoji">{theme.emoji}</span>
                <span className="gc-grade">Grade {g}</span>
                <span className="gc-tagline">{theme.tagline}</span>
                <span className="gc-lock">🔒</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
