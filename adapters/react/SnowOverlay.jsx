import { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { SnowOverlay } from '../../core/canvas-snow.js';
export default function SnowOverlayReact() {
  const { mode } = useTheme();
  const containerRef = useRef(null); const overlayRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    if (!overlayRef.current) overlayRef.current = new SnowOverlay(containerRef.current);
    if (mode === 'snow') overlayRef.current.activate(); else overlayRef.current.deactivate();
  }, [mode]);
  return <div ref={containerRef} />;
}