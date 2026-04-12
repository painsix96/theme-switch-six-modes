export class RainOverlay {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.drops = [];
    this.splashes = [];
    this.frameId = null;
    this.active = false;
    this._initDOM();
  }

  _initDOM() {
    this.container.className = 'overlay-container rain-overlay';
    this.container.innerHTML = '<canvas class="overlay-canvas"></canvas><div class="fog-layer"></div>';
    this.canvas = this.container.querySelector('canvas');
  }

  activate() {
    if (this.active) return;
    this.active = true;
    this.container.classList.add('active');
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', this._resizeBound = () => this._resize());
    this._loop();
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.container.classList.remove('active');
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this._resizeBound);
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this._initDrops();
  }

  _initDrops() {
    const layers = [
      { count:80, speedMin:14, speedMax:20, lenMin:18, lenMax:30, widthMin:1, widthMax:1.5, opacity:0.25 },
      { count:60, speedMin:10, speedMax:16, lenMin:12, lenMax:22, widthMin:0.8, widthMax:1.2, opacity:0.35 },
      { count:40, speedMin:6, speedMax:11, lenMin:8, lenMax:15, widthMin:0.5, widthMax:0.9, opacity:0.5 },
    ];
    this.drops = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        this.drops.push({
          x: Math.random()*(window.innerWidth+100)-50,
          y: Math.random()*-window.innerHeight,
          speed: layer.speedMin+Math.random()*(layer.speedMax-layer.speedMin),
          length: layer.lenMin+Math.random()*(layer.lenMax-layer.lenMin),
          thickness: layer.widthMin+Math.random()*(layer.widthMax-layer.widthMin),
          opacity: layer.opacity+Math.random()*0.15,
          wind: 1.2+Math.random()*1.5
        });
      }
    });
  }

  _updateDrops(ctx, w, h) {
    ctx.lineCap = 'round';
    this.drops.forEach(drop => {
      drop.y += drop.speed; drop.x += drop.wind;
      if (drop.y > h) {
        drop.y = -drop.length; drop.x = Math.random()*(w+100)-50;
        if (Math.random()<0.4) this.splashes.push({
          x: drop.x, y: h-2, r:1, alpha:0.6,
          particles: Array.from({length:3}, () => ({ dx:(Math.random()-0.5)*3, dy:-Math.random()*2-0.5, life:1 }))
        });
      }
      if (drop.x > w+50) drop.x = -50;
      const angle = Math.atan2(drop.speed, drop.wind);
      ctx.beginPath(); ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x+Math.cos(angle)*drop.length, drop.y+Math.sin(angle)*drop.length);
      ctx.strokeStyle = `rgba(180,195,210,${drop.opacity})`;
      ctx.lineWidth = drop.thickness; ctx.stroke();
    });
  }

  _drawSplashes(ctx) {
    this.splashes = this.splashes.filter(s => {
      s.alpha -= 0.04; if (s.alpha <= 0) return false;
      s.particles.forEach(p => { p.dx *= 0.96; p.dy += 0.08; p.life -= 0.05; ctx.beginPath(); ctx.arc(s.x+p.dx*8, s.y+p.dy*8, 1, 0, Math.PI*2); ctx.fillStyle = `rgba(180,195,210,${s.alpha*p.life})`; ctx.fill(); });
      return true;
    });
  }

  _loop() {
    if (!this.active) return;
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    this._updateDrops(this.ctx, window.innerWidth, window.innerHeight);
    this._drawSplashes(this.ctx);
    this.frameId = requestAnimationFrame(() => this._loop());
  }
}
