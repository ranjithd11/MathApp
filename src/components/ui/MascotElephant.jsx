import React, { useState, useEffect } from 'react';
import './MascotElephant.css';

const ACTIVITIES = ['thinking', 'reading', 'playing', 'eating', 'magnifying', 'running', 'sleeping'];

/* ─── Cute Kid SVG with mood-driven expressions ─── */
function KidSVG({ mood, activity }) {
  const isCorrect  = mood === 'correct';
  const isSad      = mood === 'wrong';
  const isSleeping = activity === 'sleeping' && mood === 'idle';
  const isRunning  = activity === 'running'  && mood === 'idle';

  // Shirt color changes on correct
  const shirtColor  = isCorrect ? '#FFD93D' : '#FF6B6B';
  const shirtAccent = isCorrect ? '#FFC200' : '#CC4848';

  // Arm rotation for running/celebrating
  const lArmRot = isCorrect ? -50 : isRunning ? -35 : 12;
  const rArmRot = isCorrect ? 50  : isRunning ? 35  : -12;

  return (
    <svg viewBox="0 0 120 178" xmlns="http://www.w3.org/2000/svg" className="elephant-svg">
      {/* Ground shadow */}
      <ellipse cx="60" cy="175" rx="26" ry="5.5" fill="rgba(0,0,0,0.12)" />

      {/* ── SHOES ── */}
      <ellipse cx="47" cy="165" rx="15" ry="8.5" fill="#E84040" />
      <ellipse cx="73" cy="165" rx="15" ry="8.5" fill="#E84040" />
      {/* Shoe highlight */}
      <ellipse cx="43" cy="162" rx="8"  ry="4"   fill="#FF7070" opacity="0.5" />
      <ellipse cx="69" cy="162" rx="8"  ry="4"   fill="#FF7070" opacity="0.5" />
      {/* Sole */}
      <ellipse cx="47" cy="167" rx="15" ry="4"   fill="#C43030" opacity="0.5" />
      <ellipse cx="73" cy="167" rx="15" ry="4"   fill="#C43030" opacity="0.5" />

      {/* ── LEGS (jeans) ── */}
      <rect x="43" y="128" width="17" height="34" rx="8.5" fill="#4A7AC4" />
      <rect x="60" y="128" width="17" height="34" rx="8.5" fill="#4972BC" />
      {/* Jeans seam */}
      <line x1="51.5" y1="128" x2="51.5" y2="162" stroke="#3A62B0" strokeWidth="1.2" />
      <line x1="68.5" y1="128" x2="68.5" y2="162" stroke="#3A62B0" strokeWidth="1.2" />

      {/* ── BODY (shirt) ── */}
      <ellipse cx="60" cy="112" rx="28" ry="27" fill={shirtColor} />
      {/* Shirt collar V */}
      <path d="M50 84 L60 95 L70 84" stroke="white" strokeWidth="2.5"
            fill="rgba(255,255,255,0.3)" strokeLinecap="round" strokeLinejoin="round" />
      {/* Shirt buttons */}
      <circle cx="60" cy="98"  r="2.5" fill={shirtAccent} opacity="0.8" />
      <circle cx="60" cy="107" r="2.5" fill={shirtAccent} opacity="0.8" />
      <circle cx="60" cy="116" r="2.5" fill={shirtAccent} opacity="0.8" />

      {/* ── LEFT ARM ── */}
      <g style={{ transformOrigin: '38px 100px', transform: `rotate(${lArmRot}deg)` }}>
        <ellipse cx="32" cy="112" rx="9.5" ry="21" fill="#FFBE8A" />
        {/* Left hand */}
        <circle cx="29" cy="131" r="9"  fill="#FFBE8A" />
        <circle cx="22" cy="128" r="5"  fill="#FFBE8A" />
        <circle cx="25" cy="138" r="4.5" fill="#FFBE8A" />
        <circle cx="33" cy="140" r="4.5" fill="#FFBE8A" />
        <circle cx="37" cy="135" r="4.5" fill="#FFBE8A" />
      </g>

      {/* ── RIGHT ARM ── */}
      <g style={{ transformOrigin: '82px 100px', transform: `rotate(${-rArmRot}deg)` }}>
        <ellipse cx="88" cy="112" rx="9.5" ry="21" fill="#FFBE8A" />
        {/* Right hand */}
        <circle cx="91" cy="131" r="9"  fill="#FFBE8A" />
        <circle cx="98" cy="128" r="5"  fill="#FFBE8A" />
        <circle cx="95" cy="138" r="4.5" fill="#FFBE8A" />
        <circle cx="87" cy="140" r="4.5" fill="#FFBE8A" />
        <circle cx="83" cy="135" r="4.5" fill="#FFBE8A" />
      </g>

      {/* ── NECK ── */}
      <rect x="53" y="76" width="14" height="14" rx="6" fill="#FFBE8A" />

      {/* ── HEAD ── */}
      <circle cx="60" cy="50" r="36" fill="#FFD0A0" />

      {/* ── HAIR ── */}
      {/* Hair base (back) */}
      <ellipse cx="60" cy="18" rx="33" ry="20" fill="#3A2718" />
      {/* Hair sides */}
      <ellipse cx="28" cy="38" rx="11" ry="19" fill="#3A2718" />
      <ellipse cx="92" cy="38" rx="11" ry="19" fill="#3A2718" />
      {/* Hair front — cowlick */}
      <ellipse cx="44" cy="24" rx="9"  ry="7"  fill="#4A3228" />
      <ellipse cx="76" cy="24" rx="9"  ry="7"  fill="#4A3228" />
      <ellipse cx="60" cy="19" rx="10" ry="6"  fill="#4A3228" />
      {/* Cute cowlick strand */}
      <path d="M56 15 Q60 6 66 12" stroke="#3A2718" strokeWidth="4.5"
            fill="none" strokeLinecap="round" />

      {/* ── EARS ── */}
      <circle cx="26" cy="52" r="10" fill="#F5B07A" />
      <circle cx="94" cy="52" r="10" fill="#F5B07A" />
      <circle cx="26" cy="52" r="6"  fill="#FFAEC0" opacity="0.4" />
      <circle cx="94" cy="52" r="6"  fill="#FFAEC0" opacity="0.4" />

      {/* ── CHEEKS ── */}
      <circle cx="39" cy="63" r="10" fill="#FF8FAB" opacity="0.32" />
      <circle cx="81" cy="63" r="10" fill="#FF8FAB" opacity="0.32" />

      {/* ── EYES ── */}
      {isSleeping ? (
        /* Sleeping — curved shut lines */
        <>
          <path d="M42 46 Q51 41 60 46" stroke="#3A2718" strokeWidth="3.2"
                fill="none" strokeLinecap="round" />
          <path d="M60 46 Q69 41 78 46" stroke="#3A2718" strokeWidth="3.2"
                fill="none" strokeLinecap="round" />
          {/* Lashes */}
          <path d="M44 46 Q43 42 41 41" stroke="#3A2718" strokeWidth="1.5"
                fill="none" strokeLinecap="round" />
          <path d="M76 46 Q77 42 79 41" stroke="#3A2718" strokeWidth="1.5"
                fill="none" strokeLinecap="round" />
        </>
      ) : isCorrect ? (
        /* ★ Star eyes */
        <>
          <circle cx="50" cy="47" r="12" fill="white" />
          <text x="50" y="53" textAnchor="middle" fontSize="16" fill="#FFD93D">★</text>
          <circle cx="70" cy="47" r="12" fill="white" />
          <text x="70" y="53" textAnchor="middle" fontSize="16" fill="#FFD93D">★</text>
        </>
      ) : isSad ? (
        /* Sad droopy eyes */
        <>
          <circle cx="50" cy="49" r="11" fill="white" />
          <circle cx="50" cy="51" r="7"  fill="#2A2A48" />
          <circle cx="51.5" cy="48.5" r="2.5" fill="white" />
          <circle cx="70" cy="49" r="11" fill="white" />
          <circle cx="70" cy="51" r="7"  fill="#2A2A48" />
          <circle cx="71.5" cy="48.5" r="2.5" fill="white" />
          {/* Sad brows — angled down toward nose */}
          <path d="M41 37 Q50 42 59 38" stroke="#3A2718" strokeWidth="2.8"
                fill="none" strokeLinecap="round" />
          <path d="M61 38 Q70 42 79 37" stroke="#3A2718" strokeWidth="2.8"
                fill="none" strokeLinecap="round" />
          {/* Tears */}
          <ellipse cx="45" cy="63" rx="3" ry="6" fill="#7EC8E3" opacity="0.8"
                   className="tear-drop tear-l" />
          <ellipse cx="75" cy="63" rx="3" ry="6" fill="#7EC8E3" opacity="0.8"
                   className="tear-drop tear-r" />
        </>
      ) : (
        /* Normal happy eyes */
        <>
          <circle cx="50" cy="47" r="11.5" fill="white" />
          <circle cx="51"   cy="48.5" r="7"   fill="#2A2A48" />
          <circle cx="53"   cy="46"   r="2.5" fill="white" />
          <circle cx="70" cy="47" r="11.5" fill="white" />
          <circle cx="71"   cy="48.5" r="7"   fill="#2A2A48" />
          <circle cx="73"   cy="46"   r="2.5" fill="white" />
          {/* Happy brows — slight arch */}
          <path d="M42 36 Q51 32 60 36" stroke="#3A2718" strokeWidth="2.8"
                fill="none" strokeLinecap="round" />
          <path d="M60 36 Q69 32 78 36" stroke="#3A2718" strokeWidth="2.8"
                fill="none" strokeLinecap="round" />
        </>
      )}

      {/* ── NOSE ── */}
      <ellipse cx="60" cy="60" rx="3.5" ry="3" fill="#E8A070" opacity="0.55" />

      {/* ── MOUTH ── */}
      {isCorrect ? (
        /* Big open grin */
        <path d="M46 70 Q60 83 74 70" stroke="#D05030" strokeWidth="3"
              fill="rgba(255,140,110,0.25)" strokeLinecap="round" />
      ) : isSad ? (
        /* Sad frown */
        <path d="M46 76 Q60 68 74 76" stroke="#D05030" strokeWidth="2.8"
              fill="none" strokeLinecap="round" />
      ) : isSleeping ? (
        /* Slight open sleepy mouth */
        <ellipse cx="60" cy="73" rx="6" ry="4" fill="#E07050" opacity="0.4" />
      ) : (
        /* Happy smile */
        <path d="M46 70 Q60 82 74 70" stroke="#D05030" strokeWidth="2.8"
              fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* ─── Activity overlay floating near the kid ─── */
function ActivityBubble({ activity, mood }) {
  if (mood === 'correct') {
    return (
      <div className="mascot-overlay celebration-burst">
        <span className="cel-star s1">⭐</span>
        <span className="cel-star s2">🎉</span>
        <span className="cel-star s3">🏆</span>
        <span className="cel-star s4">✨</span>
        <span className="cel-star s5">🌟</span>
      </div>
    );
  }
  if (mood === 'wrong') {
    return (
      <div className="mascot-overlay sad-overlay">
        <span className="sad-msg">Oops! 😢</span>
      </div>
    );
  }

  const map = {
    thinking:   { icon: '💭', label: 'Hmm...', cls: 'bubble-float' },
    reading:    { icon: '📚', label: '',        cls: 'item-sway'   },
    playing:    { icon: '⚽', label: '',        cls: 'item-bounce' },
    eating:     { icon: '🍪', label: 'Yum!',   cls: 'item-chomp'  },
    magnifying: { icon: '🔍', label: '',        cls: 'item-scan'   },
    running:    { icon: '💨', label: '',        cls: 'item-zoom'   },
    sleeping:   { icon: '💤', label: 'Zzz…',   cls: 'bubble-float zzz-float' },
  };

  const cfg = map[activity] || map.thinking;
  return (
    <div className={`mascot-overlay activity-overlay ${cfg.cls}`}>
      <span className="activity-icon">{cfg.icon}</span>
      {cfg.label && <span className="activity-label">{cfg.label}</span>}
    </div>
  );
}

/* ─── Main exported component ─── */
export default function MascotElephant({ status, timedOut, timerRunning }) {
  const [activity, setActivity]       = useState('thinking');
  const [celebrating, setCelebrating] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const mood = status === 'correct'              ? 'correct'
             : (status === 'wrong' || timedOut)  ? 'wrong'
             : 'idle';

  /* Cycle activities while timer ticks */
  useEffect(() => {
    if (!timerRunning || mood !== 'idle') return;
    const rotate = () => setActivity(prev => {
      const others = ACTIVITIES.filter(a => a !== prev);
      return others[Math.floor(Math.random() * others.length)];
    });
    const id = setInterval(rotate, 3000);
    return () => clearInterval(id);
  }, [timerRunning, mood]);

  /* Fly to center on correct */
  useEffect(() => {
    if (status === 'correct') {
      setCelebrating(true);
      setShowBackdrop(true);
    } else {
      setCelebrating(false);
      setShowBackdrop(false);
    }
  }, [status]);

  const wrapClass = [
    'mascot-wrap',
    celebrating ? 'mascot-center' : 'mascot-corner',
    `mood-${mood}`,
    !celebrating && mood === 'idle' ? `activity-${activity}` : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {showBackdrop && <div className="mascot-backdrop" />}

      <div className={wrapClass} aria-label="Kid Mascot" role="img">
        <KidSVG mood={mood} activity={activity} />
        <ActivityBubble activity={activity} mood={mood} />

        {celebrating && (
          <div className="celebrate-label animate-bounce-in">
            🎉 Correct! Amazing!
          </div>
        )}

        {!celebrating && (
          <div className="mascot-tooltip">
            {mood === 'wrong' ? '😢 Try again!' : '👧 Hi, I\'m Sam!'}
          </div>
        )}
      </div>
    </>
  );
}
