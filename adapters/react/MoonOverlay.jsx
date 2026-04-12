import { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { MoonOverlay } from '../../core/canvas-moon.js';
export default function MoonOverlayReact() {
  const { mode, engine } = useTheme();
  const containerRef = useRef(null); const overlayRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    if (!overlayRef.current) overlayRef.current = new MoonOverlay(containerRef.current);
    const ov = overlayRef.current;
    if (mode === 'midnight') ov.activate(); else ov.deactivate();
  }, [mode]);
  return <div ref={containerRef} />;
}