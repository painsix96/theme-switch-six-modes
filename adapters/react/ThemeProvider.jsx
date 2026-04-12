import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ThemeEngine, MODES, MODE_ORDER } from '../../core/theme-engine.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, options = {} }) {
  const [engine] = useState(() => new ThemeEngine(options));
  const [mode, setMode] = useState(engine.mode);
  const [audioEnabled, setAudioEnabled] = useState(engine.audioEnabled);
  const [toastLabel, setToastLabel] = useState('');
  useEffect(() => {
    const unbindMode = engine.on('modeChange', ({ mode: m }) => setMode(m));
    const unbindAudio = engine.on('audioToggle', ({ enabled }) => setAudioEnabled(enabled));
    const unbindToast = engine.on('toast', ({ label }) => { setToastLabel(label); });
    const unbindHide = engine.on('toastHide', () => setToastLabel(''));
    return () => { unbindMode(); unbindAudio(); unbindToast(); unbindHide(); };
  }, [engine]);
  const switchMode = useCallback((m) => engine.switchMode(m), [engine]);
  const toggleAudio = useCallback(() => engine.toggleAudio(), [engine]);
  return (
    <ThemeContext.Provider value={{ mode, switchMode, audioEnabled, toggleAudio, toastLabel, engine }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
export { MODES, MODE_ORDER };