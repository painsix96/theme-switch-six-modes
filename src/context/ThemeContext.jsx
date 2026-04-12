import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export const MODES = {
  night: { name: 'Night', key: 'n' },
  midnight: { name: 'Moonlight', key: 'm' },
  day: { name: 'Day', key: 'd' },
  sunny: { name: 'Sunny', key: 's' },
  rain: { name: 'Rainy', key: 'r' },
  snow: { name: 'Snowy', key: 'w' },
};

export const MODE_ORDER = ['night', 'midnight', 'day', 'sunny', 'rain', 'snow'];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('day');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [toastLabel, setToastLabel] = useState('');

  const switchMode = useCallback((newMode) => {
    if (!MODES[newMode]) return;
    setMode(newMode);
    document.body.className = `mode-${newMode}`;
    setToastLabel(MODES[newMode].name);
    setTimeout(() => setToastLabel(''), 1500);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const keyMap = { n: 'night', m: 'midnight', d: 'day', s: 'sunny', r: 'rain', w: 'snow' };
      if (keyMap[e.key.toLowerCase()]) switchMode(keyMap[e.key.toLowerCase()]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchMode]);

  useEffect(() => { document.body.className = `mode-${mode}`; }, []);

  const toggleAudio = useCallback(() => setAudioEnabled(prev => !prev), []);
  const value = { mode, switchMode, audioEnabled, toggleAudio, toastLabel };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
export default ThemeContext;