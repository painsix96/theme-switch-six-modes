import { useTheme } from '../../context/ThemeContext';
import '../../styles/overlays.css';

export default function LeavesOverlay() {
  const { mode } = useTheme();
  const isActive = mode === 'sunny';

  return (
    <div className={`overlay-container leaves-overlay ${isActive ? 'active' : ''}`}>
      <video autoPlay muted loop playsInline src="/assets/leaves.mp4" />
    </div>
  );
}