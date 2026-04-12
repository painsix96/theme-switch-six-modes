import { ThemeProvider } from './context/ThemeContext';
import MoonOverlay from './components/Overlays/MoonOverlay';
import LeavesOverlay from './components/Overlays/LeavesOverlay';
import RainOverlay from './components/Overlays/RainOverlay';
import SnowOverlay from './components/Overlays/SnowOverlay';
import ModeIndicator from './components/ModeIndicator';
import ModeToast from './components/ModeToast';
import AudioToggle from './components/AudioToggle';

import './styles/themes.css';
import './styles/overlays.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <MoonOverlay />
        <LeavesOverlay />
        <RainOverlay />
        <SnowOverlay />
        <ModeIndicator />
        <ModeToast />
        <AudioToggle />
        <main className="main-content">
          <div className="demo-card">
            <h1 className="demo-title">Theme Switch</h1>
            <p className="demo-subtitle">Six Modes. One Feeling.</p>
            <div className="demo-keys">
              <span><kbd>N</kbd> Night</span>
              <span><kbd>M</kbd> Moonlight</span>
              <span><kbd>D</kbd> Day</span>
              <span><kbd>S</kbd> Sunny</span>
              <span><kbd>R</kbd> Rainy</span>
              <span><kbd>W</kbd> Snowy</span>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;