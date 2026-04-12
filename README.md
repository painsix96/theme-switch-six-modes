# 🌙 Theme Switch — Six Modes

> **Six atmospheric theme modes for any React + Vite project.**  
> Night · Moonlight · Day · Sunny · Rainy · Snowy

![Six Modes](https://img.shields.io/badge/modes-6-blue) ![React](https://img.shields.io/badge/React-18+-61DAFB) ![Vite](https://img.shields.io/badge/Vite-5+-646CFF) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Preview

| Mode | Key | Effect | Sound |
|------|-----|--------|-------|
| 🌑 **Night** | `N` | Deep dark (#080808) | — |
| 🌙 **Moonlight** | `M` | Moon + 150 twinkling stars + craters | Crickets |
| ☀️ **Day** | `D` | Warm cream (#f2efe9) | — |
| 🍂 **Sunny** | `S` | Day + falling leaves video | Forest ambience |
| 🌧️ **Rainy** | `R` | Grey-blue rain + fog | Rain + thunder + drips |
| ❄️ **Snowy** | `W` | Winter white + 268 snowflakes | Wind + snow howl |

**Live Demo:** [theme-switch.pages.dev](https://theme-switch.pages.dev/)

---

## 🚀 Quick Start

```bash
git clone https://github.com/painsix96/theme-switch-six-modes.git
cd theme-switch-six-modes
npm install
npm run dev
# Press N M D S R W to switch modes!
```

---

## 🎨 How It Works

### CSS Houdini `@property` — Smooth Color Transitions
The browser interpolates between colors with **400ms ease transition** — no JS needed!

### Canvas Atmospheric Effects
- **Moon**: 320px supersampled → 56px display. 6 render layers
- **Stars**: 150 multi-color-temp stars with flicker + flash
- **Rain**: 180 drops in 3 depth layers + fog
- **Snow**: 268 hexagonal flakes with gust wind system
- **Leaves**: MP4 video overlay

### Web Audio API — Procedural Soundscapes
All sounds synthesized in real-time (except forest.mp3):
- **Moonlight**: Bandpass noise → crickets
- **Sunny**: Forest ambience audio
- **Rainy**: 3-layer pink noise + thunder + drips
- **Snowy**: 4-layer wind noise + LFO modulators

---

## 🔧 Add to Your Project

Copy `src/` files into your React+Vite project, wrap your App in `<ThemeProvider>`, and use `var(--bg)` / `var(--text)` CSS variables.

See full docs in the source code README.

---

## ⌨️ Shortcuts

| Key | Mode |
|-----|------|
| `N` | Night | `M` | Moonlight | `D` | Day | `S` | Sunny | `R` | Rainy | `W` | Snowy |

---

## 🌐 Browser Support

✅ Chrome 85+, Edge 85+, Firefox 90+, Safari 16+

---

📝 MIT License — Free for personal and commercial use.