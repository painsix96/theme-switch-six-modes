---
name: "theme-switch-six-modes"
description: "为任意前端项目添加6种主题切换系统（Night/Moonlight/Day/Sunny/Rainy/Snowy），支持 React/Vue3/Svelte/Vanilla JS/Angular 等所有主流框架，自动检测项目技术栈并适配。含 CSS Houdini 平滑过渡、Canvas 氛围效果（月亮/星星/雨滴/雪花/落叶视频）、Web Audio API 环境音效合成。当用户说'使用这个技能'或需要多主题背景时调用此技能。"
---

# 六种主题背景切换系统 — 跨框架通用版

## 概述

**框架无关的六种主题切换系统**。核心逻辑完全脱离框架绑定，通过适配层支持任意前端技术栈。

### 架构

```
┌─────────────────────────────────────────────┐
│              你的应用 (任意框架)               │
│  React / Vue3 / Svelte / Angular / Vanilla   │
├─────────────────────────────────────────────┤
│            适配层 (Adapters)                  │
│  React组件 / Vue组件 / Svelte组件 / Vanilla   │
├─────────────────────────────────────────────┤
│            核心层 (Core) ← 框架无关           │
│  theme-engine │ audio-engine                │
│  canvas-moon │ canvas-rain │ canvas-snow    │
│  leaves-overlay │ ui-helpers                 │
├─────────────────────────────────────────────┤
│              CSS (原生, 无框架依赖)            │
│  themes.css (@property + 6套配色)             │
│  overlays.css (容器+氛围样式)                 │
└─────────────────────────────────────────────┘
```

### 六种模式

| 快捷键 | 模式 | 视觉效果 | 音效 |
|--------|------|----------|------|
| `N` | Night | 深邃暗夜 (#080808) | 无 |
| `M` | Moonlight | 月亮(6层渲染)+150颗星星 | 蟋蟀声 |
| `D` | Day | 温暖奶油色 (#f2efe9) | 无 |
| `S` | Sunny | 白昼+落叶视频(soft-light) | 森林环境音 |
| `R` | Rainy | 灰蓝雨幕+180雨滴+雾气 | 雨声+雷声+滴水 |
| `W` | Snowy | 冬日纯白+268六角雪花+阵风 | 风雪声+LFO调制 |

---

## 第一步：自动检测用户项目的框架

当用户说"使用这个技能"或类似请求时，**必须先执行以下检测流程**：

```javascript
// 检测优先级（按顺序检查，命中即停止）

function detectFramework(projectRoot) {
  // 1. 检查 package.json 的 dependencies/devDependencies
  const pkg = readJSON(`${projectRoot}/package.json`);
  if (pkg?.dependencies?.react || pkg?.devDependencies?.react) return 'react';
  if (pkg?.dependencies?.vue || pkg?.dependencies?.['vue@3'] || pkg?.devDependencies?.vue) return 'vue3';
  if (pkg?.dependencies?.svelte || pkg?.devDependencies?.svelte) return 'svelte';
  if (pkg?.dependencies?.['@angular/core']) return 'angular';

  // 2. 检查配置文件
  if (exists('angular.json')) return 'angular';
  if (exists('vite.config.js') || exists('vite.config.ts')) {
    // Vite 项目，继续用文件扩展名判断
  }

  // 3. 检查源码文件扩展名
  const srcFiles = glob('src/**/*.{jsx,tsx,vue,svelte,ts,js}');
  const hasJSX = srcFiles.some(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
  const hasVue = srcFiles.some(f => f.endsWith('.vue'));
  const hasSvelte = srcFiles.some(f => f.endsWith('.svelte'));
  if (hasVue && !hasJSX) return 'vue3';
  if (hasSvelte) return 'svelte';
  if (hasJSX) return 'react';

  // 4. 默认: 纯 HTML/JS 项目
  return 'vanilla';
}
```

**检测结果映射到适配目录：**

| 检测结果 | 使用适配层 | 目录 |
|----------|-----------|------|
| `react` | React 适配层 | `adapters/react/` |
| `vue3` | Vue3 适配层 | `adapters/vue3/` |
| `svelte` | Svelte 适配层 | `adapters/svelte/` |
| `angular` | Angular 适配层 (参考 Vanilla) | `adapters/vanilla/` |
| `vanilla` 或其他 | Vanilla JS 适配层 | `adapters/vanilla/` |

---

## 第二步：复制核心层文件到用户项目

无论什么框架，以下 **css/** 文件必须原样复制：

```
你的项目/
├── css/
│   ├── themes.css            ← [必须] @property + 6套配色
│   └── overlays.css          ← [必须] 容器+氛围样式
├── public/assets/
│   ├── leaves.mp4            ← [必须] Sunny 模式视频 (~33KB)
│   └── forest.mp3            ← [必须] Sunny 模式音频 (~1.9MB)
```

> ⚠️ **注意**：`core/` 目录下的 JS 文件（theme-engine.js、audio-engine.js 等）是 Vanilla JS 适配层使用的。React/Vue/Svelte 适配层已将核心逻辑内联到组件中，**不需要**复制 core/ 目录。

**资源文件下载命令（⚠️ 必须验证文件格式）：**

```bash
mkdir -p public/assets

# 方法 1：通过 GitHub API 下载并解码（推荐，避免 Base64 文本问题）
curl -sL "https://api.github.com/repos/painsix96/theme-switch-six-modes/contents/public/assets/leaves.mp4" | \
  python3 -c "import sys,json,base64; d=json.load(sys.stdin); open('public/assets/leaves.mp4','wb').write(base64.b64decode(d['content']))"

curl -sL "https://api.github.com/repos/painsix96/theme-switch-six-modes/contents/public/assets/forest.mp3" | \
  python3 -c "import sys,json,base64; d=json.load(sys.stdin); open('public/assets/forest.mp3','wb').write(base64.b64decode(d['content']))"

# 方法 2：直接 curl 下载（如果网络环境允许访问 raw.githubusercontent.com）
# curl -L -o public/assets/leaves.mp4 https://raw.githubusercontent.com/painsix96/theme-switch-six-modes/main/public/assets/leaves.mp4
# curl -L -o public/assets/forest.mp3 https://raw.githubusercontent.com/painsix96/theme-switch-six-modes/main/public/assets/forest.mp3

# ⚠️ 下载后必须验证文件是二进制格式，不是 Base64 文本！
file public/assets/leaves.mp4  # 应输出 "ISO Media, MP4..." 或类似
file public/assets/forest.mp3  # 应输出 "Audio file with ID3 version..." 或类似
# 如果输出 "ASCII text" 或 "UTF-8 Unicode text"，说明下载的是 Base64 编码文本，需要用方法 1 重新下载
```

---

## 第三步：根据检测结果选择适配方案

### 方案 A：React 项目

**复制适配文件：**
```
adapters/react/ → 你的项目/src/theme-switch/ (或直接放 src/)
├── ThemeProvider.jsx      ← Context Provider (替代原来的 ThemeContext.jsx)
├── MoonOverlay.jsx        ← 月亮组件
├── RainOverlay.jsx         ← 雨滴组件
├── SnowOverlay.jsx         ← 雪花组件
├── LeavesOverlay.jsx       ← 落叶组件
├── ModeIndicator.jsx       ← 圆点指示器
├── ModeToast.jsx           ← 模式提示
└── AudioToggle.jsx         ← 音频开关
```

**如果你的项目使用 TypeScript（.tsx 文件）：**
- 将所有 `.jsx` 文件重命名为 `.tsx`
- 在函数组件参数中添加类型注解，例如：
  - `ThemeProvider` → `({ children }: { children: React.ReactNode })`
  - 各 Overlay 组件无需额外类型（无 props）
- 如果项目启用了严格类型检查，可能需要为 `useRef` 添加泛型，例如 `useRef<HTMLCanvasElement>(null)`、`useRef<HTMLVideoElement>(null)`

**在你的入口 CSS 中引入：**
```css
/* 在 main.jsx 或 index.css 中 */
@import '../css/themes.css';
@import '../css/overlays.css';
```

**修改 App.jsx（⚠️ 关键：内容区域必须透明！）：**
```jsx
import { ThemeProvider } from './theme-switch/ThemeProvider.jsx';
import MoonOverlay from './theme-switch/MoonOverlay.jsx';
import RainOverlay from './theme-switch/RainOverlay.jsx';
import SnowOverlay from './theme-switch/SnowOverlay.jsx';
import LeavesOverlay from './theme-switch/LeavesOverlay.jsx';
import ModeIndicator from './theme-switch/ModeIndicator.jsx';
import ModeToast from './theme-switch/ModeToast.jsx';
import AudioToggle from './theme-switch/AudioToggle.jsx';

function App() {
  return (
    <ThemeProvider>
      <MoonOverlay />
      <LeavesOverlay />
      <RainOverlay />
      <SnowOverlay />
      <ModeIndicator />
      <ModeToast />
      <AudioToggle />
      {/* ⚠️ 关键：内容容器不能有实心不透明背景！ */}
      {/* 错误：<div style={{ background: 'var(--bg)' }}> ← 会遮住 overlay */}
      {/* 正确：<div style={{ color: 'var(--text)' }}> ← 透明背景，overlay 可见 */}
      <div style={{ color: 'var(--text)' }}>
        {/* 你原有的页面内容 */}
      </div>
    </ThemeProvider>
  );
}
```

### 方案 B：Vue3 项目

**复制适配文件：**
```
adapters/vue3/ → 你的项目/src/components/theme-switch/
├── ThemeProvider.vue
├── MoonOverlay.vue / RainOverlay.vue / SnowOverlay.vue / LeavesOverlay.vue
├── ModeIndicator.vue / ModeToast.vue / AudioToggle.vue
```

**在 main.js 或 App.vue 中引入 CSS：**
```js
import 'path/to/css/themes.css';
import 'path/to/css/overlays.css';
```

**App.vue 示例：**
```vue
<template>
  <ThemeProvider :options="{ defaultMode: 'day' }">
    <MoonOverlay :engine="engine" />
    <LeavesOverlay :engine="engine" />
    <RainOverlay :engine="engine" />
    <SnowOverlay :engine="engine" />
    <ModeIndicator :engine="engine" />
    <ModeToast :engine="engine" />
    <AudioToggle :engine="engine" />
    <!-- ⚠️ 关键：内容容器不能有实心不透明背景！ -->
    <div :style="{ color: 'var(--text)' }">
      <!-- 你原有的页面内容 -->
    </div>
  </ThemeProvider>
</template>

<script setup>
import { provide, ref } from 'vue';
import ThemeProvider from './components/theme-switch/ThemeProvider.vue';
// ... import 所有 overlay 组件
import { createThemeStore } from './components/theme-switch/themeStore.svelte.js'; // 或从 core 导入
const { engine } = createThemeStore();
provide('themeEngine', { engine });
</script>
```

### 方案 C：Svelte 项目

**复制适配文件：**
```
adapters/svelte/ → 你的项目/src/lib/theme-switch/
├── themeStore.svelte.js
├── MoonOverlay.svelte / RainOverlay.svelte / SnowOverlay.svelte / LeavesOverlay.svelte
├── ModeIndicator.svelte / ModeToast.svelte / AudioToggle.svelte
```

**+layout.svelte 或 App.svelte：**
```svelte
<script>
  import { onMount } from 'svelte';
  import { createThemeStore } from '$lib/theme-switch/themeStore.svelte.js';
  import ThemeCSS from '$lib/../css/themes.css?inline';
  import OverlayCSS from '$lib/../css/overlays.css?inline';
  // ... import all overlay components
  const { engine, mode } = createThemeStore();
</script>

<svelte:head>
  {@html ThemeCSS}
  {@html OverlayCSS}
</svelte:head>

<MoonOverlay {engine} />
<LeavesOverlay {engine} />
<RainOverlay {engine} />
<SnowOverlay {engine} />
<ModeIndicator {engine} />
<ModeToast {engine} />
<AudioToggle {engine} />

<!-- ⚠️ 关键：内容容器不能有实心不透明背景！ -->
<div style="color: var(--text)">
  <!-- 你原有的页面内容 -->
</div>
```

### 方案 D：Vanilla JS / HTML 项目（一键初始化）

**无需复制额外适配文件！** 只需引入 vanilla 适配器的 index.js：

```html
<!-- 在你的 HTML 中 -->
<link rel="stylesheet" href="path/to/css/themes.css">
<link rel="stylesheet" href="path/to/css/overlays.css">

<!-- ⚠️ 关键：内容容器不能有实心不透明背景！ -->
<div id="your-content" style="color: var(--text)">
  <!-- 你的页面内容在这里 -->
</div>

<script type="module">
  import { initThemeSwitch } from 'path/to/adapters/vanilla/index.js';

  initThemeSwitch({
    defaultMode: 'day',
    overlayContainer: document.body,  // 默认追加到 body
  });

  // 完成！键盘快捷键 N/M/D/S/R/W 立即可用
</script>
```

### 方案 E：Angular 项目

Angular 使用 Vanilla 适配层方案（在 ngOnInit 中调用 initThemeSwitch），或在自定义 Directive 中封装。

---

## 第四步：让内容适配主题颜色

无论哪种框架，在你的内容样式中使用 CSS 变量：

```css
.your-title { color: var(--text); }
.your-subtitle { color: var(--mid); }
.your-accent { color: var(--accent); }
.your-border { border-color: var(--line); }
```

### ⚠️ 关键：内容区域背景必须透明

overlay 氛围效果层（Canvas/视频）的 z-index 为 1，你的主内容 z-index 为 10+。如果内容区域有**实心不透明背景**，会完全遮住 overlay 效果！

**❌ 错误做法（overlay 不可见）：**
```css
.your-content {
  background: var(--bg);      /* 实心不透明，遮住 overlay */
  background: white;           /* 同样遮住 overlay */
  background: #f2efe9;        /* 同样遮住 overlay */
}
```

**✅ 正确做法（overlay 可见）：**

方案一：内容区域完全透明（推荐，效果最佳）
```css
.your-content {
  background: transparent;     /* overlay 效果完全可见 */
}
```

方案二：卡片/容器使用半透明 + 毛玻璃
```css
.your-card {
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--line);
}
```

**正确的层级结构：**
```
body 背景 (var(--bg))         ← 最底层，提供基础配色
  ↓
overlay 层 (z-index: 1)       ← Canvas/视频氛围效果（半透明）
  ↓
内容层 (z-index: 10)          ← 必须透明背景！卡片可半透明
```

## Z-Index 层级

```
z-index: 1     overlay-container (背景氛围)
z-index: 10+   你的主内容（必须透明背景！）
z-index: 1000  mode-indicator, mode-toast
z-index: 1001  audio-toggle
```

## 浏览器兼容性

- Chrome 85+, Edge 85+, Firefox 90+, Safari 16+
- 需要: CSS Houdini `@property`, Web Audio API, Canvas 2D, `<video>`

## 注意事项

1. **音频策略**: 浏览器限制自动播放，首次用户交互后音频启动
2. **性能**: 非活跃模式下 Canvas 动画不运行 (requestAnimationFrame 自动暂停)
3. **响应式**: 所有 Canvas 自动监听 window.resize 并重绘
4. **零外部依赖**: 核心层无任何 npm 依赖
5. **资源文件**: leaves.mp4 (~33KB) + forest.mp3 (~1.9MB) 必须放在 public/assets/
6. **视频自动播放**: `<video autoPlay>` 在 overlay 初始隐藏时可能不触发，LeavesOverlay 组件必须在模式激活时通过 ref 手动调用 `video.play()`，非激活时调用 `video.pause()`
7. **混合模式**: 落叶视频使用 `mix-blend-mode: soft-light`（不要用 `multiply`，在浅色背景下 multiply 会使视频内容几乎不可见）

## 效果保证

所有适配层的视觉效果和音效 **100% 一致**，因为：
- 渲染逻辑全部在 **core/** 层，各适配层只是薄薄的壳
- 同一套 CSS 变量 + @property 过渡
- 同一个 Web Audio 音效引擎实例
- 同一组 Canvas 渲染参数（月亮56px半径/150星星/180雨滴/268雪花）

---

## ⚠️ 踩坑指南（已知问题及解决方案）

### 坑 1：氛围效果（雨/雪/月亮/落叶）完全看不到

**症状**：切换到 Moonlight/Rainy/Snowy/Sunny 模式后，背景颜色变了，但看不到 Canvas 动画或视频效果。

**根因**：内容区域有实心不透明背景（如 `background: var(--bg)` 或 `background: white`），完全遮住了 z-index 更低的 overlay 层。

**解决方案**：参见上方「第四步：让内容适配主题颜色 → 关键：内容区域背景必须透明」。内容区域必须透明，卡片等元素使用半透明 + backdrop-filter。

### 坑 2：下载的 leaves.mp4 是 Base64 文本而非二进制

**症状**：视频文件存在但浏览器报错 `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`，`ffprobe` 报 `Could not find codec parameters`。

**根因**：`curl -L -o` 从 GitHub raw URL 下载时，某些网络环境（代理/CDN）会返回 Base64 编码的文本而非原始二进制文件。用 `file` 命令检查会显示 `ASCII text` 而非 `ISO Media`。

**解决方案**：使用 GitHub Contents API + base64 解码下载：
```bash
curl -sL "https://api.github.com/repos/painsix96/theme-switch-six-modes/contents/public/assets/leaves.mp4" | \
  python3 -c "import sys,json,base64; d=json.load(sys.stdin); open('public/assets/leaves.mp4','wb').write(base64.b64decode(d['content']))"
```
下载后务必验证：`file public/assets/leaves.mp4` 应输出包含 "ISO Media" 或 "MP4" 的结果。

### 坑 3：Sunny 模式落叶视频不播放

**症状**：切换到 Sunny 模式后，overlay 容器已激活（opacity: 1），但视频不播放，`video.readyState` 为 0。

**根因**：`<video autoPlay>` 在以下场景不可靠：
- overlay 初始为 `opacity: 0`（隐藏状态），浏览器可能不加载/不播放不可见的视频
- 浏览器自动播放策略限制
- React/Vue 组件挂载时 overlay 尚未激活

**解决方案**：LeavesOverlay 组件必须在模式切换时通过 ref 手动控制视频播放：
```jsx
// React 示例
const videoRef = useRef(null);
const isActive = mode === 'sunny';

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  if (isActive) {
    video.currentTime = 0;
    video.play().catch(() => {});
  } else {
    video.pause();
  }
}, [isActive]);

return <video ref={videoRef} muted loop playsInline src="/assets/leaves.mp4" />;
```
注意：不要在 `<video>` 上写 `autoPlay`，改用手动 `play()` 控制。

### 坑 4：落叶视频在浅色背景下几乎不可见

**症状**：Sunny 模式下视频在播放，但几乎看不到树叶效果。

**根因**：`mix-blend-mode: multiply` 的计算方式是 `结果 = 顶层 × 底层 / 255`。当底层（背景）是浅色（如 #f2efe9）时，乘法结果仍然很浅，视频内容几乎消失。

**解决方案**：将 `mix-blend-mode` 从 `multiply` 改为 `soft-light`：
```css
.leaves-overlay video {
  mix-blend-mode: soft-light;  /* ✅ 正确：浅色背景下可见 */
  /* mix-blend-mode: multiply; ❌ 错误：浅色背景下不可见 */
  opacity: 0.7;
}
```

### 坑 5：TypeScript 项目使用 JSX 组件报类型错误

**症状**：将 `.jsx` 适配文件复制到 TypeScript 项目后，编译报类型错误。

**解决方案**：
1. 将所有 `.jsx` 文件重命名为 `.tsx`
2. 为组件 props 添加类型注解：
   - `ThemeProvider` → `({ children }: { children: React.ReactNode })`
   - `useRef` 添加泛型 → `useRef<HTMLCanvasElement>(null)`、`useRef<HTMLVideoElement>(null)`
3. 对于 `useCallback` 中未使用的参数，用下划线前缀标记：`(_width: number, _height: number)`