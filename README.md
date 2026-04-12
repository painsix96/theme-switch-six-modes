# 🌙 Theme Switch — Six Modes

<p align="center">
  <b>Six atmospheric theme modes for any React + Vite project.</b><br>
  Night · Moonlight · Day · Sunny · Rainy · Snowy
</p>

<p align="center">
  <img src="https://img.shields.io/badge/modes-6-blue" />
  <img src="https://img.shields.io/badge/React-18+-61DAFB" />
  <img src="https://img.shields.io/badge/Vite-5+-646CFF" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

<p align="center">
  <a href="#english"><b>English</b></a> &nbsp;|&nbsp; <a href="#中文"><b>中文</b></a>
</p>

---

<a id="english"></a>

## English

### ✨ Preview

| Mode | Key | Effect | Sound |
|------|-----|--------|-------|
| 🌑 **Night** | `N` | Deep dark (#080808) | — |
| 🌙 **Moonlight** | `M` | Moon + 150 twinkling stars + craters | Crickets |
| ☀️ **Day** | `D` | Warm cream (#f2efe9) | — |
| 🍂 **Sunny** | `S` | Day + falling leaves video | Forest ambience |
| 🌧️ **Rainy** | `R` | Grey-blue rain + fog | Rain + thunder + drips |
| ❄️ **Snowy** | `W` | Winter white + 268 snowflakes | Wind + snow howl |

**Live Demo:** [theme-switch.pages.dev](https://theme-switch.pages.dev/)

### 🚀 Quick Start

```bash
git clone https://github.com/painsix96/theme-switch-six-modes.git
cd theme-switch-six-modes
npm install
npm run dev
# Press N M D S R W to switch modes!
```

### 🎨 How It Works

**CSS Houdini `@property`** — Smooth Color Transitions  
The browser interpolates between colors with **400ms ease transition** — no JS needed!

**Canvas Atmospheric Effects**
- **Moon**: 320px supersampled → 56px display. 6 render layers (base gradient, maria, craters, terminator shadow, earthshine, limb darkening)
- **Stars**: 150 multi-color-temp stars with flicker + flash animations
- **Rain**: 180 drops in 3 depth layers + splash particles + fog layer
- **Snow**: 268 hexagonal flakes with nonlinear gust wind system + motion trails
- **Leaves**: MP4 video overlay with multiply blend mode

**Web Audio API** — Procedural Soundscapes  
All sounds synthesized in real-time (except forest.mp3):
- **Moonlight**: Bandpass-filtered noise → cricket chirps (4000Hz, Q=15)
- **Sunny**: Forest ambience audio playback
- **Rainy**: 3-layer pink noise + scheduled thunder events + drip splashes
- **Snowy**: 4-layer wind noise + 3 LFO sine modulators

### 🔧 Add to Your Project

Copy `src/` files into your React+Vite project, wrap your App in `<ThemeProvider>`, and use `var(--bg)` / `var(--text)` CSS variables.

See full docs in the source code comments.

### ⌨️ Shortcuts

| `N` Night | `M` Moonlight | `D` Day | `S` Sunny | `R` Rainy | `W` Snowy |

### 🌐 Browser Support

✅ Chrome 85+, Edge 85+, Firefox 90+, Safari 16+

---

📝 MIT License — Free for personal and commercial use.

<p align="right"><a href="#">↑ Back to Top</a></p>

---

<a id="中文"></a>

## 中文

### ✨ 预览

| 模式 | 快捷键 | 视觉效果 | 音效 |
|------|--------|----------|------|
| 🌑 **深夜 Night** | `N` | 深邃暗色 (#080808) | — |
| 🌙 **月光 Midnight** | `M` | 月亮 + 150颗闪烁星星 + 环形山 | 虫鸣 |
| ☀️ **白昼 Day** | `D` | 温暖米色 (#f2efe9) | — |
| 🍂 **晴朗 Sunny** | `S` | 白昼 + 落叶视频叠加 | 森林环境音 |
| 🌧️ **雨天 Rainy** | `R` | 灰蓝雨幕 + 雾气 | 雨声 + 雷声 + 水滴 |
| ❄️ **雪天 Snowy** | `W` | 冬季纯白 + 268片雪花飘落 | 风声 + 呼啸雪声 |

**在线演示：** [theme-switch.pages.dev](https://theme-switch.pages.dev/)

### 🚀 快速开始

```bash
git clone https://github.com/painsix96/theme-switch-six-modes.git
cd theme-switch-six-modes
npm install
npm run dev
# 按键盘 N M D S R W 切换主题模式！
```

### 🎨 实现原理

**CSS Houdini `@property`** — 平滑颜色过渡  
浏览器对颜色变量进行 **400ms 缓动插值过渡**，无需 JavaScript 参与！

**Canvas 大气特效层**
- **月亮**：320px 超采样渲染 → 56px 显示半径，6 层渲染（基底渐变、月海、环形山、明暗界线、地球光、边缘变暗）
- **星星**：150 颗多色温星星，带闪烁和闪光动画
- **雨滴**：180 个雨滴分 3 层深度 + 溅射粒子 + 雾气层
- **雪花**：268 片六角雪花，带非线性阵风系统 + 运动拖尾
- **落叶**：MP4 视频叠加层，multiply 混合模式

**Web Audio API** — 程序化音景  
所有声音均为实时合成（除 forest.mp3 外）：
- **月光模式**：带通滤波噪声 → 虫鸣效果（4000Hz，Q=15）
- **晴朗模式**：森林环境音频播放
- **雨天模式**：3 层粉红噪声 + 定时雷鸣事件 + 水滴溅射
- **雪天模式**：4 层风噪声 + 3 个 LFO 正弦调制器

### 🔧 集成到你的项目

将 `src/` 目录下的文件复制到你的 React+Vite 项目中，用 `<ThemeProvider>` 包裹你的 App，然后使用 `var(--bg)` / `var(--text)` 等 CSS 变量。

详细说明请查看源码中的注释。

### ⌨️ 快捷键

| `N` 深夜 | `M` 月光 | `D` 白昼 | `S` 晴朗 | `R` 雨天 | `W` 雪天 |

### 🌐 浏览器兼容性

✅ Chrome 85+, Edge 85+, Firefox 90+, Safari 16+

---

📝 MIT 许可证 — 个人和商业用途均可免费使用。

<p align="right"><a href="#">↑ 回到顶部</a></p>