import { useEffect, useState, useRef } from 'react';
import { useTheme, MODES } from '../context/ThemeContext';

export default function ModeToast() {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (!mode) return;
    setLabel(MODES[mode]?.name || mode);
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [mode]);

  return (
    <div className={`mode-toast ${visible ? 'visible' : ''}`}>
      <span className="toast-label">{label}</span>
      <style>{`
        .mode-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);padding:8px 20px;border-radius:999px;font-size:0.82rem;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;color:var(--text);background:color-mix(in srgb,var(--bg)80%,transparent);border:1px solid var(--line);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);opacity:0;transition:all 350ms cubic-bezier(0.4,0,0.2,1);z-index:1000;pointer-events:none;white-space:nowrap}
        .mode-toast.visible{opacity:1;transform:translateX(-50%) translateY(0)}
        .toast-label{opacity:0.85}
      `}</style>
    </div>
  );
}