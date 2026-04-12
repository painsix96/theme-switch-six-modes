import { useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { LeavesOverlay } from '../../core/leaves-overlay.js';
export default function LeavesOverlayReact() {
  const { mode } = useTheme();
  const containerRef = useRef(null); const overlayRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    if (!overlayRef.current) overlayRef.current = new LeavesOverlay(containerRef.current);
    if (mode === 'sunny') overlayRef.current.activate(); else overlayRef.current.deactivate();
  }, [mode]);
  return <div ref={containerRef} />;
}