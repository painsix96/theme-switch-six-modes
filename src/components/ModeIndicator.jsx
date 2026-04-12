import { useTheme, MODE_ORDER } from '../context/ThemeContext';

export default function ModeIndicator() {
  const { mode, switchMode } = useTheme();
  const keyMap = ['N','M','D','S','R','W'];

  return (
    <div className="mode-indicator" role="tablist" aria-label="Theme mode selector">
      {MODE_ORDER.map((m, i) => (
        <button key={m} role="tab" aria-selected={mode === m} aria-label={`Switch to ${m} mode`}
          className={`mode-dot ${mode === m ? 'active' : ''}`}
          onClick={() => switchMode(m)} title={`${m} [${keyMap[i]}]`} />
      ))}
      <style>{`
        .mode-indicator{position:fixed;top:20px;right:20px;display:flex;gap:8px;z-index:1000;padding:8px 12px;border-radius:999px;background:color-mix(in srgb,var(--bg)70%,transparent);border:1px solid var(--line);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
        .mode-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--mid);background:transparent;transition:all 250ms ease;position:relative}
        .mode-dot:hover{border-color:var(--accent);transform:scale(1.2)}
        .mode-dot.active{background:var(--accent);border-color:var(--accent);box-shadow:0 0 8px color-mix(in srgb,var(--accent)40%,transparent)}
        .mode-dot.active::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid color-mix(in srgb,var(--accent)30%,transparent);animation:dotPulse 2s ease-in-out infinite}
        @keyframes dotPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.3);opacity:0}}
      `}</style>
    </div>
  );
}