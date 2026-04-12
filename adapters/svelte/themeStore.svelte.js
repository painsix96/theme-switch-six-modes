import { writable, derived } from 'svelte/store';
import { ThemeEngine, MODES, MODE_ORDER } from '../../core/theme-engine.js';
export function createThemeStore(options = {}) {
  const engine = new ThemeEngine(options);
  const mode = writable(engine.mode);
  const audioEnabled = writable(engine.audioEnabled);
  const toastLabel = writable('');
  engine.on('modeChange', ({ mode: m }) => mode.set(m));
  engine.on('audioToggle', ({ enabled }) => audioEnabled.set(enabled));
  engine.on('toast', ({ label }) => toastLabel.set(label));
  engine.on('toastHide', () => toastLabel.set(''));
  return { engine, mode, audioEnabled, toastLabel,
    switchMode: (m) => engine.switchMode(m),
    toggleAudio: () => engine.toggleAudio(),
    destroy: () => engine.destroy()
  };
}
export { MODES, MODE_ORDER };