import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const GRADES = Array.from({ length: 10 }, (_, i) => i + 1);

const GRADE_THEMES = [
  { emoji: '🌱', tagline: 'Counting Begins!' },
  { emoji: '🌿', tagline: 'Growing Stronger!' },
  { emoji: '🌳', tagline: 'Building Up!' },
  { emoji: '⭐', tagline: 'Rising Star!' },
  { emoji: '🚀', tagline: 'Blast Off!' },
  { emoji: '🧠', tagline: 'Mind Power!' },
  { emoji: '💡', tagline: 'Bright Ideas!' },
  { emoji: '🔬', tagline: 'Explorer Mode!' },
  { emoji: '🏆', tagline: 'Champion!' },
  { emoji: '👑', tagline: 'Math Master!' },
];

const GRADE_MODULES = {
  1: [
    { id: 'addition',       emoji: '➕', title: 'Addition',       color: 'teal'    },
    { id: 'subtraction',    emoji: '➖', title: 'Subtraction',    color: 'primary' },
    { id: 'multiplication', emoji: '✖️', title: 'Multiplication', color: 'purple'  },
    { id: 'division',       emoji: '➗', title: 'Division',       color: 'gold'    },
    { id: 'tables',         emoji: '📊', title: 'Tables 2–12',    color: 'green'   },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  // ── Collapsed state (persisted) ──
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sb-collapsed') === 'true'; }
    catch { return false; }
  });

  const toggleCollapsed = () => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('sb-collapsed', next); } catch {}
      return next;
    });
  };

  // ── Expanded grade (sub-menu) ──
  const activeGrade = (() => {
    const match = location.pathname.match(/^\/grade\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  })();

  const [expanded, setExpanded] = useState(activeGrade);

  useEffect(() => {
    if (activeGrade) setExpanded(activeGrade);
  }, [activeGrade]);

  const toggleGrade = (g) => {
    setExpanded(prev => (prev === g ? null : g));
  };

  const isHome = location.pathname === '/';

  return (
    <aside
      className={`sidebar${isOpen ? ' open' : ''}${collapsed ? ' collapsed' : ''}`}
      aria-label="Navigation"
    >
      {/* ── Sidebar header ── */}
      <div className="sb-header">
        {!collapsed && <span className="sb-header-label">📚 Grades</span>}
        <button
          className="sb-collapse-btn"
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sb-nav">
        {/* ── Home link ── */}
        <Link
          to="/"
          className={`sb-item available sb-home${isHome ? ' active' : ''}`}
          onClick={onClose}
          title="Home"
        >
          <span className="sb-emoji">🏠</span>
          <span className="sb-text">
            <span className="sb-grade-name">Home</span>
            <span className="sb-tagline">Main Menu</span>
          </span>
          <span className="sb-short">🏠</span>
        </Link>

        <div className="sb-divider" />

        {/* ── Grades ── */}
        {GRADES.map((g, idx) => {
          const theme = GRADE_THEMES[idx];
          const isAvailable = g === 1;
          const isGradeActive = location.pathname.startsWith(`/grade/${g}`);
          const isExpanded = expanded === g;
          const modules = GRADE_MODULES[g] || [];

          return (
            <div key={g} className="sb-grade-group">
              {/* Grade row */}
              {isAvailable ? (
                <button
                  className={`sb-item available${isGradeActive ? ' active' : ''}`}
                  onClick={() => toggleGrade(g)}
                  title={`Grade ${g} — ${theme.tagline}`}
                  aria-expanded={isExpanded}
                >
                  <span className="sb-emoji">{theme.emoji}</span>
                  <span className="sb-text">
                    <span className="sb-grade-name">Grade {g}</span>
                    <span className="sb-tagline">{theme.tagline}</span>
                  </span>
                  <span className="sb-short">G{g}</span>
                  <span className={`sb-chevron${isExpanded ? ' open' : ''}`}>›</span>
                </button>
              ) : (
                <div
                  className="sb-item locked"
                  title={`Grade ${g} — Coming Soon!`}
                >
                  <span className="sb-emoji">{theme.emoji}</span>
                  <span className="sb-text">
                    <span className="sb-grade-name">Grade {g}</span>
                    <span className="sb-tagline">Coming soon</span>
                  </span>
                  <span className="sb-short">G{g}</span>
                  <span className="sb-lock-icon">🔒</span>
                </div>
              )}

              {/* Module sub-menu */}
              {isAvailable && modules.length > 0 && (
                <div className={`sb-modules${isExpanded ? ' open' : ''}`}>
                  <div>
                    <Link
                      to={`/grade/${g}`}
                      className={`sb-module-item sb-all${location.pathname === `/grade/${g}` ? ' active' : ''}`}
                      onClick={onClose}
                    >
                      <span className="sb-mod-emoji">🎒</span>
                      <span className="sb-mod-title">All Modules</span>
                    </Link>

                    {modules.map(mod => {
                      const modPath = `/grade/${g}/${mod.id}`;
                      const isModActive = location.pathname === modPath;
                      return (
                        <Link
                          key={mod.id}
                          to={modPath}
                          className={`sb-module-item color-${mod.color}${isModActive ? ' active' : ''}`}
                          onClick={onClose}
                          title={mod.title}
                        >
                          <span className="sb-mod-emoji">{mod.emoji}</span>
                          <span className="sb-mod-title">{mod.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
