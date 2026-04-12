import { useEffect, useRef } from 'react';
import { useTheme, MODE_ORDER } from './ThemeProvider.jsx';
import { createModeIndicator } from '../../core/ui-helpers.js';
export default function ModeIndicatorReact() {
  const { engine } = useTheme(); const hostRef = useRef(null);
  useEffect(() => {
    if (!hostRef.current || !engine) return;
    const { el } = createModeIndicator(engine); hostRef.current.appendChild(el);
  }, [engine]);
  return <div ref={hostRef} />;
}