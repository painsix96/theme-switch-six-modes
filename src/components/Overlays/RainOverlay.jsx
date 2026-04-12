import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/overlays.css';

export default function RainOverlay() {
  const { mode } = useTheme();
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);
  const splashesRef = useRef([]);
  const isActive = mode === 'rain';

  const initDrops = useCallback((width, height) => {
    const layers=[{count:80,speedMin:14,speedMax:20,lenMin:18,lenMax:30,widthMin:1,widthMax:1.5,opacity:0.25},{count:60,speedMin:10,speedMax:16,lenMin:12,lenMax:22,widthMin:0.8,widthMax:1.2,opacity:0.35},{count:40,speedMin:6,speedMax:11,lenMin:8,lenMax:15,widthMin:0.5,widthMax:0.9,opacity:0.5}];
    const allDrops=[];
    layers.forEach(layer=>{for(let i=0;i<layer.count;i++)allDrops.push({x:Math.random()*(width+100)-50,y:Math.random()*-height,speed:layer.speedMin+Math.random()*(layer.speedMax-layer.speedMin),length:layer.lenMin+Math.random()*(layer.lenMax-layer.lenMin),thickness:layer.widthMin+Math.random()*(layer.widthMax-layer.widthMin),opacity:layer.opacity+Math.random()*0.15,wind:1.2+Math.random()*1.5});});
    dropsRef.current=allDrops;
  },[]);

  const updateDrops=useCallback((ctx,width,height)=>{
    ctx.lineCap='round';
    dropsRef.current.forEach(drop=>{
      drop.y+=drop.speed;drop.x+=drop.wind;
      if(drop.y>height){drop.y=-drop.length;drop.x=Math.random()*(width+100)-50;if(Math.random()<0.4)splashesRef.current.push({x:drop.x,y:height-2,r:1,alpha:0.6,particles:Array.from({length:3},()=>({dx:(Math.random()-0.5)*3,dy:-Math.random()*2-0.5,life:1}))});}
      if(drop.x>width+50)drop.x=-50;
      const angle=Math.atan2(drop.speed,drop.wind);
      ctx.beginPath();ctx.moveTo(drop.x,drop.y);ctx.lineTo(drop.x+Math.cos(angle)*drop.length,drop.y+Math.sin(angle)*drop.length);ctx.strokeStyle=`rgba(180,195,210,${drop.opacity})`;ctx.lineWidth=drop.thickness;ctx.stroke();
    });
  },[]);

  const drawSplashes=useCallback((ctx)=>{splashesRef.current=splashesRef.current.filter(splash=>{splash.alpha-=0.04;if(splash.alpha<=0)return false;splash.particles.forEach(p=>{p.dx*=0.96;p.dy+=0.08;p.life-=0.05;ctx.beginPath();ctx.arc(splash.x+p.dx*8,splash.y+p.dy*8,1,0,Math.PI*2);ctx.fillStyle=`rgba(180,195,210,${splash.alpha*p.life})`;ctx.fill();});return true;});},[]);

  const animate=useCallback((ctx,width,height)=>{ctx.clearRect(0,0,width,height);updateDrops(ctx,width,height);drawSplashes(ctx);},[updateDrops,drawSplashes]);

  useEffect(()=>{if(!isActive||!canvasRef.current)return;const canvas=canvasRef.current;const ctx=canvas.getContext('2d');let frameId;const resize=()=>{const dpr=window.devicePixelRatio||1;canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;ctx.scale(dpr,dpr);initDrops(window.innerWidth,window.innerHeight);};resize();window.addEventListener('resize',resize);const loop=()=>{animate(ctx,window.innerWidth,window.innerHeight);frameId=requestAnimationFrame(loop);};frameId=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(frameId);window.removeEventListener('resize',resize);};},[isActive,animate,initDrops]);

  return(<div className={`overlay-container rain-overlay ${isActive?'active':''}`}><canvas ref={canvasRef} className="overlay-canvas"/><div className="fog-layer"/></div>);
}