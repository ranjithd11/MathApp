import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Grade1 from './pages/Grade1';
import Settings from './pages/Settings';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter basename="/MathApp">
          <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

          <div className="page-wrapper">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Mobile overlay — closes sidebar when tapping outside */}
            {sidebarOpen && (
              <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
            )}

            <main className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/grade/1" element={<Grade1 />} />
                <Route path="/grade/1/addition" element={<Grade1 activeModule="addition" />} />
                <Route path="/grade/1/subtraction" element={<Grade1 activeModule="subtraction" />} />
                <Route path="/grade/1/multiplication" element={<Grade1 activeModule="multiplication" />} />
                <Route path="/grade/1/division" element={<Grade1 activeModule="division" />} />
                <Route path="/grade/1/tables" element={<Grade1 activeModule="tables" />} />
                <Route path="/settings" element={<Settings />} />
                {/* Redirect unknown grades to home */}
                <Route path="/grade/:id" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}
