const AUDIO_MODES = new Set(['midnight', 'sunny', 'rain', 'snow']);
let activeTimers = [];
let _audioEnabled = true;

function getOrCreateAudioCtx() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!_ctx || _ctx.state === 'closed') { _ctx = new AC(); }
    const ctx = _ctx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (typeof ctx.createBuffer !== 'function') { _ctx = new AC(); return _ctx; }
    return ctx;
  } catch (e) { return null; }
}
let _ctx = null;

export function setAudioEnabled(enabled) { _audioEnabled = enabled; }

function stopAll() {
  Object.values(_nodes).forEach(node => {
    try { if (node.stop) node.stop(); } catch (e) {}
    try { if (node.disconnect) node.disconnect(); } catch (e) {}
  });
  _nodes = {};
  activeTimers.forEach(t => clearTimeout(t));
  activeTimers = [];
}
let _nodes = {};

function playForestAmbience() {
  try {
    const audio = new Audio('/assets/forest.mp3');
    audio.loop = true; audio.volume = 0.5; audio.play().catch(() => {});
    _nodes.sunny = { stop() { audio.pause(); audio.currentTime = 0; } };
  } catch (e) {}
}

function playNightAmbience(ctx) {
  try {
    if (!ctx || typeof ctx.createBuffer !== 'function') return;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.02;
    const source = ctx.createBufferSource();
    source.buffer = buffer; source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 15;
    const gain = ctx.createGain(); gain.gain.value = 0.3;
    source.connect(filter).connect(gain).connect(ctx.destination); source.start();
    _nodes.night = source;
  } catch (e) {}
}

function createPinkNoise(ctx, duration, channels) {
  if (!ctx || typeof ctx.createBuffer !== 'function') return null;
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(channels, len, ctx.sampleRate);
  for (let ch = 0; ch < channels; ch++) {
    const d = buf.getChannelData(ch);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < len; i++) {
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.015; b6=w*0.115926;
    }
  }
  return buf;
}

function playRainAmbience(ctx) {
  try {
    if (!ctx || typeof ctx.createBuffer !== 'function') return;
    const rainBuf = createPinkNoise(ctx, 4, 2); if (!rainBuf) return;
    const rainSrc = ctx.createBufferSource(); rainSrc.buffer = rainBuf; rainSrc.loop = true;
    const rainHP = ctx.createBiquadFilter(); rainHP.type='highpass'; rainHP.frequency.value=400;
    const rainLP = ctx.createBiquadFilter(); rainLP.type='lowpass'; rainLP.frequency.value=8000;
    const rainGain = ctx.createGain(); rainGain.gain.value = 0.18;
    rainSrc.connect(rainHP).connect(rainLP).connect(rainGain).connect(ctx.destination); rainSrc.start();

    const sizzleBuf = createPinkNoise(ctx, 3, 1); if (!sizzleBuf) return;
    const sizzleSrc = ctx.createBufferSource(); sizzleSrc.buffer=sizzleBuf; sizzleSrc.loop=true;
    const sizzleHP = ctx.createBiquadFilter(); sizzleHP.type='highpass'; sizzleHP.frequency.value=3000;
    const sizzleLP = ctx.createBiquadFilter(); sizzleLP.type='lowpass'; sizzleLP.frequency.value=12000;
    const sizzleGain = ctx.createGain(); sizzleGain.gain.value = 0.06;
    sizzleSrc.connect(sizzleHP).connect(sizzleLP).connect(sizzleGain).connect(ctx.destination); sizzleSrc.start();

    const rumbleBuf = createPinkNoise(ctx, 5, 1); if (!rumbleBuf) return;
    const rumbleSrc = ctx.createBufferSource(); rumbleSrc.buffer=rumbleBuf; rumbleSrc.loop=true;
    const rumbleLP = ctx.createBiquadFilter(); rumbleLP.type='lowpass'; rumbleLP.frequency.value=200;
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.2;
    rumbleSrc.connect(rumbleLP).connect(rumbleGain).connect(ctx.destination); rumbleSrc.start();

    function scheduleThunder() {
      if (!_audioEnabled) return;
      try {
        const now = ctx.currentTime, dur = 1.5+Math.random()*3;
        const tBuf = createPinkNoise(ctx, dur, 1); if (!tBuf) return;
        const tSrc = ctx.createBufferSource(); tSrc.buffer=tBuf;
        const tLP = ctx.createBiquadFilter(); tLP.type='lowpass'; tLP.frequency.value=120+Math.random()*80;
        const tGain = ctx.createGain();
        const vol = 0.15+Math.random()*0.2;
        tGain.gain.setValueAtTime(0, now);
        tGain.gain.linearRampToValueAtTime(vol, now+0.05+Math.random()*0.1);
        tGain.gain.exponentialRampToValueAtTime(0.001, now+dur);
        tSrc.connect(tLP).connect(tGain).connect(ctx.destination);
        tSrc.start(now); tSrc.stop(now+dur+0.1);
      } catch(e) {}
      activeTimers.push(setTimeout(scheduleThunder, 8000+Math.random()*20000));
    }

    function scheduleDrip() {
      if (!_audioEnabled) return;
      try {
        const now = ctx.currentTime;
        const count = 1 + Math.floor(Math.random()*3);
        for (let i = 0; i < count; i++) {
          const t = now + Math.random()*0.15;
          const dur = 0.02+Math.random()*0.04;
          const nLen = Math.ceil(ctx.sampleRate*dur);
          const nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate);
          const nd = nBuf.getChannelData(0);
          for (let j = 0; j < nLen; j++) nd[j] = (Math.random()*2-1)*Math.exp(-j/(nLen*0.3));
          const nSrc = ctx.createBufferSource(); nSrc.buffer=nBuf;
          const nBP = ctx.createBiquadFilter(); nBP.type='bandpass';
          nBP.frequency.value=2000+Math.random()*4000; nBP.Q.value=2+Math.random()*3;
          const nGain = ctx.createGain();
          const vol = 0.04+Math.random()*0.06;
          nGain.gain.setValueAtTime(vol, t);
          nGain.gain.exponentialRampToValueAtTime(0.0001, t+dur);
          nSrc.connect(nBP).connect(nGain).connect(ctx.destination);
          nSrc.start(t); nSrc.stop(t+dur+0.01);
        }
      } catch(e) {}
      activeTimers.push(setTimeout(scheduleDrip, 40+Math.random()*100));
    }

    activeTimers.push(setTimeout(scheduleThunder, 3000+Math.random()*5000));
    scheduleDrip();

    _nodes.rain = { stop() { [rainSrc,sizzleSrc,rumbleSrc].forEach(n=>{try{n.stop()}catch(e){}}); } };
  } catch (e) {}
}

function playSnowAmbience(ctx) {
  try {
    if (!ctx || typeof ctx.createBuffer !== 'function') return;

    function createWindNoise(duration, amplitude=0.025) {
      const len = Math.ceil(ctx.sampleRate*duration);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let smooth = 0;
      for (let i = 0; i < len; i++) { const white=(Math.random()*2-1)*amplitude; smooth=smooth*0.985+white*0.16; data[i]=smooth; }
      return buf;
    }

    const baseSrc = ctx.createBufferSource(); baseSrc.buffer=createWindNoise(4.5,0.03); baseSrc.loop=true;
    const baseHP = ctx.createBiquadFilter(); baseHP.type='highpass'; baseHP.frequency.value=120;
    const baseLP = ctx.createBiquadFilter(); baseLP.type='lowpass'; baseLP.frequency.value=1200;
    const baseGain = ctx.createGain(); baseGain.gain.value = 0.095;
    baseSrc.connect(baseHP).connect(baseLP).connect(baseGain).connect(ctx.destination); baseSrc.start();

    const airySrc = ctx.createBufferSource(); airySrc.buffer=createWindNoise(3.5,0.018); airySrc.loop=true;
    const airyHP = ctx.createBiquadFilter(); airyHP.type='highpass'; airyHP.frequency.value=700;
    const airyLP = ctx.createBiquadFilter(); airyLP.type='lowpass'; airyLP.frequency.value=3200;
    const airyGain = ctx.createGain(); airyGain.gain.value = 0.026;
    airySrc.connect(airyHP).connect(airyLP).connect(airyGain).connect(ctx.destination); airySrc.start();

    const gustSrc = ctx.createBufferSource(); gustSrc.buffer=createWindNoise(5.5,0.022); gustSrc.loop=true;
    const gustHP = ctx.createBiquadFilter(); gustHP.type='highpass'; gustHP.frequency.value=250;
    const gustLP = ctx.createBiquadFilter(); gustLP.type='lowpass'; gustLP.frequency.value=2100;
    const gustGain = ctx.createGain(); gustGain.gain.value = 0.024;
    gustSrc.connect(gustHP).connect(gustLP).connect(gustGain).connect(ctx.destination); gustSrc.start();

    const rumbleSrc = ctx.createBufferSource(); rumbleSrc.buffer=createWindNoise(6,0.018); rumbleSrc.loop=true;
    const rumbleLP = ctx.createBiquadFilter(); rumbleLP.type='lowpass'; rumbleLP.frequency.value=180;
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.012;
    rumbleSrc.connect(rumbleLP).connect(rumbleGain).connect(ctx.destination); rumbleSrc.start();

    const airyLfo = ctx.createOscillator(); airyLfo.type='sine'; airyLfo.frequency.value=0.07;
    const airyDepth = ctx.createGain(); airyDepth.gain.value=0.012; airyLfo.connect(airyDepth).connect(airyGain.gain); airyLfo.start();
    const gustLfo = ctx.createOscillator(); gustLfo.type='sine'; gustLfo.frequency.value=0.028;
    const gustDepth = ctx.createGain(); gustDepth.gain.value=0.018; gustLfo.connect(gustDepth).connect(gustGain.gain); gustLfo.start();
    const rumbleLfo = ctx.createOscillator(); rumbleLfo.type='sine'; rumbleLfo.frequency.value=0.021;
    const rumbleDepth = ctx.createGain(); rumbleDepth.gain.value=0.008; rumbleLfo.connect(rumbleDepth).connect(rumbleGain.gain); rumbleLfo.start();

    _nodes.snow = {
      stop() { [baseSrc,airySrc,gustSrc,rumbleSrc,airyLfo,gustLfo,rumbleLfo].forEach(n=>{try{n.stop()}catch(e){}}); }
    };
  } catch (e) {}
}

export function startAudioForMode(mode) {
  if (!_audioEnabled || !AUDIO_MODES.has(mode)) { stopAll(); return; }
  const ctx = getOrCreateAudioCtx();
  if (!ctx) return;
  stopAll();
  switch (mode) {
    case 'midnight': playNightAmbience(ctx); break;
    case 'sunny': playForestAmbience(); break;
    case 'rain': playRainAmbience(ctx); break;
    case 'snow': playSnowAmbience(ctx); break;
  }
}

export function stopAllAudio() { stopAll(); }
