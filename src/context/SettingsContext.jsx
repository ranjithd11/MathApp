import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const DEFAULTS = {
  timerDuration: 30,   // seconds per question (0 = no timer)
  soundEnabled: true,
  timerEnabled: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('mathapp-settings');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mathapp-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
