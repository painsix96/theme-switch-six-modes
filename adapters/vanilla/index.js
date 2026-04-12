import { ThemeEngine } from '../core/theme-engine.js';
import { startAudioForMode, stopAllAudio, setAudioEnabled } from '../core/audio-engine.js';
import { MoonOverlay } from '../core/canvas-moon.js';
import { RainOverlay } from '../core/canvas-rain.js';
import { SnowOverlay } from '../core/canvas-snow.js';
import { LeavesOverlay } from '../core/leaves-overlay.js';
import { createModeIndicator, createModeToast, createAudioToggle } from '../core/ui-helpers.js';

let engine = null;
const overlays = {};
const uiElements = [];

export function initThemeSwitch(options = {}) {
  if (engine) destroy();
  engine = new ThemeEngine(options);
  const overlayContainer = options.overlayContainer || document.body;
  overlays.moon = new MoonOverlay(document.createElement('div'));
  overlayContainer.appendChild(overlays.moon.container);
  overlays.rain = new RainOverlay(document.createElement('div'));
  overlayContainer.appendChild(overlays.rain.container);
  overlays.snow = new SnowOverlay(document.createElement('div'));
  overlayContainer.appendChild(overlays.snow.container);
  overlays.leaves = new LeavesOverlay(document.createElement('div'));
  overlayContainer.appendChild(overlays.leaves.container);
  uiElements.push(createModeIndicator(engine));
  uiElements.push(createModeToast(engine));
  uiElements.push(createAudioToggle(engine, { setAudioEnabled }));
  engine.on('modeChange', ({ mode }) => {
    Object.keys(overlays).forEach(key => overlays[key].deactivate());
    const map = { midnight: 'moon', rain: 'rain', snow: 'snow', sunny: 'leaves' };
    if (map[mode]) overlays[map[mode]].activate();
    startAudioForMode(mode);
  });
  const currentMap = { midnight: 'moon', rain: 'rain', snow: 'snow', sunny: 'leaves' };
  if (currentMap[engine.mode]) overlays[currentMap[engine.mode]].activate();
  startAudioForMode(engine.mode);
  return engine;
}

export function destroy() {
  if (!engine) return;
  Object.values(overlays).forEach(o => o.deactivate());
  Object.values(overlays).forEach(o => o.container?.remove?.());
  uiElements.forEach(u => u.destroy?.());
  engine.destroy(); engine = null;
}
export { ThemeEngine };