import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/overlays.css';

export default function MoonOverlay() {
  const { mode } = useTheme();
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const isActive = mode === 'midnight';

  const initStars = useCallback((width, height) => {
    const colors = [[200,210,230],[220,215,200],[170,195,240],[240,225,180],[230,195,175]];
    const stars = [];
    for (let i = 0; i < 150; i++) {
      const isBright = Math.random() < 0.12;
      const c = colors[Math.floor(Math.random() * colors.length)];
      stars.push({x:Math.random()*100,y:Math.random()*60,baseR:isBright?(1.2+Math.random()*1.2):(0.4+Math.random()*0.8),r:c[0],g:c[1],b:c[2],baseAlpha:isBright?(0.5+Math.random()*0.3):(0.15+Math.random()*0.25),phase:Math.random()*Math.PI*2,speed:0.3+Math.random()*0.8,flickerAmp:isBright?(0.15+Math.random()*0.2):(0.08+Math.random()*0.12),flashPhase:Math.random()*Math.PI*2,flashSpeed:0.05+Math.random()*0.1,isBright});
    }
    starsRef.current = stars;
  }, []);

  const drawStars = useCallback((ctx, time) => {
    starsRef.current.forEach(s => {
      const px=s.x*ctx.canvas.width/100/(window.devicePixelRatio||1);
      const py=s.y*ctx.canvas.height/100/(window.devicePixelRatio||1);
      const osc=Math.sin(s.phase+time*s.speed);const shimmer=Math.sin(s.phase*3.7+time*s.speed*2.3)*0.3;
      const flash=Math.pow(Math.max(0,Math.sin(s.flashPhase+time*s.flashSpeed)),12)*0.4;
      const alpha=Math.max(0.02,s.baseAlpha+(osc+shimmer)*s.flickerAmp+flash);const radius=s.baseR*(1+flash*0.5);
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.fillStyle=`rgba(${s.r},${s.g},${s.b},${alpha})`;ctx.fill();
      if(s.isBright&&alpha>0.4){const glow=ctx.createRadialGradient(px,py,0,px,py,radius*3.5);glow.addColorStop(0,`rgba(${s.r},${s.g},${s.b},${alpha*0.25})`);glow.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(px,py,radius*3.5,0,Math.PI*2);ctx.fillStyle=glow;ctx.fill();}
    });
  }, []);

  let moonSeed=42;function srand(){moonSeed=(moonSeed*16807+0)%2147483647;return(moonSeed-1)/2147483646;}

  const drawMoon=useCallback((ctx,width)=>{
    const dpr=window.devicePixelRatio||1;const S=320,R=S/2,cx=R,cy=R;
    const moonX=width*0.82,moonY=70/dpr,moonR=56/dpr;
    const offscreenCanvas=document.createElement('canvas');offscreenCanvas.width=S;offscreenCanvas.height=S;const mCtx=offscreenCanvas.getContext('2d');
    mCtx.beginPath();mCtx.arc(cx,cy,R,0,Math.PI*2);mCtx.clip();
    const base=mCtx.createRadialGradient(cx*0.72,cy*0.68,R*0.02,cx,cy,R);base.addColorStop(0,'#e2ddd2');base.addColorStop(0.3,'#d5d0c5');base.addColorStop(0.65,'#c0bbb0');base.addColorStop(1,'#aaa59a');mCtx.fillStyle=base;mCtx.fillRect(0,0,S,S);
    const maria=[{x:0.36,y:0.30,rx:0.20,ry:0.13,a:0.10},{x:0.46,y:0.54,rx:0.15,ry:0.11,a:0.08},{x:0.56,y:0.40,rx:0.11,ry:0.15,a:0.07},{x:0.30,y:0.62,rx:0.13,ry:0.10,a:0.06}];
    maria.forEach(m=>{const g=mCtx.createRadialGradient(m.x*S,m.y*S,0,m.x*S,m.y*S,Math.max(m.rx,m.y)*S);g.addColorStop(0,`rgba(75,72,65,${m.a})`);g.addColorStop(0.5,`rgba(80,77,70,${m.a*0.4})`);g.addColorStop(1,'transparent');mCtx.fillStyle=g;mCtx.beginPath();mCtx.ellipse(m.x*S,m.y*S,m.rx*S,m.ry*S,srand()*0.4,0,Math.PI*2);mCtx.fill();});
    const craters=[{x:0.32,y:0.28,r:0.055},{x:0.52,y:0.35,r:0.035},{x:0.40,y:0.56,r:0.045},{x:0.60,y:0.58,r:0.03}];
    craters.forEach(cr=>{const px=cr.x*S,py=cr.y*S,pr=cr.r*S;const shadow=mCtx.createRadialGradient(px+pr*0.12,py+pr*0.12,pr*0.2,px,py,pr);shadow.addColorStop(0,'rgba(50,45,40,0.10)');shadow.addColorStop(0.8,'rgba(50,45,40,0.05)');shadow.addColorStop(1,'transparent');mCtx.fillStyle=shadow;mCtx.beginPath();mCtx.arc(px,py,pr,0,Math.PI*2);mCtx.fill();mCtx.strokeStyle='rgba(230,225,218,0.06)';mCtx.lineWidth=1.5;mCtx.beginPath();mCtx.arc(px-pr*0.06,py-pr*0.06,pr*0.8,-Math.PI*0.7,Math.PI*0.15);mCtx.stroke();});
    const terminator=mCtx.createLinearGradient(cx*0.5,0,S,0);terminator.addColorStop(0,'transparent');terminator.addColorStop(0.55,'transparent');terminator.addColorStop(0.8,'rgba(12,15,28,0.20)');terminator.addColorStop(1,'rgba(5,8,18,0.55)');mCtx.fillStyle=terminator;mCtx.fillRect(0,0,S,S);
    const es=mCtx.createRadialGradient(cx+R*0.65,cy,0,cx+R*0.65,cy,R*0.5);es.addColorStop(0,'rgba(100,130,180,0.03)');es.addColorStop(1,'transparent');mCtx.fillStyle=es;mCtx.fillRect(0,0,S,S);
    const limb=mCtx.createRadialGradient(cx,cy,R*0.65,cx,cy,R);limb.addColorStop(0,'transparent');limb.addColorStop(0.85,'rgba(25,22,18,0.06)');limb.addColorStop(1,'rgba(15,12,8,0.18)');mCtx.fillStyle=limb;mCtx.fillRect(0,0,S,S);
    ctx.drawImage(offscreenCanvas,moonX-moonR,moonY-moonR,moonR*2,moonR*2);
  },[]);

  const animate=useCallback((ctx,width,height,time)=>{ctx.clearRect(0,0,width,height);drawStars(ctx,time);drawMoon(ctx,width);},[drawStars,drawMoon]);

  useEffect(()=>{
    if(!isActive||!canvasRef.current)return;
    const canvas=canvasRef.current;const ctx=canvas.getContext('2d');let frameId;
    const resize=()=>{const dpr=window.devicePixelRatio||1;canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);initStars(window.innerWidth,window.innerHeight);};
    resize();window.addEventListener('resize',resize);
    const loop=time=>{animate(ctx,window.innerWidth,window.innerHeight,time*0.001);frameId=requestAnimationFrame(loop);};frameId=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(frameId);window.removeEventListener('resize',resize);};
  },[isActive,animate,initStars]);

  return(<div className={`overlay-container moon-overlay ${isActive?'active':''}`}><div className="moon-glow"/><canvas ref={canvasRef} className="overlay-canvas"/></div>);
}