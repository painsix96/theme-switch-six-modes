export class LeavesOverlay {
  constructor(container) {
    this.container = container; this.video = null; this.active = false; this._initDOM();
  }
  _initDOM() {
    this.container.className = 'overlay-container leaves-overlay';
    this.container.innerHTML = '<video autoplay muted loop playsInline src="/assets/leaves.mp4"></video>';
    this.video = this.container.querySelector('video');
  }
  activate() {
    if (this.active) return; this.active = true;
    this.container.classList.add('active');
    if (this.video) this.video.play().catch(() => {});
  }
  deactivate() {
    if (!this.active) return; this.active = false;
    this.container.classList.remove('active');
  }
}
