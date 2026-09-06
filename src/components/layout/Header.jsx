import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { FiSettings, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

export default function Header({ onMenuClick, sidebarOpen }) {
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

        {/* Spacer */}
        <div className="header-spacer" />

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

          {/* Hamburger — mobile only */}
          <button
            className="menu-btn"
            onClick={onMenuClick}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
