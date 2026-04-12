export class SnowOverlay {
  constructor(container) {
    this.container = container;
    this.canvas = null; this.ctx = null;
    this.flakes = []; this.frameId = null;
    this.tickCounter = 0; this.active = false;
    this._initDOM();
  }

  _initDOM() {
    this.container.className = 'overlay-container snow-overlay';
    this.container.innerHTML = '<div class="snow-glow"></div><canvas class="overlay-canvas"></canvas>';
    this.canvas = this.container.querySelector('canvas');
  }

  activate() {
    if (this.active) return;
    this.active = true; this.container.classList.add('active');
    this.ctx = this.canvas.getContext('2d'); this._resize();
    window.addEventListener('resize', this._resizeBound = () => { this._resize(); });
    this._loop(0);
  }

  deactivate() {
    if (!this.active) return;
    this.active = false; this.container.classList.remove('active');
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this._resizeBound);
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this._initFlakes();
  }

  _initFlakes() {
    const layers = [
      {count:34,sizeMin:3.2,sizeMax:5.2,speedMin:1.15,speedMax:1.9,wobble:0.65,alphaMin:0.62,alphaMax:0.82,driftMin:-0.34,driftMax:0.34,windWeight:1.35,detail:2,branchScale:1.12,glow:0.20},
      {count:84,sizeMin:1.9,sizeMax:3.3,speedMin:0.72,speedMax:1.28,wobble:0.45,alphaMin:0.36,alphaMax:0.62,driftMin:-0.24,driftMax:0.24,windWeight:1.04,detail:1,branchScale:0.9,glow:0.08},
      {count:150,sizeMin:0.8,sizeMax:1.55,speedMin:0.4,speedMax:0.9,wobble:0.24,alphaMin:0.12,alphaMax:0.32,driftMin:-0.14,driftMax:0.15,windWeight:0.78,detail:0,branchScale:0.6,glow:0.02}
    ];
    this.flakes = [];
    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        const size = layer.sizeMin+Math.random()*(layer.sizeMax-layer.sizeMin);
        this.flakes.push({
          x: Math.random()*(window.innerWidth+160)-80,
          y: Math.random()*window.innerHeight, size,
          speed: layer.speedMin+Math.random()*(layer.speedMax-layer.speedMin),
          wobbleAmp: layer.wobble*(0.7+Math.random()*0.7),
          wobblePhase: Math.random()*Math.PI*2,
          wobbleSpeed: 0.008+Math.random()*0.018,
          alpha: layer.alphaMin+Math.random()*(layer.alphaMax-layer.alphaMin),
          baseDrift: layer.driftMin+Math.random()*(layer.driftMax-layer.driftMin),
          windWeight: layer.windWeight*(0.8+Math.random()*0.5),
          rotation: Math.random()*Math.PI*2,
          rotationSpeed: (Math.random()-0.5)*0.01,
          detail: layer.detail, branchScale: layer.branchScale, glow: layer.glow
        });
      }
    });
  }

  _getWind(tick) {
    const breeze = Math.sin(tick*0.016)*1.02 + Math.sin(tick*0.0054+1.2)*1.2;
    const gust = Math.pow((Math.sin(tick*0.0028-0.8)+1)*0.5, 4)*2.85;
    return breeze + gust - 0.58;
  }

  _drawSnowflake(ctx, flake, windPush) {
    const {x,y,size,alpha,detail,branchScale,glow,rotation} = flake;
    if (glow > 0) {
      const halo = ctx.createRadialGradient(x,y,0,x,y,size*4.5);
      halo.addColorStop(0, `rgba(255,255,255,${alpha*glow})`);
      halo.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(x,y,size*4.5,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
    }
    ctx.save(); ctx.translate(x,y); ctx.rotate(rotation);
    ctx.strokeStyle=`rgba(255,255,255,${alpha})`;
    ctx.fillStyle=`rgba(255,255,255,${Math.min(alpha+0.08,0.92)})`;
    ctx.lineWidth=Math.max(0.7,size*0.25); ctx.lineCap='round'; ctx.lineJoin='round';
    if (detail===0 && Math.abs(windPush)>0.35) {
      const trail=Math.min(14,size*7+Math.abs(windPush)*4);
      ctx.strokeStyle=`rgba(255,255,255,${alpha*0.65})`; ctx.lineWidth=Math.max(0.45,size*0.18);
      ctx.beginPath(); ctx.moveTo(-trail,trail*0.12); ctx.lineTo(0,0); ctx.stroke();
      ctx.strokeStyle=`rgba(255,255,255,${alpha})`; ctx.lineWidth=Math.max(0.7,size*0.25);
    }
    const armLen=size*2.6, bNear=armLen*0.45, bFar=armLen*0.72, bLen=size*0.78*branchScale;
    ctx.beginPath();
    for (let i=0;i<6;i++) {
      const a=(Math.PI/3)*i, dx=Math.cos(a), dy=Math.sin(a);
      ctx.moveTo(0,0); ctx.lineTo(dx*armLen,dy*armLen);
      if (detail>=1) { const bx=dx*bNear, by=dy*bNear; ctx.moveTo(bx,by); ctx.lineTo(bx+Math.cos(a+Math.PI*0.68)*bLen,by+Math.sin(a+Math.PI*0.68)*bLen); ctx.moveTo(bx,by); ctx.lineTo(bx+Math.cos(a-Math.PI*0.68)*bLen,by+Math.sin(a-Math.PI*0.68)*bLen); }
      if (detail>=2) { const tx=dx*bFar, ty=dy*bFar; ctx.moveTo(tx,ty); ctx.lineTo(tx+Math.cos(a+Math.PI*0.78)*bLen*0.75,ty+Math.sin(a+Math.PI*0.78)*bLen*0.75); ctx.moveTo(tx,ty); ctx.lineTo(tx+Math.cos(a-Math.PI*0.78)*bLen*0.75,ty+Math.sin(a-Math.PI*0.78)*bLen*0.75); }
    } ctx.stroke();
    ctx.beginPath(); ctx.arc(0,0,Math.max(0.45,size*0.22),0,Math.PI*2); ctx.fill(); ctx.restore();
  }

  _loop(time) {
    if (!this.active) return;
    this.tickCounter++;
    const windPush = this._getWind(this.tickCounter);
    this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.flakes.forEach(flake => {
      flake.y += flake.speed; flake.x += flake.baseDrift + windPush*flake.windWeight;
      flake.wobblePhase += flake.wobbleSpeed; flake.x += Math.sin(flake.wobblePhase)*flake.wobbleAmp;
      flake.rotation += flake.rotationSpeed;
      if (flake.y > window.innerHeight + flake.size*10) { flake.y = -flake.size*(10+Math.random()*18); flake.x = Math.random()*(window.innerWidth+160)-80; }
      if (flake.x > window.innerWidth+100) flake.x=-80; if (flake.x<-100) flake.x=window.innerWidth+80;
      this._drawSnowflake(this.ctx, flake, windPush);
    });
    this.frameId = requestAnimationFrame((t)=>this._loop(t));
  }
}
