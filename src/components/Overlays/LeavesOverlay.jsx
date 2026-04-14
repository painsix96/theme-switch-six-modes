import { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/overlays.css';

export default function LeavesOverlay() {
  const { mode } = useTheme();
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

  return (
    <div className={`overlay-container leaves-overlay ${isActive ? 'active' : ''}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        src="/assets/leaves.mp4"
      />
    </div>
  );
}
