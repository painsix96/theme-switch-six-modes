export const MODES = {
  night: { name: 'Night', key: 'n' },
  midnight: { name: 'Moonlight', key: 'm' },
  day: { name: 'Day', key: 'd' },
  sunny: { name: 'Sunny', key: 's' },
  rain: { name: 'Rainy', key: 'r' },
  snow: { name: 'Snowy', key: 'w' },
};

export const MODE_ORDER = ['night', 'midnight', 'day', 'sunny', 'rain', 'snow'];

const AUDIO_MODES = new Set(['midnight', 'sunny', 'rain', 'snow']);

export class ThemeEngine {
  constructor(options = {}) {
    this._mode = options.defaultMode || 'day';
    this._audioEnabled = options.audioEnabled !== false;
    this._listeners = {};
    this._keyHandler = null;
    this._toastTimer = null;
    this.init();
  }

  get mode() { return this._mode; }
  get audioEnabled() { return this._audioEnabled; }
  get hasAudio() { return AUDIO_MODES.has(this._mode); }

  init() {
    document.body.className = `mode-${this._mode}`;
    this._bindKeyboard();
  }

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    };
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }

  switchMode(newMode) {
    if (!MODES[newMode]) return;
    this._mode = newMode;
    document.body.className = `mode-${newMode}`;
    this._emit('modeChange', { mode: newMode, name: MODES[newMode].name });
    this._showToast(MODES[newMode].name);
  }

  toggleAudio() {
    this._audioEnabled = !this._audioEnabled;
    this._emit('audioToggle', { enabled: this._audioEnabled });
    return this._audioEnabled;
  }

  _showToast(label) {
    this._emit('toast', { label });
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this._emit('toastHide'), 1500);
  }

  _bindKeyboard() {
    const keyMap = { n: 'night', m: 'midnight', d: 'day', s: 'sunny', r: 'rain', w: 'snow' };
    this._keyHandler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const target = keyMap[e.key.toLowerCase()];
      if (target) this.switchMode(target);
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  destroy() {
    window.removeEventListener('keydown', this._keyHandler);
    clearTimeout(this._toastTimer);
    this._listeners = {};
  }
}
