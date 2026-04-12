import { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { RainOverlay } from '../../core/canvas-rain.js';
export default function RainOverlayReact() {
  const { mode } = useTheme();
  const containerRef = useRef(null); const overlayRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    if (!overlayRef.current) overlayRef.current = new RainOverlay(containerRef.current);
    if (mode === 'rain') overlayRef.current.activate(); else overlayRef.current.deactivate();
  }, [mode]);
  return <div ref={containerRef} />;
}