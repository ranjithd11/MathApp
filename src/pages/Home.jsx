import React, { useState, useEffect } from 'react';
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

// Modules for each grade (only Grade 1 has real modules for now)
const GRADE_MODULES = {
  1: [
    { id: 'addition',       emoji: '➕', title: 'Addition',       path: '/grade/1/addition' },
    { id: 'subtraction',    emoji: '➖', title: 'Subtraction',    path: '/grade/1/subtraction' },
    { id: 'multiplication', emoji: '✖️', title: 'Multiplication', path: '/grade/1/multiplication' },
    { id: 'division',       emoji: '➗', title: 'Division',       path: '/grade/1/division' },
    { id: 'tables',         emoji: '📊', title: 'Tables 2–12',   path: '/grade/1/tables' },
  ],
};

function GradeList({ onSelect }) {
  const [expandedGrade, setExpandedGrade] = useState(null);

  const handleGradeClick = (g, isAvailable) => {
    if (!isAvailable) return;
    const hasModules = !!GRADE_MODULES[g];
    if (hasModules) {
      // Toggle expand
      setExpandedGrade(prev => (prev === g ? null : g));
    } else {
      onSelect();
    }
  };

  return (
    <div className="grade-sidebar-list-inner">
      {GRADES.map((g, idx) => {
        const theme = GRADE_THEMES[idx];
        const isAvailable = g === 1;
        const isExpanded = expandedGrade === g;
        const modules = GRADE_MODULES[g];

        return (
          <div key={g} className="sidebar-grade-item">
            {/* Grade row */}
            {isAvailable ? (
              <button
                className={`sidebar-grade-row color-${theme.color} available ${isExpanded ? 'expanded' : ''}`}
                onClick={() => handleGradeClick(g, isAvailable)}
                aria-expanded={isExpanded}
              >
                <span className="gc-emoji">{theme.emoji}</span>
                <span className="gc-grade">Grade {g}</span>
                <span className="gc-tagline">{theme.tagline}</span>
                <span className="sidebar-expand-icon">{isExpanded ? '▾' : '›'}</span>
              </button>
            ) : (
              <div
                className={`sidebar-grade-row color-${theme.color} locked`}
                aria-label={`Grade ${g} — Coming Soon`}
              >
                <span className="gc-emoji">{theme.emoji}</span>
                <span className="gc-grade">Grade {g}</span>
                <span className="gc-tagline">{theme.tagline}</span>
                <span className="gc-lock">🔒</span>
              </div>
            )}

            {/* Expandable modules panel */}
            {isExpanded && modules && (
              <div className="sidebar-modules">
                {modules.map((mod, mIdx) => (
                  <Link
                    key={mod.id}
                    to={mod.path}
                    className="sidebar-module-row"
                    style={{ animationDelay: `${mIdx * 0.05}s` }}
                    onClick={onSelect}
                  >
                    <span className="sm-emoji">{mod.emoji}</span>
                    <span className="sm-title">{mod.title}</span>
                    <span className="sm-arrow">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

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

          {/* Mobile-only grade picker button */}
          <button
            id="grade-sidebar-toggle"
            className="grade-sidebar-toggle animate-fade-up"
            style={{ animationDelay: '0.4s' }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Pick a grade"
          >
            📚 Pick Your Grade
          </button>
        </div>
      </section>

      {/* Desktop grade grid */}
      <section className="grade-section desktop-only">
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

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="grade-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar panel */}
      <aside className={`grade-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Grade selector">
        <div className="grade-sidebar-header">
          <span className="grade-sidebar-title">📚 Pick Your Grade</span>
          <button
            id="grade-sidebar-close"
            className="grade-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close grade menu"
          >✕</button>
        </div>
        <div className="grade-sidebar-list">
          <GradeList onSelect={() => setSidebarOpen(false)} />
        </div>
      </aside>
    </main>
  );
}
