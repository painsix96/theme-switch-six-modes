import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider.jsx';
import { createAudioToggle } from '../../core/ui-helpers.js';
import { setAudioEnabled } from '../../core/audio-engine.js';
export default function AudioToggleReact() {
  const { engine } = useTheme(); const hostRef = useRef(null);
  useEffect(() => {
    if (!hostRef.current || !engine) return;
    const { el } = createAudioToggle(engine, { setAudioEnabled }); hostRef.current.appendChild(el);
  }, [engine]);
  return <div ref={hostRef} />;
}