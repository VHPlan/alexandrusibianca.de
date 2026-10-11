/* =====================================================================
   /pentru-nasul-nostru — motorul paginii
   scene cinematice · particule aurii · muzică discretă
   ===================================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOBILE = window.matchMedia('(max-width: 899px)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const T = (s) => (RM ? Math.min(s, .6) : s) * 1000;
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------
     FX — fine gold motes + an elegant golden bloom on „DA”
     --------------------------------------------------------- */
  const Fx = (() => {
    const cv = $('#fx'), ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, run = !document.hidden, boost = 0;
    const motes = [], dust = [], stars = [];
    const sprite = (() => {
      const s = document.createElement('canvas'); s.width = s.height = 64;
      const g = s.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,240,205,1)'); gr.addColorStop(.2, 'rgba(226,190,115,.85)');
      gr.addColorStop(.5, 'rgba(196,156,74,.2)'); gr.addColorStop(1, 'rgba(184,145,63,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s;
    })();
    const size = () => { W = innerWidth; H = innerHeight; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    size(); addEventListener('resize', size);

    const mk = (init) => ({
      x: Math.random() * W, y: init ? Math.random() * H : H + 10,
      r: 2.5 + Math.random() * 6, vy: .05 + Math.random() * .16, ph: Math.random() * 6.3,
      sp: .004 + Math.random() * .01, a: .25 + Math.random() * .45
    });
    const N = RM ? 0 : MOBILE ? 22 : 34;
    for (let i = 0; i < N; i++) motes.push(mk(true));

    function star(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
    }

    // soft golden bloom expanding from a point
    function bloom(x, y, n) {
      if (RM) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = .4 + Math.pow(Math.random(), .6) * 3.2;
        dust.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .3, r: 3 + Math.random() * 9, life: 0, max: 160 + Math.random() * 200, ph: Math.random() * 6.3 });
      }
    }
    // twinkling stars slowly falling, spawned over time
    function shower(total, ms) {
      if (RM) return;
      const per = Math.max(1, Math.round(total / (ms / 120)));
      let left = total;
      const id = setInterval(() => {
        for (let i = 0; i < per && left > 0; i++, left--) {
          stars.push({ x: Math.random() * W, y: -10 - Math.random() * 40, vx: (Math.random() - .5) * .3, vy: .35 + Math.random() * .8, s: 2 + Math.random() * 4, ph: Math.random() * 6.3, sp: .06 + Math.random() * .12, life: 0, max: 500 + Math.random() * 400 });
        }
        if (left <= 0) clearInterval(id);
      }, 120);
    }
    function celebrate() {
      bloom(W / 2, H * .5, MOBILE ? 110 : 170);
      setTimeout(() => bloom(W / 2, H * .5, MOBILE ? 50 : 80), 700);
      shower(MOBILE ? 110 : 180, 9000);
      boost = 1;
      setTimeout(() => { for (let i = 0; i < (MOBILE ? 10 : 16); i++) motes.push(mk(true)); }, 1500);
    }

    function tick() {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      boost *= .996;
      for (const m of motes) {
        m.y -= m.vy * (1 + boost); m.ph += m.sp; m.x += Math.sin(m.ph) * .2;
        if (m.y < -20) Object.assign(m, mk(false));
        ctx.globalAlpha = m.a * (.5 + Math.sin(m.ph * 3) * .5);
        ctx.drawImage(sprite, m.x - m.r / 2, m.y - m.r / 2, m.r, m.r);
      }
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i]; d.life++; d.ph += .08;
        d.vx *= .975; d.vy = d.vy * .975 - .004; d.x += d.vx + Math.sin(d.ph) * .15; d.y += d.vy;
        const k = 1 - d.life / d.max; if (k <= 0) { dust.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, k * 1.4) * (.6 + Math.sin(d.ph * 2) * .4);
        ctx.drawImage(sprite, d.x - d.r / 2, d.y - d.r / 2, d.r, d.r);
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const g = stars[i]; g.life++; g.ph += g.sp; g.x += g.vx + Math.sin(g.ph * .3) * .25; g.y += g.vy;
        const k = clamp((g.max - g.life) / 60, 0, 1); if (k <= 0 || g.y > H + 20) { stars.splice(i, 1); continue; }
        const tw = .3 + .7 * Math.abs(Math.sin(g.ph));
        ctx.globalAlpha = k * tw * .5; ctx.drawImage(sprite, g.x - g.s * 1.8, g.y - g.s * 1.8, g.s * 3.6, g.s * 3.6);
        ctx.globalAlpha = k * tw * .9; ctx.fillStyle = tw > .85 ? '#fffaf0' : '#d4b064'; star(g.x, g.y, g.s * tw);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => { const was = run; run = !document.hidden; if (run && !was) requestAnimationFrame(tick); });
    return { bloom, celebrate };
  })();

  /* ---------------------------------------------------------
     MUSIC
     1) /assets/audio/nasul-mare.mp3 — dacă există (instrumental ales de voi)
     2) altfel: o compoziție instrumentală generată live (pian + coarde)
     Totul trece printr-un GainNode → fade-uri fine și pe iPhone.
     --------------------------------------------------------- */
  const Music = (() => {
    const btn = $('#music');
    const FILE = '/assets/audio/nasul-mare.mp3';
    const VOL = .75, VOL_SWELL = 1;
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, out = null, mode = 'gen', on = false, userOff = false, swelled = false, started = false;
    let el = null, gen = null;

    // does the instrumental file exist? (decided before the first tap)
    fetch(FILE, { method: 'HEAD', cache: 'no-store' })
      .then((r) => { if (r.ok && /audio|mpeg|octet/.test(r.headers.get('content-type') || 'audio')) mode = 'file'; })
      .catch(() => {});

    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}

    function ensure() {
      if (ctx || !AC) return !!ctx;
      ctx = new AC();
      out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
      return true;
    }
    function build() {
      if (started) return;
      started = true;
      if (mode === 'file') {
        el = new Audio(FILE); el.loop = true; el.preload = 'auto'; el.playsInline = true; el.setAttribute('playsinline', '');
        try { ctx.createMediaElementSource(el).connect(out); } catch (_) { el.volume = VOL; }
        el.addEventListener('error', () => { mode = 'gen'; el = null; gen = Score(ctx, out); if (swelled) gen.swell(); }, { once: true });
      } else {
        gen = Score(ctx, out);
      }
    }
    function ramp(to, sec) {
      if (!ctx) return;
      const t = ctx.currentTime, g = out.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + sec);
    }
    function ui() { btn.classList.toggle('is-on', on); btn.setAttribute('aria-pressed', String(on)); }

    // must be called synchronously inside a user gesture (or after autoplay was allowed)
    function play() {
      if (!ensure()) return;
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      build();
      if (el) el.play().catch(() => {});
      if (gen) gen.start();
      on = true; ui();
      ramp(swelled ? VOL_SWELL : VOL, 3.5);
    }
    function stop() {
      on = false; ui();
      ramp(0, 1.2);
      setTimeout(() => { if (on) return; if (el) el.pause(); if (gen) gen.stop(); }, 1300);
    }

    // try autoplay quietly; browsers usually block it → we start at the first „Continuă”
    function tryAutoplay() {
      if (!AC) return;
      ensure();
      const p = ctx.resume ? ctx.resume() : Promise.resolve();
      Promise.race([p, new Promise((r) => setTimeout(r, 400))]).then(() => {
        if (ctx.state === 'running' && !on && !userOff) {
          if (mode === 'file') return;          // media elements need a real tap → wait for „Continuă”
          play();
        }
      }).catch(() => {});
    }

    function swell() {
      swelled = true;
      if (gen) gen.swell();
      if (on) ramp(VOL_SWELL, 6);
    }

    btn.addEventListener('click', () => { if (on) { userOff = true; stop(); } else { userOff = false; play(); } });
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) { if (el) el.pause(); ctx.suspend && ctx.suspend(); }
      else if (on) { ctx.resume().catch(() => {}); if (el) el.play().catch(() => {}); }
    });

    return {
      tryAutoplay,
      firstTap: () => { if (!userOff && !on) play(); else if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {}); },
      swell
    };
  })();

  /* ---------------------------------------------------------
     SCORE — gentle instrumental generated in Web Audio
     D – A – Bm – G · warm pad + soft piano + (later) melody
     --------------------------------------------------------- */
  function Score(ctx, dest) {
    const f = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const BAR = 6.4;
    const CH = [
      { pad: [50, 57, 62, 66], arp: [62, 66, 69, 74, 69, 66], mel: [78, 76] },
      { pad: [45, 57, 61, 64], arp: [61, 64, 69, 73, 69, 64], mel: [76, 73] },
      { pad: [47, 54, 62, 66], arp: [62, 66, 71, 74, 71, 66], mel: [74, 78] },
      { pad: [43, 55, 59, 62], arp: [59, 62, 67, 71, 67, 62], mel: [71, 69] }
    ];
    const bus = ctx.createGain(); bus.gain.value = .9;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = .4;
    const dry = ctx.createGain(); dry.gain.value = .55;
    const wet = ctx.createGain(); wet.gain.value = .7;
    const verb = ctx.createConvolver(); verb.buffer = impulse(4.8, 2.4);
    bus.connect(lp); lp.connect(dry); dry.connect(dest); lp.connect(verb); verb.connect(wet); wet.connect(dest);

    function impulse(sec, decay) {
      const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
      return b;
    }
    function pad(m, t, dur, g) {
      const v = ctx.createGain(); v.gain.setValueAtTime(0, t);
      v.gain.linearRampToValueAtTime(g, t + 2.6); v.gain.setValueAtTime(g, t + dur - .2); v.gain.linearRampToValueAtTime(0, t + dur + 3.2);
      v.connect(bus);
      [[-4, 'sine'], [4, 'triangle']].forEach(([det, type]) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f(m); o.detune.value = det;
        const og = ctx.createGain(); og.gain.value = type === 'triangle' ? .45 : 1;
        o.connect(og); og.connect(v); o.start(t); o.stop(t + dur + 3.4);
      });
    }
    function piano(m, t, g, len) {
      const v = ctx.createGain(); v.gain.setValueAtTime(0, t);
      v.gain.linearRampToValueAtTime(g, t + .012); v.gain.exponentialRampToValueAtTime(g * .35, t + .5); v.gain.exponentialRampToValueAtTime(.0001, t + len);
      v.connect(bus);
      [[1, 'sine', 1], [2, 'sine', .22], [3, 'triangle', .06]].forEach(([mult, type, amp]) => {
        const o = ctx.createOscillator(); o.type = type; o.frequency.value = f(m) * mult;
        const og = ctx.createGain(); og.gain.value = amp; o.connect(og); og.connect(v); o.start(t); o.stop(t + len + .05);
      });
    }
    function strings(m, t, dur, g) {
      const v = ctx.createGain(); v.gain.setValueAtTime(0, t);
      v.gain.linearRampToValueAtTime(g, t + 1.1); v.gain.linearRampToValueAtTime(g * .7, t + dur * .7); v.gain.linearRampToValueAtTime(0, t + dur + 1.8);
      v.connect(bus);
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f(m);
      const vib = ctx.createOscillator(); vib.frequency.value = 5; const vg = ctx.createGain(); vg.gain.value = 3.5; vib.connect(vg); vg.connect(o.detune);
      const soft = ctx.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 1400;
      const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f(m);
      o.connect(soft); soft.connect(v); const g2 = ctx.createGain(); g2.gain.value = 2.2; o2.connect(g2); g2.connect(v);
      [o, o2, vib].forEach((x) => { x.start(t); x.stop(t + dur + 2); });
    }

    let timer = 0, next = 0, bar = 0, deep = false;
    function scheduleBar(t, i) {
      const c = CH[i % 4];
      c.pad.forEach((m, k) => pad(m, t, BAR, k === 0 ? .05 : .028));
      const steps = deep ? 6 : 4, gap = BAR / (deep ? 6 : 4);
      for (let s = 0; s < steps; s++) {
        const m = deep ? c.arp[s] : c.arp[[0, 2, 1, 3][s]];
        piano(m, t + s * gap + (Math.random() * .02), (s === 0 ? .1 : .065) * (deep ? 1.05 : 1), 3.4);
      }
      if (deep) {
        strings(c.mel[0], t + .2, BAR * .5, .022);
        strings(c.mel[1], t + BAR * .5 + .1, BAR * .5, .02);
        piano(c.mel[0], t + .2, .05, 4);
      }
    }
    function loop() {
      while (next < ctx.currentTime + 1.2) { scheduleBar(next, bar++); next += BAR; }
    }
    return {
      start() {
        if (timer) return;
        next = Math.max(next, ctx.currentTime + .15);
        loop(); timer = setInterval(loop, 250);
      },
      stop() { clearInterval(timer); timer = 0; },
      swell() {
        deep = true;
        const t = ctx.currentTime;
        lp.frequency.cancelScheduledValues(t); lp.frequency.setValueAtTime(lp.frequency.value, t); lp.frequency.linearRampToValueAtTime(2600, t + 8);
        bus.gain.linearRampToValueAtTime(1, t + 6);
      }
    };
  }

  /* ---------------------------------------------------------
     SCENES
     --------------------------------------------------------- */
  const scenes = $$('.sc');
  const thread = $('#thread');
  let cur = -1, timers = [], busy = false, tapped = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; };

  // split the question into words for a slow, word-by-word reveal
  $$('.split').forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  });

  function drawThread() {
    thread.classList.remove('draw'); void thread.offsetWidth; thread.classList.add('draw');
  }

  function show(i) {
    const sc = scenes[i]; if (!sc) return;
    cur = i;
    sc.classList.remove('is-out');
    sc.classList.add('is-on');
    if (sc.dataset.swell) { body.classList.add('is-warm'); Music.swell(); }
    $$('.ln', sc).forEach((l) => {
      later(() => l.classList.add('on'), T(parseFloat(l.dataset.d) || 0));
      if (l.dataset.out) later(() => l.classList.add('gone'), T(parseFloat(l.dataset.out)));
    });
    later(() => { busy = false; }, 600);
  }

  function go(i) {
    if (busy) return;
    busy = true;
    clearAll();
    const prev = scenes[cur];
    if (prev) {
      prev.classList.add('is-out');
      prev.classList.remove('is-on');
      setTimeout(() => {
        prev.classList.remove('is-out');
        $$('.ln', prev).forEach((l) => l.classList.remove('on', 'gone'));
      }, 2400);
    }
    const nx = scenes[i];
    const pre = parseFloat(nx.dataset.pre) || 0;
    if (pre) body.classList.add('is-hush');
    later(drawThread, T(.5));
    later(() => body.classList.remove('is-hush'), T(1.4 + pre * .6));
    later(() => show(i), T(2.2 + pre));
  }

  // „Continuă” buttons
  $$('.next').forEach((b) => b.addEventListener('click', () => {
    if (!tapped) { tapped = true; Music.firstTap(); }
    go(cur + 1);
  }));

  // answer
  const ans = $('#sc-answer'), choices = $('#choices'), reply = $('#reply'), again = $('#again');
  let answered = false;
  $$('[data-yes]').forEach((b) => b.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    Music.firstTap();
    b.classList.add('is-picked');
    if (navigator.vibrate) navigator.vibrate([18, 60, 28]);
    const r = b.getBoundingClientRect();
    Fx.bloom(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 40 : 60);
    setTimeout(() => { ans.classList.add('is-chosen'); }, 500);
    setTimeout(() => { busy = false; go(scenes.indexOf($('#sc-end'))); }, T(1.4));
    setTimeout(() => Fx.celebrate(), T(1.4) + T(4));
  }));
  $('#speechless').addEventListener('click', () => {
    if (answered || choices.classList.contains('is-hidden')) return;
    Music.firstTap();
    choices.classList.add('is-hidden');
    setTimeout(() => reply.classList.add('on'), T(1));
    setTimeout(() => { again.classList.add('on'); $('button', again).removeAttribute('tabindex'); }, T(1) + T(2));
  });

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */
  const fit = () => document.documentElement.style.setProperty('--vh', (innerHeight * .01) + 'px');
  fit(); addEventListener('resize', fit);
  body.addEventListener('touchmove', (e) => { if (!e.target.closest('.allow-scroll')) e.preventDefault(); }, { passive: false });

  const begin = () => {
    body.classList.add('is-ready');
    Music.tryAutoplay();
    const s = parseInt(new URLSearchParams(location.search).get('s') || '0', 10) || 0;   // ?s=N → previzualizare ecran
    if (s && scenes[s]) { tapped = false; busy = false; if (scenes[s].dataset.swell || s > 3) body.classList.add('is-warm'); show(s); return; }
    setTimeout(() => { busy = false; show(0); }, T(.6));
  };
  busy = true;
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]).then(begin);
  else begin();
})();
