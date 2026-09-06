import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { FiSettings } from 'react-icons/fi';
import './Header.css';

const GRADES = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">🧮</span>
          <div className="logo-text">
            <span className="logo-title">MathKids</span>
            <span className="logo-sub">Learning is Fun!</span>
          </div>
        </Link>

        {/* Grade selector */}
        <nav className="grade-nav" aria-label="Grade selector">
          {GRADES.map(g => {
            const isActive = location.pathname.startsWith(`/grade/${g}`);
            const isAvailable = g === 1;
            return isAvailable ? (
              <Link
                key={g}
                to={`/grade/${g}`}
                className={`grade-pill ${isActive ? 'active' : ''}`}
                aria-label={`Grade ${g}`}
              >
                G{g}
              </Link>
            ) : (
              <span
                key={g}
                className="grade-pill locked"
                title={`Grade ${g} — Coming Soon!`}
                aria-disabled="true"
              >
                G{g}
                <span className="lock-badge">🔒</span>
              </span>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="header-actions">
          <Link
            to="/settings"
            className={`settings-link ${location.pathname === '/settings' ? 'active' : ''}`}
            aria-label="Settings"
            title="Settings"
          >
            <FiSettings size={20} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
