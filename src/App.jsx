import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Grade1 from './pages/Grade1';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrowserRouter basename="/MathApp">
          <Header />
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
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}
