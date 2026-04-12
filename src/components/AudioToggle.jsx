import { useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const AUDIO_MODES = new Set(['midnight', 'sunny', 'rain', 'snow']);
let activeTimers = [];
let audioEnabledGlobal = true;

function getOrCreateAudioCtx(ctxRef) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current || ctxRef.current.state === 'closed') ctxRef.current = new AC();
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (typeof ctx.createBuffer !== 'function') { ctxRef.current = new AC(); return ctxRef.current; }
    return ctx;
  } catch (e) { console.warn('[Audio] Context creation failed:', e); return null; }
}

function stopAll(nodesRef) {
  Object.values(nodesRef.current).forEach(node => {
    try { if (node.stop) node.stop(); } catch (e) {}
    try { if (node.disconnect) node.disconnect(); } catch (e) {}
  });
  nodesRef.current = {};
  activeTimers.forEach(t => clearTimeout(t));
  activeTimers = [];
}

function playForestAmbience(nodesRef) {
  try {
    const audio = new Audio('/assets/forest.mp3');
    audio.loop = true; audio.volume = 0.5; audio.play().catch(() => {});
    nodesRef.current.sunny = { stop() { audio.pause(); audio.currentTime = 0; } };
  } catch (e) { console.warn('[Audio] Forest ambience failed:', e); }
}

function playNightAmbience(ctx, nodesRef) {
  try {
    if (!ctx || typeof ctx.createBuffer !== 'function') return;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.02;
    const source = ctx.createBufferSource(); source.buffer = buffer; source.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 15;
    const gain = ctx.createGain(); gain.gain.value = 0.3;
    source.connect(filter).connect(gain).connect(ctx.destination); source.start();
    nodesRef.current.night = source;
  } catch (e) { console.warn('[Audio] Night ambience failed:', e); }
}

function createPinkNoise(ctx, duration, channels) {
  if (!ctx || typeof ctx.createBuffer !== 'function') return null;
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(channels, len, ctx.sampleRate);
  for (let ch = 0; ch < channels; ch++) {
    const d = buf.getChannelData(ch);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0=0.99886*b0+w*0.0555179;b1=0.99332*b1+w*0.0750759;b2=0.96900*b2+w*0.1538520;b3=0.86650*b3+w*0.3104856;b4=0.55000*b4+w*0.5329522;b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.015;b6=w*0.115926;
    }
  }
  return buf;
}

function playRainAmbience(ctx, nodesRef) {
  try {
    if (!ctx || typeof ctx.createBuffer !== 'function') return;
    const rainBuf=createPinkNoise(ctx,4,2);if(!rainBuf)return;
    const rainSrc=ctx.createBufferSource();rainSrc.buffer=rainBuf;rainSrc.loop=true;
    const rainHP=ctx.createBiquadFilter();rainHP.type='highpass';rainHP.frequency.value=400;
    const rainLP=ctx.createBiquadFilter();rainLP.type='lowpass';rainLP.frequency.value=8000;
    const rainGain=ctx.createGain();rainGain.gain.value=0.18;
    rainSrc.connect(rainHP).connect(rainLP).connect(rainGain).connect(ctx.destination);rainSrc.start();
    const sizzleBuf=createPinkNoise(ctx,3,1);if(!sizzleBuf)return;
    const sizzleSrc=ctx.createBufferSource();sizzleSrc.buffer=sizzleBuf;sizzleSrc.loop=true;
    const sizzleHP=ctx.createBiquadFilter();sizzleHP.type='highpass';sizzleHP.frequency.value=3000;
    const sizzleLP=ctx.createBiquadFilter();sizzleLP.type='lowpass';sizzleLP.frequency.value=12000;
    const sizzleGain=ctx.createGain();sizzleGain.gain.value=0.06;
    sizzleSrc.connect(sizzleHP).connect(sizzleLP).connect(sizzleGain).connect(ctx.destination);sizzleSrc.start();
    const rumbleBuf=createPinkNoise(ctx,5,1);if(!rumbleBuf)return;
    const rumbleSrc=ctx.createBufferSource();rumbleSrc.buffer=rumbleBuf;rumbleSrc.loop=true;
    const rumbleLP=ctx.createBiquadFilter();rumbleLP.type='lowpass';rumbleLP.frequency.value=200;
    const rumbleGain=ctx.createGain();rumbleGain.gain.value=0.2;
    rumbleSrc.connect(rumbleLP).connect(rumbleGain).connect(ctx.destination);rumbleSrc.start();
    function scheduleThunder(){if(!audioEnabledGlobal)return;try{const now=ctx.currentTime;const dur=1.5+Math.random()*3;const tBuf=createPinkNoise(ctx,dur,1);if(!tBuf)return;const tSrc=ctx.createBufferSource();tSrc.buffer=tBuf;const tLP=ctx.createBiquadFilter();tLP.type='lowpass';tLP.frequency.value=120+Math.random()*80;const tGain=ctx.createGain();const vol=0.15+Math.random()*0.2;tGain.gain.setValueAtTime(0,now);tGain.gain.linearRampToValueAtTime(vol,now+0.05+Math.random()*0.1);tGain.gain.exponentialRampToValueAtTime(0.001,now+dur);tSrc.connect(tLP).connect(tGain).connect(ctx.destination);tSrc.start(now);tSrc.stop(now+dur+0.1);}catch(e){}activeTimers.push(setTimeout(scheduleThunder,8000+Math.random()*20000));}
    function scheduleDrip(){if(!audioEnabledGlobal)return;try{const now=ctx.currentTime;const count=1+Math.floor(Math.random()*3);for(let i=0;i<count;i++){const t=now+Math.random()*0.15;const dur=0.02+Math.random()*0.04;const nLen=Math.ceil(ctx.sampleRate*dur);const nBuf=ctx.createBuffer(1,nLen,ctx.sampleRate);const nd=nBuf.getChannelData(0);for(let j=0;j<nLen;j++)nd[j]=(Math.random()*2-1)*Math.exp(-j/(nLen*0.3));const nSrc=ctx.createBufferSource();nSrc.buffer=nBuf;const nBP=ctx.createBiquadFilter();nBP.type='bandpass';nBP.frequency.value=2000+Math.random()*4000;nBP.Q.value=2+Math.random()*3;const nGain=ctx.createGain();const vol=0.04+Math.random()*0.06;nGain.gain.setValueAtTime(vol,t);nGain.gain.exponentialRampToValueAtTime(0.0001,t+dur);nSrc.connect(nBP).connect(nGain).connect(ctx.destination);nSrc.start(t);nSrc.stop(t+dur+0.01);}}catch(e){}activeTimers.push(setTimeout(scheduleDrip,40+Math.random()*100));}
    activeTimers.push(setTimeout(scheduleThunder,3000+Math.random()*5000));scheduleDrip();
    nodesRef.current.rain={stop(){[rainSrc,sizzleSrc,rumbleSrc].forEach(n=>{try{n.stop()}catch(e){}});}};
  }catch(e){console.warn('[Audio] Rain ambience failed:',e);}
}

function playSnowAmbience(ctx,nodesRef){
  try{
    if(!ctx||typeof ctx.createBuffer!=='function')return;
    function createWindNoise(duration,amplitude=0.025){const len=Math.ceil(ctx.sampleRate*duration);const buf=ctx.createBuffer(1,len,ctx.sampleRate);const data=buf.getChannelData(0);let smooth=0;for(let i=0;i<len;i++){const white=(Math.random()*2-1)*amplitude;smooth=smooth*0.985+white*0.16;data[i]=smooth;}return buf;}
    const baseSrc=ctx.createBufferSource();baseSrc.buffer=createWindNoise(4.5,0.03);baseSrc.loop=true;const baseHP=ctx.createBiquadFilter();baseHP.type='highpass';baseHP.frequency.value=120;const baseLP=ctx.createBiquadFilter();baseLP.type='lowpass';baseLP.frequency.value=1200;const baseGain=ctx.createGain();baseGain.gain.value=0.095;baseSrc.connect(baseHP).connect(baseLP).connect(baseGain).connect(ctx.destination);baseSrc.start();
    const airySrc=ctx.createBufferSource();airySrc.buffer=createWindNoise(3.5,0.018);airySrc.loop=true;const airyHP=ctx.createBiquadFilter();airyHP.type='highpass';airyHP.frequency.value=700;const airyLP=ctx.createBiquadFilter();airyLP.type='lowpass';airyLP.frequency.value=3200;const airyGain=ctx.createGain();airyGain.gain.value=0.026;airySrc.connect(airyHP).connect(airyLP).connect(airyGain).connect(ctx.destination);airySrc.start();
    const gustSrc=ctx.createBufferSource();gustSrc.buffer=createWindNoise(5.5,0.022);gustSrc.loop=true;const gustHP=ctx.createBiquadFilter();gustHP.type='highpass';gustHP.frequency.value=250;const gustLP=ctx.createBiquadFilter();gustLP.type='lowpass';gustLP.frequency.value=2100;const gustGain=ctx.createGain();gustGain.gain.value=0.024;gustSrc.connect(gustHP).connect(gustLP).connect(gustGain).connect(ctx.destination);gustSrc.start();
    const rumbleSrc=ctx.createBufferSource();rumbleSrc.buffer=createWindNoise(6,0.018);rumbleSrc.loop=true;const rumbleLP=ctx.createBiquadFilter();rumbleLP.type='lowpass';rumbleLP.frequency.value=180;const rumbleGain=ctx.createGain();rumbleGain.gain.value=0.012;rumbleSrc.connect(rumbleLP).connect(rumbleGain).connect(ctx.destination);rumbleSrc.start();
    const airyLfo=ctx.createOscillator();airyLfo.type='sine';airyLfo.frequency.value=0.07;const airyDepth=ctx.createGain();airyDepth.gain.value=0.012;airyLfo.connect(airyDepth).connect(airyGain.gain);airyLfo.start();
    const gustLfo=ctx.createOscillator();gustLfo.type='sine';gustLfo.frequency.value=0.028;const gustDepth=ctx.createGain();gustDepth.gain.value=0.018;gustLfo.connect(gustDepth).connect(gustGain.gain);gustLfo.start();
    const rumbleLfo=ctx.createOscillator();rumbleLfo.type='sine';rumbleLfo.frequency.value=0.021;const rumbleDepth=ctx.createGain();rumbleDepth.gain.value=0.008;rumbleLfo.connect(rumbleDepth).connect(rumbleGain.gain);rumbleLfo.start();
    nodesRef.current.snow={stop(){[baseSrc,airySrc,gustSrc,rumbleSrc,airyLfo,gustLfo,rumbleLfo].forEach(n=>{try{n.stop()}catch(e){}});}};
  }catch(e){console.warn('[Audio] Snow ambience failed:',e);}
}

export default function AudioToggle(){
  const {mode,audioEnabled,toggleAudio}=useTheme();
  const ctxRef=useRef(null);const nodesRef=useRef({});
  useEffect(()=>{audioEnabledGlobal=audioEnabled;},[audioEnabled]);
  const startAudioForMode=useCallback((currentMode)=>{
    const ctx=getOrCreateAudioCtx(ctxRef);if(!ctx)return;stopAll(nodesRef);
    switch(currentMode){case'midnight':playNightAmbience(ctx,nodesRef);break;case'sunny':playForestAmbience(nodesRef);break;case'rain':playRainAmbience(ctx,nodesRef);break;case'snow':playSnowAmbience(ctx,nodesRef);break;default:break;}
  },[]);
  useEffect(()=>{if(!audioEnabled){stopAll(nodesRef);return;}if(AUDIO_MODES.has(mode))startAudioForMode(mode);else stopAll(nodesRef);},[mode,audioEnabled,startAudioForMode]);
  useEffect(()=>()=>{stopAll(nodesRef);},[]);
  const showButton=AUDIO_MODES.has(mode);
  return(
    <button className={`audio-toggle ${showButton?'':'hidden'} ${!audioEnabled?'muted':''}`} onClick={toggleAudio} aria-label={audioEnabled?'Mute':'Unmute'} title="Toggle ambient audio">
      ♫<style>{`.audio-toggle{position:fixed;bottom:24px;right:24px;z-index:1001;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--bg);color:var(--mid);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color 300ms,color 300ms}.audio-toggle:hover{border-color:var(--mid);color:var(--text)}.audio-toggle.muted{opacity:0.4}.audio-toggle.hidden{display:none}`}</style>
    </button>
  );
}