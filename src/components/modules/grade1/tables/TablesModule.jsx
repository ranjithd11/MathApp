import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableSelection from './TableSelection';
import TablePractice from './TablePractice';
import TableAnimationPopup from './TableAnimationPopup';
import { FiInfo } from 'react-icons/fi';
import './Tables.css';

export default function TablesModule() {
  const [activeTable, setActiveTable] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (activeTable) {
      setActiveTable(null); // go back to table selection
    } else {
      navigate('/grade/1'); // go back to grade hub
    }
  };

  return (
    <div className="tables-module">
      <div className="module-header">
        <button className="back-btn" onClick={handleBack} aria-label="Go back">
          ← Back
        </button>
        <h2 className="module-title">
          {activeTable ? (
            <span className="title-with-info">
              Table of {activeTable}
              <button
                className="tp-info-heading-btn"
                onClick={() => setShowPopup(true)}
                aria-label="Show animated table"
                title="Show Animation"
              >
                <FiInfo size={22} />
              </button>
            </span>
          ) : (
            'Times Tables'
          )}
        </h2>
        <div className="spacer"></div>
      </div>

      <div className="module-content">
        {!activeTable ? (
          <TableSelection onSelectTable={setActiveTable} />
        ) : (
          <TablePractice tableNum={activeTable} onBack={() => setActiveTable(null)} />
        )}
      </div>
      {showPopup && activeTable && (
        <TableAnimationPopup
          tableNum={activeTable}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
