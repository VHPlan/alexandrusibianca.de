/* ==========================================================
   THE AB WEDDING — Alex & Bianca
   Interaction layer
   ========================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const body = document.body;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOBILE = window.matchMedia('(max-width: 899px)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, RM ? Math.min(ms, 120) : ms));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------
     1. LIGHT CANVAS — gold dust, twinkling stars, soft bokeh
     --------------------------------------------------------- */
  const Dust = (() => {
    const cv = $('#dust');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, DPR = 1;
    const ambient = [];
    const sparks = [];
    const N = RM ? 0 : MOBILE ? 46 : 90;

    // pre-rendered sprites (cheap drawImage on phones)
    function sprite(size, draw) {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      draw(c.getContext('2d'), size);
      return c;
    }
    const SPR = {
      dot: sprite(32, (g, s) => {
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        r.addColorStop(0, 'rgba(255,248,225,1)');
        r.addColorStop(0.25, 'rgba(226,188,104,.95)');
        r.addColorStop(0.6, 'rgba(206,166,82,.25)');
        r.addColorStop(1, 'rgba(206,166,82,0)');
        g.fillStyle = r; g.fillRect(0, 0, s, s);
      }),
      star: sprite(64, (g, s) => {
        const c = s / 2;
        const halo = g.createRadialGradient(c, c, 0, c, c, c);
        halo.addColorStop(0, 'rgba(255,236,180,.9)');
        halo.addColorStop(0.2, 'rgba(232,196,112,.35)');
        halo.addColorStop(1, 'rgba(232,196,112,0)');
        g.fillStyle = halo; g.fillRect(0, 0, s, s);
        g.beginPath();
        g.moveTo(c, 0);
        g.quadraticCurveTo(c + 3, c - 3, s, c);
        g.quadraticCurveTo(c + 3, c + 3, c, s);
        g.quadraticCurveTo(c - 3, c + 3, 0, c);
        g.quadraticCurveTo(c - 3, c - 3, c, 0);
        const lg = g.createRadialGradient(c, c, 0, c, c, c);
        lg.addColorStop(0, '#fffaf0');
        lg.addColorStop(0.35, '#e8c878');
        lg.addColorStop(1, 'rgba(184,145,63,.2)');
        g.fillStyle = lg; g.fill();
      }),
      bokeh: sprite(128, (g, s) => {
        const r = g.createRadialGradient(s / 2, s / 2, s * 0.1, s / 2, s / 2, s / 2);
        r.addColorStop(0, 'rgba(225,225,230,.10)');
        r.addColorStop(0.75, 'rgba(215,215,222,.08)');
        r.addColorStop(0.92, 'rgba(200,200,210,.14)');
        r.addColorStop(1, 'rgba(200,200,210,0)');
        g.fillStyle = r; g.fillRect(0, 0, s, s);
      })
    };

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function makeAmbient(init) {
      const roll = Math.random();
      const type = roll < 0.09 ? 'bokeh' : roll < 0.42 ? 'star' : 'dot';
      const size = type === 'bokeh' ? 30 + Math.random() * 60 : type === 'star' ? 8 + Math.random() * 14 : 3 + Math.random() * 5;
      return {
        type, size,
        x: Math.random() * W,
        y: init ? Math.random() * H : H + size,
        vy: -(Math.random() * (type === 'bokeh' ? 0.12 : 0.3) + 0.05),
        vx: (Math.random() - 0.5) * 0.15,
        ph: Math.random() * Math.PI * 2,
        tw: type === 'star' ? Math.random() * 0.04 + 0.015 : Math.random() * 0.02 + 0.006,
        rot: Math.random() * Math.PI,
        a: type === 'bokeh' ? Math.random() * 0.5 + 0.35 : Math.random() * 0.5 + 0.5
      };
    }

    function spark(x, y, vx, vy, g, big) {
      sparks.push({
        x, y, vx, vy, g,
        size: big ? 10 + Math.random() * 16 : 4 + Math.random() * 7,
        type: Math.random() < (big ? 0.6 : 0.35) ? 'star' : 'dot',
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.08,
        life: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }

    function burst(x, y, n = 40, power = 1) {
      if (RM) return;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = (Math.random() * 3.4 + 0.6) * power;
        spark(x, y, Math.cos(ang) * sp, Math.sin(ang) * sp - 0.8 * power, 0.025, Math.random() < 0.35);
      }
    }

    function rise(rect, duration = 1400, rate = 3) {
      if (RM) return;
      const end = performance.now() + duration;
      (function tick() {
        for (let i = 0; i < rate; i++) {
          spark(rect.left + Math.random() * rect.width, rect.top + rect.height * (0.3 + Math.random() * 0.4),
            (Math.random() - 0.5) * 0.8, -(Math.random() * 2.4 + 0.8), -0.004, Math.random() < 0.3);
        }
        if (performance.now() < end) requestAnimationFrame(tick);
      })();
    }

    // touch / pointer trail of tiny stars
    let lastTrail = 0;
    function trail(x, y) {
      if (RM) return;
      const now = performance.now();
      if (now - lastTrail < 40) return;
      lastTrail = now;
      for (let i = 0; i < 2; i++) {
        spark(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 0.8, -(Math.random() * 0.8 + 0.2), 0.01, false);
      }
    }

    function draw(p, a) {
      const s = p.size;
      ctx.globalAlpha = a;
      if (p.type === 'star') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(SPR.star, -s, -s, s * 2, s * 2);
        ctx.restore();
      } else {
        ctx.drawImage(SPR[p.type], p.x - s, p.y - s, s * 2, s * 2);
      }
    }

    /* ---- falling gold glitter (foil flakes that flip & catch light) ---- */
    const rain = [];
    const RN = RM ? 0 : MOBILE ? 70 : 130;
    let rainK = 1, rainTarget = 1;
    function makeFlake(init) {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : -10 - Math.random() * 40,
        w: Math.random() * 2.6 + 1.4,
        h: Math.random() * 3.2 + 1.8,
        vy: Math.random() * 0.55 + 0.35,
        sway: Math.random() * 0.6 + 0.2,
        ph: Math.random() * Math.PI * 2,
        spin: Math.random() * Math.PI * 2,
        vs: Math.random() * 0.08 + 0.03,
        rot: Math.random() * Math.PI,
        hue: Math.random()
      };
    }
    function drawRain() {
      rainK += (rainTarget - rainK) * 0.02;
      if (rainK < 0.01) return;
      for (const f of rain) {
        f.ph += 0.015; f.spin += f.vs;
        f.y += f.vy;
        f.x += Math.sin(f.ph) * f.sway * 0.5;
        if (f.y > H + 10) Object.assign(f, makeFlake(false));
        const face = Math.cos(f.spin);           // -1..1 flip
        const sx = Math.abs(face) * f.w + 0.3;
        const flash = Math.pow(Math.max(0, face), 12); // catches light when facing
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot + f.ph * 0.3);
        ctx.globalAlpha = (0.55 + flash * 0.45) * rainK;
        ctx.fillStyle = f.hue < 0.5 ? '#c9a24f' : f.hue < 0.85 ? '#dcb867' : '#b08a3c';
        ctx.fillRect(-sx / 2, -f.h / 2, sx, f.h);
        if (flash > 0.25) {
          ctx.globalAlpha = flash * rainK;
          ctx.drawImage(SPR.star, -f.h * 1.6, -f.h * 1.6, f.h * 3.2, f.h * 3.2);
        }
        ctx.restore();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawRain();
      for (const p of ambient) {
        p.x += p.vx; p.y += p.vy; p.ph += p.tw;
        if (p.y < -p.size * 2) Object.assign(p, makeAmbient(false));
        const tw = p.type === 'star' ? Math.max(0, Math.sin(p.ph)) ** 3 : 0.55 + Math.sin(p.ph) * 0.45;
        if (p.type === 'star') p.rot += 0.004;
        draw(p, p.a * tw);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.985; s.vy = s.vy * 0.985 + s.g;
        s.x += s.vx; s.y += s.vy; s.rot += s.vr; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        draw(s, s.life);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }

    resize();
    for (let i = 0; i < N; i++) ambient.push(makeAmbient(true));
    for (let i = 0; i < RN; i++) rain.push(makeFlake(true));
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', (e) => trail(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY); }, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('input, textarea')) return;
      burst(e.clientX, e.clientY, MOBILE ? 8 : 12, 0.45);
    }, { passive: true });
    requestAnimationFrame(loop);

    return { burst, rise, setRain: (k) => { rainTarget = k; } };
  })();

  /* twinkling star glints scattered around the envelope */
  (() => {
    const intro = $('#intro');
    if (!intro || RM) return;
    const spots = [
      [12, 22, 16], [86, 18, 12], [78, 34, 20], [18, 44, 11], [90, 52, 14],
      [8, 62, 18], [70, 70, 10], [30, 14, 9], [60, 10, 13], [24, 78, 14], [88, 84, 11], [50, 88, 9]
    ];
    spots.forEach(([x, y, s], i) => {
      const t = document.createElement('span');
      t.className = 'twinkle';
      t.style.left = x + '%';
      t.style.top = y + '%';
      t.style.setProperty('--s', s + 'px');
      t.style.setProperty('--t', (2.4 + (i % 4) * 0.7) + 's');
      t.style.setProperty('--dl', (i * 0.37).toFixed(2) + 's');
      intro.appendChild(t);
    });
  })();

  /* ---------------------------------------------------------
     2. MUSIC — local MP3 if present, otherwise the YouTube track
        (official embed), soft generative pad as last resort
     --------------------------------------------------------- */
  const Music = (() => {
    const btn = $('#music');
    const YT_ID = 'q9wpOvgKCIg';
    const LOCAL = 'assets/audio/lele.mp3';
    const VOL = 0.6;
    let playing = false;
    let mode = null;             // 'file' | 'yt' | 'pad'
    let hasFile = false;
    let yt = null, ytReady = false;
    let ctx = null, master = null, voices = [], chordTimer = null;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;

    // 1) local file?
    fetch(LOCAL, { method: 'HEAD' })
      .then((r) => { if (r.ok) { hasFile = true; audio.src = LOCAL; } else loadYT(); })
      .catch(loadYT);

    // 2) YouTube IFrame player (kept out of the layout)
    function loadYT() {
      if (window.YT && window.YT.Player) return makePlayer();
      const host = document.createElement('div');
      host.className = 'yt-host';
      host.innerHTML = '<div id="ytPlayer"></div>';
      document.body.appendChild(host);
      window.onYouTubeIframeAPIReady = makePlayer;
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    function makePlayer() {
      yt = new YT.Player('ytPlayer', {
        width: 200, height: 200, videoId: YT_ID,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: YT_ID, playsinline: 1, disablekb: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: () => { ytReady = true; yt.setVolume(0); if (playing && mode !== 'pad') startYT(); },
          onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) { yt.seekTo(0); yt.playVideo(); } },
          onError: () => { ytReady = false; if (playing) padOn(); }
        }
      });
    }
    let ytFade = 0;
    function ytVolume(to, ms) {
      clearInterval(ytFade);
      let v = yt.getVolume ? yt.getVolume() : 0;
      const target = to * 100, step = (target - v) / (ms / 50);
      ytFade = setInterval(() => {
        v += step;
        if ((step >= 0 && v >= target) || (step < 0 && v <= target)) {
          v = target; clearInterval(ytFade);
          if (to === 0) yt.pauseVideo();
        }
        yt.setVolume(Math.round(v));
      }, 50);
    }
    function startYT() {
      mode = 'yt';
      yt.unMute();
      yt.playVideo();
      ytVolume(VOL, 2000);
    }

    // 3) generative pad fallback
    const CHORDS = [
      [220.0, 277.18, 329.63, 415.30],
      [184.99, 233.08, 277.18, 369.99],
      [146.83, 220.0, 277.18, 369.99],
      [164.81, 207.65, 246.94, 329.63]
    ];
    function initPad() {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.4;
      const dl = ctx.createDelay(); dl.delayTime.value = 0.42;
      const fb = ctx.createGain(); fb.gain.value = 0.38;
      const wet = ctx.createGain(); wet.gain.value = 0.45;
      lp.connect(master); lp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
      master.connect(ctx.destination);
      for (let i = 0; i < 4; i++) {
        const g = ctx.createGain(); g.gain.value = 0;
        const o1 = ctx.createOscillator(); o1.type = 'sine';
        const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.detune.value = 6;
        const g2 = ctx.createGain(); g2.gain.value = 0.25;
        o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp);
        o1.start(); o2.start();
        voices.push({ g, o1, o2 });
      }
    }
    let ci = 0;
    function nextChord() {
      const t = ctx.currentTime;
      const ch = CHORDS[ci++ % CHORDS.length];
      voices.forEach((v, i) => {
        v.o1.frequency.setTargetAtTime(ch[i], t, 0.9);
        v.o2.frequency.setTargetAtTime(ch[i] * 2, t, 0.9);
        v.g.gain.cancelScheduledValues(t);
        v.g.gain.setTargetAtTime(0.05 + Math.random() * 0.02, t, 1.2);
      });
    }
    function padOn() {
      initPad();
      if (!ctx) return;
      mode = 'pad';
      ctx.resume();
      nextChord();
      clearInterval(chordTimer);
      chordTimer = setInterval(nextChord, 7000);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 1.4);
    }

    let fadeRaf = 0;
    function fadeAudio(to, ms = 1600) {
      cancelAnimationFrame(fadeRaf);
      const from = audio.volume; const t0 = performance.now();
      (function step() {
        const k = clamp((performance.now() - t0) / ms, 0, 1);
        audio.volume = from + (to - from) * k;
        if (k < 1) fadeRaf = requestAnimationFrame(step);
        else if (to === 0) audio.pause();
      })();
    }

    function setUI(on) {
      btn.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Oprește muzica' : 'Pornește muzica');
    }

    function play() {
      if (playing) return;
      playing = true;
      setUI(true);
      if (mode === 'pad') return padOn();
      if (hasFile) {
        audio.volume = 0;
        const p = audio.play();
        mode = 'file';
        if (p && p.then) p.then(() => fadeAudio(VOL)).catch(() => { if (playing) padOn(); });
        else audio.volume = VOL;
        return;
      }
      if (ytReady) return startYT();
      // player still loading: it will start itself in onReady
    }

    function stop() {
      if (!playing) return;
      playing = false;
      setUI(false);
      if (mode === 'file') fadeAudio(0, 900);
      else if (mode === 'yt' && yt) ytVolume(0, 900);
      else if (ctx && master) {
        clearInterval(chordTimer);
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
      }
    }

    btn.addEventListener('click', () => (playing ? stop() : play()));
    // keep playing when the tab is hidden; if the OS/browser paused it, resume on return
    document.addEventListener('visibilitychange', () => {
      if (document.hidden || !playing) return;
      if (mode === 'file' && audio.paused) audio.play().catch(() => {});
      else if (mode === 'yt' && yt && yt.getPlayerState && yt.getPlayerState() !== 1) yt.playVideo();
      else if (mode === 'pad' && ctx && ctx.state === 'suspended') ctx.resume();
    });

    return { play, stop, show: () => btn.classList.add('is-visible') };
  })();

  /* ---------------------------------------------------------
     3. ENVELOPE — tilt + cinematic opening
     --------------------------------------------------------- */
  const intro = $('#intro');
  const env = $('#env');
  const seal = $('#seal');
  const flap = $('#flap');
  const sheen = $('.env__sheen');
  const site = $('#site');

  const tilt = { x: 0, y: 0, tx: 0, ty: 0, active: true };

  function setTarget(nx, ny) { // -1..1
    tilt.tx = clamp(nx, -1, 1);
    tilt.ty = clamp(ny, -1, 1);
  }

  window.addEventListener('pointermove', (e) => {
    if (!tilt.active || e.pointerType === 'touch') return;
    setTarget((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  // touch drag tilt on phones
  env.addEventListener('touchmove', (e) => {
    if (!tilt.active) return;
    const t = e.touches[0]; const r = env.getBoundingClientRect();
    setTarget(((t.clientX - r.left) / r.width) * 2 - 1, ((t.clientY - r.top) / r.height) * 2 - 1);
  }, { passive: true });
  env.addEventListener('touchend', () => setTarget(0, 0), { passive: true });

  function onOrient(e) {
    if (!tilt.active || e.gamma == null) return;
    setTarget(e.gamma / 25, (e.beta - 45) / 25);
  }
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', onOrient, { passive: true });
  }

  // idle breathing when no input
  let idleT = 0;
  (function tiltLoop() {
    if (!tilt.active) return;
    idleT += 0.008;
    const ix = tilt.tx + Math.sin(idleT) * 0.12;
    const iy = tilt.ty + Math.cos(idleT * 0.8) * 0.08;
    tilt.x = lerp(tilt.x, ix, 0.06);
    tilt.y = lerp(tilt.y, iy, 0.06);
    env.style.setProperty('--ry', (tilt.x * 12).toFixed(2) + 'deg');
    env.style.setProperty('--rx', (-tilt.y * 9).toFixed(2) + 'deg');
    env.style.setProperty('--mx', (50 + tilt.x * 38).toFixed(1) + '%');
    requestAnimationFrame(tiltLoop);
  })();

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r };
  }

  let opened = false;
  async function openInvitation() {
    if (opened) return;
    opened = true;

    // iOS motion permission piggybacks on this gesture (non-blocking)
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }

    Music.play();
    tilt.active = false;
    setTarget(0, 0);
    env.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)';
    env.style.setProperty('--rx', '0deg');
    env.style.setProperty('--ry', '0deg');

    body.classList.add('is-cine');
    intro.classList.add('is-opening');
    sheen.classList.add('is-sweep');

    await wait(500);
    seal.classList.add('is-lit');

    await wait(600);
    const s = center(seal);
    seal.classList.add('is-broken');
    Dust.burst(s.x, s.y, MOBILE ? 46 : 70, 1.1);
    if (navigator.vibrate) navigator.vibrate(12);

    await wait(300);
    flap.classList.add('is-open');

    await wait(600);
    intro.classList.add('is-glow');

    await wait(300);
    intro.classList.add('is-rise');
    const er = env.getBoundingClientRect();
    Dust.rise({ left: er.left + er.width * 0.1, top: er.top, width: er.width * 0.8, height: er.height }, 1600, MOBILE ? 2 : 3);

    await wait(1300);
    intro.classList.add('is-lift');

    await wait(700);
    intro.classList.add('is-fill');
    body.classList.add('is-bloom');

    await wait(700);
    window.scrollTo(0, 0);
    body.classList.remove('is-locked');
    site.classList.add('is-on');
    site.setAttribute('aria-hidden', 'false');
    intro.classList.add('is-gone');
    Dust.setRain(0.3);

    await wait(400);
    body.classList.remove('is-bloom');
    await wait(500);
    body.classList.remove('is-cine');
    Music.show();
    setTimeout(() => intro.remove(), 1500);
  }

  env.addEventListener('click', openInvitation);
  $('#openBtn').addEventListener('click', openInvitation);
  env.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
  });

  /* ---------------------------------------------------------
     4. HERO — letter split
     --------------------------------------------------------- */
  $$('[data-split]').forEach((el, idx) => {
    const txt = el.textContent.trim();
    el.setAttribute('aria-label', txt);
    el.innerHTML = '';
    [...txt].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = (i === 0 && c === 'A') ? 'ch capA' : 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      if (idx > 0) s.style.setProperty('--base', '520ms');
      s.textContent = c;
      el.appendChild(s);
    });
  });

  /* ---------------------------------------------------------
     5. COUNTDOWN
     --------------------------------------------------------- */
  const TARGET = new Date(2027, 5, 20, 14, 0, 0); // 20 Iunie 2027, 14:00
  const cd = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
  const pad = (n, l = 2) => String(n).padStart(l, '0');

  function setNum(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  }
  function updateCountdown() {
    let diff = Math.max(0, TARGET - new Date());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    setNum(cd.d, pad(d, d > 99 ? 3 : 2));
    setNum(cd.h, pad(h));
    setNum(cd.m, pad(m));
    setNum(cd.s, pad(s));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* calendar (.ics) */
  $('#icsBtn').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The AB Wedding//RO', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:ab-wedding-20270620@alexandrusibianca',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:20270620T140000',
      'DTEND:20270621T040000',
      'SUMMARY:Nunta Alex & Bianca',
      'LOCATION:Catedrala Sf. Iosif\\, București',
      'DESCRIPTION:The AB Wedding — Abia așteptăm să sărbătorim împreună.',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'Nunta-Alex-Bianca.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------------------------------------------------------
     6. REVEALS
     --------------------------------------------------------- */
  // auto-stagger siblings inside the same parent
  const groups = new Map();
  $$('.site .r, .site .mask').forEach((el) => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * 0.12).toFixed(2) + 's');
    groups.set(p, i + 1);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target;
      (t._reveal || [t]).forEach((el) => el.classList.add('in'));
      io.unobserve(t);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.site .r').forEach((el) => io.observe(el));
  // clip-path: inset(100%) makes the mask itself report as invisible, so watch its parent
  $$('.site .mask').forEach((el) => {
    const host = el.parentElement;
    (host._reveal = host._reveal || []).push(el);
    io.observe(host);
  });

  /* ---------------------------------------------------------
     7. SCROLL LOOP — parallax, hero exit, timeline
     --------------------------------------------------------- */
  const parallax = $$('[data-parallax]').map((el) => ({ el, k: parseFloat(el.dataset.parallax) || 0 }));
  const heroContent = $('.hero__content');
  const hero = $('#hero');
  const tl = $('#tl');
  const tlFill = $('#tlFill');
  const tlRail = $('.tl__rail');
  const tlItems = $$('.tl__item');
  let vh = window.innerHeight;
  window.addEventListener('resize', () => { vh = window.innerHeight; }, { passive: true });

  function frame() {
    if (site.classList.contains('is-on') && !RM) {
      const sy = window.scrollY;

      // parallax
      for (const p of parallax) {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const off = (r.top + r.height / 2 - vh / 2) * p.k;
        p.el.style.translate = `0 ${off.toFixed(1)}px`;
      }

      // hero content drifts, blurs & fades as you leave
      const hh = hero.offsetHeight;
      const k = clamp(sy / (hh * 0.8), 0, 1);
      heroContent.style.transform = `translateY(${(-k * 60).toFixed(1)}px) scale(${(1 - k * 0.06).toFixed(3)})`;
      heroContent.style.opacity = (1 - k * 1.1).toFixed(3);
      heroContent.style.filter = k > 0.02 ? `blur(${(k * 6).toFixed(1)}px)` : '';
    }

    // timeline progress
    const rr = tlRail.getBoundingClientRect();
    if (rr.top < vh && rr.bottom > 0) {
      const line = vh * 0.62;
      const prog = clamp((line - rr.top) / rr.height, 0, 1);
      tlFill.style.height = (prog * 100).toFixed(2) + '%';
      tlItems.forEach((it) => {
        const ir = it.getBoundingClientRect();
        it.classList.toggle('on', ir.top + 14 < line);
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // smooth anchor for scroll cue
  $('.scroll-cue').addEventListener('click', (e) => {
    e.preventDefault();
    $('#date').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------
     8. GALLERY REEL + LIGHTBOX
     --------------------------------------------------------- */
  const reel = $('#reel');
  const slides = $$('.reel__slide', reel);
  const gIdx = $('#gIdx');
  const reelBar = $('#reelBar');
  $('#gTot').textContent = pad(slides.length);
  let active = -1;

  function updateReel() {
    const rc = reel.getBoundingClientRect();
    const mid = rc.left + rc.width / 2;
    let best = 0, bd = Infinity;
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== active) {
      active = best;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === best));
      gIdx.textContent = pad(best + 1);
    }
    const max = reel.scrollWidth - reel.clientWidth;
    const p = max > 0 ? reel.scrollLeft / max : 0;
    reelBar.style.transform = `scaleX(${(1 / slides.length + p * (1 - 1 / slides.length)).toFixed(3)})`;
  }
  let reelRaf = 0;
  reel.addEventListener('scroll', () => {
    cancelAnimationFrame(reelRaf);
    reelRaf = requestAnimationFrame(updateReel);
  }, { passive: true });
  window.addEventListener('resize', updateReel, { passive: true });
  updateReel();

  // desktop: drag to scroll
  let drag = null;
  reel.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, sl: reel.scrollLeft, moved: false };
    reel.style.scrollSnapType = 'none';
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    reel.scrollLeft = drag.sl - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    reel.style.scrollSnapType = '';
    setTimeout(() => { drag = null; }, 0);
  });

  const lb = $('#lb');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  let lbI = 0;

  function lbShow(i, instant) {
    lbI = (i + slides.length) % slides.length;
    const img = $('img', slides[lbI]);
    const cap = $('figcaption', slides[lbI]).textContent;
    const apply = () => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = cap;
      lbCap.textContent = cap;
      lbImg.classList.remove('is-fading');
    };
    if (instant) return apply();
    lbImg.classList.add('is-fading');
    setTimeout(apply, RM ? 0 : 380);
  }
  function lbOpen(i) {
    lbShow(i, true);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked');
  }
  function lbClose() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-locked');
  }

  slides.forEach((s, i) => s.addEventListener('click', () => {
    if (drag && drag.moved) return;
    if (i !== active) {
      s.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    lbOpen(i);
  }));
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbI - 1));
  $('#lbNext').addEventListener('click', () => lbShow(lbI + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb__stage')) lbClose(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbI - 1);
    if (e.key === 'ArrowRight') lbShow(lbI + 1);
  });
  let sx = 0, sy0 = 0;
  lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy0 = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbShow(lbI + (dx < 0 ? 1 : -1));
    else if (dy > 90) lbClose();
  }, { passive: true });

  /* ---------------------------------------------------------
     9. RSVP
     --------------------------------------------------------- */
  const form = $('#rsvpForm');
  const choice = $('.choice');
  const attendFields = $('#attendFields');
  const fName = $('#fName');
  const submitBtn = $('#submitBtn');
  const thanks = $('#thanks');
  const state = { attend: 'yes', guests: 2, kids: 0, menu: 'Clasic' };

  $$('.choice__opt').forEach((b) => b.addEventListener('click', () => {
    state.attend = b.dataset.attend;
    $$('.choice__opt').forEach((o) => {
      const on = o === b;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-checked', String(on));
    });
    choice.classList.toggle('is-no', state.attend === 'no');
    attendFields.classList.toggle('is-closed', state.attend === 'no');
    $('.btn-confirm__txt').textContent = state.attend === 'no' ? 'Trimite răspunsul' : 'Confirmă prezența';
  }));

  const LIM = { guests: [1, 10], kids: [0, 10] };
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.step;
    state[k] = clamp(state[k] + Number(b.dataset.d), LIM[k][0], LIM[k][1]);
    const out = $('#' + k);
    out.textContent = state[k];
    out.animate([{ transform: 'scale(1.35)', color: '#f3dfa6' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
  }));

  $$('#menu .chip').forEach((c) => c.addEventListener('click', () => {
    state.menu = c.dataset.v;
    $$('#menu .chip').forEach((o) => o.classList.toggle('is-on', o === c));
  }));

  fName.addEventListener('input', () => fName.closest('.field').classList.remove('is-err'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = fName.value.trim();
    if (name.length < 2) {
      const f = fName.closest('.field');
      f.classList.add('is-err');
      f.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 320 });
      fName.focus();
      return;
    }
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const entry = {
      name,
      attend: state.attend,
      guests: state.attend === 'yes' ? state.guests : 0,
      kids: state.attend === 'yes' ? state.kids : 0,
      menu: state.attend === 'yes' ? state.menu : '',
      message: $('#fMsg').value.trim(),
      at: new Date().toISOString()
    };
    try {
      const all = JSON.parse(localStorage.getItem('ab-rsvp') || '[]');
      all.push(entry);
      localStorage.setItem('ab-rsvp', JSON.stringify(all));
    } catch (_) { /* storage unavailable */ }

    await wait(1300);
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
    $('#thanksName').textContent = ', ' + name.split(' ')[0];
    $('.thanks__txt').textContent = state.attend === 'yes'
      ? 'Abia așteptăm să sărbătorim împreună.'
      : 'Ne va fi dor de tine. Îți mulțumim că ne-ai anunțat.';
    form.classList.add('is-hidden');
    thanks.classList.add('is-on');
    const c = center(thanks);
    setTimeout(() => Dust.burst(c.x, c.r.top + 60, MOBILE ? 50 : 80, 1), 350);
  });

  $('#editRsvp').addEventListener('click', () => {
    thanks.classList.remove('is-on');
    form.classList.remove('is-hidden');
  });

  /* ---------------------------------------------------------
     9b. BACK TO TOP — appears when you reach the bottom
     --------------------------------------------------------- */
  const toTop = $('#toTop');
  function checkTop() {
    const nearEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - window.innerHeight * 0.6;
    toTop.classList.toggle('is-visible', site.classList.contains('is-on') && nearEnd);
  }
  window.addEventListener('scroll', checkTop, { passive: true });
  window.addEventListener('resize', checkTop, { passive: true });
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    const r = toTop.getBoundingClientRect();
    Dust.burst(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 18 : 26, 0.7);
  });

  /* ---------------------------------------------------------
     10. DEBUG — ?skip opens directly (for previews)
     --------------------------------------------------------- */
  if (/[?&]skip\b/.test(location.search)) {
    opened = true; tilt.active = false;
    intro.remove();
    body.classList.remove('is-locked');
    site.classList.add('is-on');
    site.setAttribute('aria-hidden', 'false');
    $('#music').classList.add('is-visible');
    if (/[?&]all\b/.test(location.search)) {
      $$('.r, .mask').forEach((el) => el.classList.add('in'));
    }
  }
})();
