import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdditionPage from '../components/modules/grade1/addition/AdditionPage';
import SubtractionPage from '../components/modules/grade1/subtraction/SubtractionPage';
import MultiplicationPage from '../components/modules/grade1/multiplication/MultiplicationPage';
import DivisionPage from '../components/modules/grade1/division/DivisionPage';
import TablesModule from '../components/modules/grade1/tables/TablesModule';
import './Grade1.css';

const MODULES = [
  { id: 'addition',       emoji: '➕', title: 'Addition',       desc: 'Add single & double digit numbers', available: true,  color: 'teal' },
  { id: 'subtraction',    emoji: '➖', title: 'Subtraction',    desc: 'Learn to take away!',               available: true,  color: 'primary' },
  { id: 'multiplication', emoji: '✖️', title: 'Multiplication', desc: 'Multiply the fun!',                  available: true,  color: 'purple' },
  { id: 'division',       emoji: '➗', title: 'Division',       desc: 'Sharing made easy!',                available: true,  color: 'gold' },
  { id: 'tables',         emoji: '📊', title: 'Tables 2–12',    desc: 'Master your times tables!',         available: true, color: 'green' },
];

export default function Grade1({ activeModule }) {
  const navigate = useNavigate();

  if (activeModule === 'addition') {
    return (
      <div className="grade1-page">
        <AdditionPage />
      </div>
    );
  }

  if (activeModule === 'subtraction') {
    return (
      <div className="grade1-page">
        <SubtractionPage />
      </div>
    );
  }

  if (activeModule === 'multiplication') {
    return (
      <div className="grade1-page">
        <MultiplicationPage />
      </div>
    );
  }

  if (activeModule === 'division') {
    return (
      <div className="grade1-page">
        <DivisionPage />
      </div>
    );
  }

  if (activeModule === 'tables') {
    return (
      <div className="grade1-page">
        <TablesModule />
      </div>
    );
  }

  return (
    <main className="grade1-page">
      {/* Hero */}
      <div className="g1-hero">
        <div className="g1-hero-badge">Grade 1</div>
        <h1 className="g1-hero-title">
          <span className="g1-emoji-big">🎒</span>
          Let's Learn Together!
        </h1>
        <p className="g1-hero-sub">Choose a topic to start your math adventure</p>
      </div>

      {/* Module grid */}
      <div className="module-grid">
        {MODULES.map((mod, idx) => (
          mod.available ? (
            <Link
              key={mod.id}
              to={`/grade/1/${mod.id}`}
              className={`module-card color-${mod.color} available`}
              style={{ animationDelay: `${idx * 0.08}s` }}
              aria-label={`${mod.title} module`}
            >
              <ModuleCardInner mod={mod} />
            </Link>
          ) : (
            <div
              key={mod.id}
              className={`module-card color-${mod.color} locked`}
              style={{ animationDelay: `${idx * 0.08}s` }}
              title={`${mod.title} — Coming Soon!`}
            >
              <ModuleCardInner mod={mod} locked />
            </div>
          )
        ))}
      </div>
    </main>
  );
}

function ModuleCardInner({ mod, locked }) {
  return (
    <>
      <div className="mc-top">
        <span className="mc-emoji">{locked ? '🔒' : mod.emoji}</span>
        {!locked && <span className="mc-available-chip">Available!</span>}
      </div>
      <h2 className="mc-title">{mod.title}</h2>
      <p className="mc-desc">{mod.desc}</p>
      {!locked ? (
        <span className="mc-play">Start Learning →</span>
      ) : (
        <span className="mc-soon">Coming Soon</span>
      )}
    </>
  );
}
