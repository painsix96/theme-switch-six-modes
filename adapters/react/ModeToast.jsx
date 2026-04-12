import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { createModeToast } from '../../core/ui-helpers.js';
export default function ModeToastReact() {
  const { engine } = useTheme(); const hostRef = useRef(null);
  useEffect(() => {
    if (!hostRef.current || !engine) return;
    const { el } = createModeToast(engine); hostRef.current.appendChild(el);
  }, [engine]);
  return <div ref={hostRef} />;
}