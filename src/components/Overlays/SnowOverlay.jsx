import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/overlays.css';

export default function SnowOverlay(){
  const {mode}=useTheme();const canvasRef=useRef(null);const flakesRef=useRef([]);const isActive=mode==='snow';

  const drawSnowflake=useCallback((ctx,flake,windPush)=>{
    const{x,y,size,alpha,detail,branchScale,glow,rotation}=flake;
    if(glow>0){const halo=ctx.createRadialGradient(x,y,0,x,y,size*4.5);halo.addColorStop(0,`rgba(255,255,255,${alpha*glow})`);halo.addColorStop(1,'rgba(255,255,255,0)');ctx.beginPath();ctx.arc(x,y,size*4.5,0,Math.PI*2);ctx.fillStyle=halo;ctx.fill();}
    ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.strokeStyle=`rgba(255,255,255,${alpha})`;ctx.fillStyle=`rgba(255,255,255,${Math.min(alpha+0.08,0.92)})`;ctx.lineWidth=Math.max(0.7,size*0.25);ctx.lineCap='round';ctx.lineJoin='round';
    if(detail===0&&Math.abs(windPush)>0.35){const trail=Math.min(14,size*7+Math.abs(windPush)*4);ctx.strokeStyle=`rgba(255,255,255,${alpha*0.65})`;ctx.lineWidth=Math.max(0.45,size*0.18);ctx.beginPath();ctx.moveTo(-trail,trail*0.12);ctx.lineTo(0,0);ctx.stroke();ctx.strokeStyle=`rgba(255,255,255,${alpha})`;ctx.lineWidth=Math.max(0.7,size*0.25);}
    const armLength=size*2.6;const branchNear=armLength*0.45;const branchFar=armLength*0.72;const branchLen=size*0.78*branchScale;
    ctx.beginPath();for(let i=0;i<6;i++){const angle=(Math.PI/3)*i;const dx=Math.cos(angle);const dy=Math.sin(angle);ctx.moveTo(0,0);ctx.lineTo(dx*armLength,dy*armLength);if(detail>=1){const bx=dx*branchNear;const by=dy*branchNear;ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(angle+Math.PI*0.68)*branchLen,by+Math.sin(angle+Math.PI*0.68)*branchLen);ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(angle-Math.PI*0.68)*branchLen,by+Math.sin(angle-Math.PI*0.68)*branchLen);}if(detail>=2){const tx=dx*branchFar;const ty=dy*branchFar;ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(angle+Math.PI*0.78)*branchLen*0.75,ty+Math.sin(angle+Math.PI*0.78)*branchLen*0.75);ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(angle-Math.PI*0.78)*branchLen*0.75,ty+Math.sin(angle-Math.PI*0.78)*branchLen*0.75);}}ctx.stroke();ctx.beginPath();ctx.arc(0,0,Math.max(0.45,size*0.22),0,Math.PI*2);ctx.fill();ctx.restore();
  },[]);

  const initFlakes=useCallback((width,height)=>{
    const layers=[{count:34,sizeMin:3.2,sizeMax:5.2,speedMin:1.15,speedMax:1.9,wobble:0.65,alphaMin:0.62,alphaMax:0.82,driftMin:-0.34,driftMax:0.34,windWeight:1.35,detail:2,branchScale:1.12,glow:0.20},{count:84,sizeMin:1.9,sizeMax:3.3,speedMin:0.72,speedMax:1.28,wobble:0.45,alphaMin:0.36,alphaMax:0.62,driftMin:-0.24,driftMax:0.24,windWeight:1.04,detail:1,branchScale:0.9,glow:0.08},{count:150,sizeMin:0.8,sizeMax:1.55,speedMin:0.4,speedMax:0.9,wobble:0.24,alphaMin:0.12,alphaMax:0.32,driftMin:-0.14,driftMax:0.15,windWeight:0.78,detail:0,branchScale:0.6,glow:0.02}];
    const flakes=[];layers.forEach(layer=>{for(let i=0;i<layer.count;i++){const size=layer.sizeMin+Math.random()*(layer.sizeMax-layer.sizeMin);flakes.push({x:Math.random()*(width+160)-80,y:Math.random()*height,size,speed:layer.speedMin+Math.random()*(layer.speedMax-layer.speedMin),wobbleAmp:layer.wobble*(0.7+Math.random()*0.7),wobblePhase:Math.random()*Math.PI*2,wobbleSpeed:0.008+Math.random()*0.018,alpha:layer.alphaMin+Math.random()*(layer.alphaMax-layer.alphaMin),baseDrift:layer.driftMin+Math.random()*(layer.driftMax-layer.driftMin),windWeight:layer.windWeight*(0.8+Math.random()*0.5),rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-0.5)*0.01,detail:layer.detail,branchScale:layer.branchScale,glow:layer.glow});}});flakesRef.current=flakes;
  },[]);

  const getWind=useCallback(tick=>{const breeze=Math.sin(tick*0.016)*1.02+Math.sin(tick*0.0054+1.2)*1.2;const gust=Math.pow((Math.sin(tick*0.0028-0.8)+1)*0.5,4)*2.85;return breeze+gust-0.58;},[]);
  let tickCounter=0;
  const animate=useCallback((ctx,width,height,time)=>{tickCounter++;const windPush=getWind(tickCounter);ctx.clearRect(0,0,width,height);flakesRef.current.forEach(flake=>{flake.y+=flake.speed;flake.x+=flake.baseDrift+windPush*flake.windWeight;flake.wobblePhase+=flake.wobbleSpeed;flake.x+=Math.sin(flake.wobblePhase)*flake.wobbleAmp;flake.rotation+=flake.rotationSpeed;if(flake.y>height+flake.size*10){flake.y=-flake.size*(10+Math.random()*18);flake.x=Math.random()*(width+160)-80;}if(flake.x>width+100)flake.x=-80;if(flake.x<-100)flake.x=width+80;drawSnowflake(ctx,flake,windPush);});},[getWind,drawSnowflake]);

  useEffect(()=>{if(!isActive||!canvasRef.current)return;const canvas=canvasRef.current;const ctx=canvas.getContext('2d');let frameId;tickCounter=0;const resize=()=>{const dpr=window.devicePixelRatio||1;canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);initFlakes(window.innerWidth,window.innerHeight);};resize();window.addEventListener('resize',resize);const loop=time=>{animate(ctx,window.innerWidth,window.innerHeight,time);frameId=requestAnimationFrame(loop)};frameId=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(frameId);window.removeEventListener('resize',resize);};},[isActive,animate,initFlakes]);

  return(<div className={`overlay-container snow-overlay ${isActive?'active':''}`}><div className="snow-glow"/><canvas ref={canvasRef} className="overlay-canvas"/></div>);
}