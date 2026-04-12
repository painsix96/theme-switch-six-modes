import { MODE_ORDER, MODES } from './theme-engine.js';

export function createModeIndicator(engine) {
  const el = document.createElement('div'); el.className = 'mode-indicator';
  el.setAttribute('role', 'tablist'); el.setAttribute('aria-label', 'Theme mode selector');
  MODE_ORDER.forEach(m => {
    const btn = document.createElement('button'); btn.className = 'mode-dot';
    btn.setAttribute('role', 'tab'); btn.title = `${m} [${MODES[m].key.toUpperCase()}]`;
    btn.onclick = () => engine.switchMode(m); el.appendChild(btn);
  });
  const unbind = engine.on('modeChange', ({ mode }) => {
    el.querySelectorAll('.mode-dot').forEach((dot, i) => {
      dot.classList.toggle('active', MODE_ORDER[i] === mode);
      dot.setAttribute('aria-selected', MODE_ORDER[i] === mode);
    });
  });
  const style = document.createElement('style');
  style.textContent = `
    .mode-indicator{position:fixed;top:20px;right:20px;display:flex;gap:8px;z-index:1000;padding:8px 12px;border-radius:999px;background:color-mix(in srgb,var(--bg)70%,transparent);border:1px solid var(--line);backdrop-filter:blur(12px)}
    .mode-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--mid);background:transparent;transition:all 250ms ease;cursor:pointer}
    .mode-dot:hover{border-color:var(--accent);transform:scale(1.2)}
    .mode-dot.active{background:var(--accent);border-color:var(--accent);box-shadow:0 0 8px color-mix(in srgb,var(--accent)40%,transparent)}
    .mode-dot.active::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid color-mix(in srgb,var(--accent)30%,transparent);animation:dotPulse 2s ease-in-out infinite}`;
  el.appendChild(style);
  return { el, destroy: () => { unbind(); el.remove(); } };
}

export function createModeToast(engine) {
  const el = document.createElement('div'); el.className = 'mode-toast';
  const labelEl = document.createElement('span'); labelEl.className = 'toast-label'; el.appendChild(labelEl);
  const style = document.createElement('style');
  style.textContent = `.mode-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%)translateY(16px);padding:8px 20px;border-radius:999px;font-size:.82rem;font-weight:500;color:var(--text);background:color-mix(in srgb,var(--bg)80%,transparent);border:1px solid var(--line);backdrop-filter:blur(12px);opacity:0;transition:all 350ms cubic-bezier(.4,0,.2,1);z-index:1000}.mode-toast.visible{opacity:1;transform:translateX(-50%)translateY(0)}`;
  el.appendChild(style);
  const unbindShow = engine.on('toast', ({ label }) => { labelEl.textContent = label; el.classList.add('visible'); });
  const unbindHide = engine.on('toastHide', () => el.classList.remove('visible'));
  return { el, destroy: () => { unbindShow(); unbindHide(); el.remove(); } };
}

export function createAudioToggle(engine, audioEngineModule) {
  const el = document.createElement('button'); el.className = 'audio-toggle';
  el.setAttribute('aria-label', 'Toggle ambient audio'); el.title = 'Toggle ambient audio';
  el.innerHTML = '&#9835;';
  el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:1001;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--bg);color:var(--mid);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color 300ms,color 300ms`;
  const updateVisibility = ({ mode }) => { el.style.display = ['midnight','sunny','rain','snow'].includes(mode)?'flex':'none'; };
  const updateMute = ({ enabled }) => { el.classList.toggle('muted', !enabled); audioEngineModule?.setAudioEnabled(enabled); };
  el.addEventListener('click', () => engine.toggleAudio());
  const unbindVis = engine.on('modeChange', updateVisibility);
  const unbindMute = engine.on('audioToggle', updateMute);
  updateVisibility({ mode: engine.mode });
  return { el, destroy: () => { unbindVis(); unbindMute(); el.remove(); } };
}
