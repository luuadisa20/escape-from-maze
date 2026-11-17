// Efek suara sintetis menggunakan Web Audio API, sehingga tidak memerlukan file audio eksternal.
window.SoundFX = (() => {
  let enabled=true, ctx;
  function tone(freq,duration,type="sine",gain=.08,delay=0){
    if(!enabled)return;
    try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();
      const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,ctx.currentTime+delay);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+delay+duration);o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+delay);o.stop(ctx.currentTime+delay+duration);
    }catch(e){}
  }
  return {toggle(){enabled=!enabled;return enabled},isOn(){return enabled},
    click(){tone(520,.05,"sine",.035)},correct(){tone(660,.12);tone(880,.18,"sine",.07,.12)},
    wrong(){tone(180,.22,"triangle",.08)},win(){[523,659,784,1046].forEach((f,i)=>tone(f,.25,"sine",.07,i*.14))},
    lose(){[440,349,262].forEach((f,i)=>tone(f,.28,"triangle",.07,i*.2))}
  };
})();