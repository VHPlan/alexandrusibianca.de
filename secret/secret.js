/* =====================================================================
   /secret — private access + vertical mini-film engine
   Nu conține codul și nici textele secrete: acestea vin de la /api/secret
   doar după validarea cheii.
   ===================================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const root = document.documentElement;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOBILE = window.matchMedia('(max-width: 899px)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = (s) => (RM ? Math.min(s, .3) : s) * 1000;

  /* ---------------------------------------------------------
     SPOTLIGHT — follows the finger / cursor, drifts when idle
     --------------------------------------------------------- */
  const spotEl = document.querySelector('.spot');
  let sx = 50, sy = 42, tx = 50, ty = 42, idle = 0;
  const point = (x, y) => { tx = x / innerWidth * 100; ty = y / innerHeight * 100; idle = 0; };
  addEventListener('pointermove', (e) => point(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) point(t.clientX, t.clientY); }, { passive: true });
  (function spot(t) {
    idle++;
    if (idle > 180) { tx = 50 + Math.sin(t / 5200) * 16; ty = 44 + Math.cos(t / 6100) * 10; }
    sx += (tx - sx) * .04; sy += (ty - sy) * .04;
    spotEl.style.setProperty('--sx', sx.toFixed(2) + '%');
    spotEl.style.setProperty('--sy', sy.toFixed(2) + '%');
    requestAnimationFrame(spot);
  })(0);

  /* ---------------------------------------------------------
     FX — very few gold motes + fine confetti
     --------------------------------------------------------- */
  const Fx = (() => {
    const cv = $('#fx'), ctx = cv.getContext('2d');
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, run = true;
    const motes = [], bits = [], sparks = [];
    const sprite = (() => {
      const s = document.createElement('canvas'); s.width = s.height = 64;
      const g = s.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(232,200,130,1)'); gr.addColorStop(.22, 'rgba(200,160,80,.75)');
      gr.addColorStop(.5, 'rgba(184,145,63,.18)'); gr.addColorStop(1, 'rgba(184,145,63,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s;
    })();
    const size = () => { W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    size(); addEventListener('resize', size);
    const mk = (init) => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 20, r: 5 + Math.random() * 11, vy: .06 + Math.random() * .18, ph: Math.random() * 6.3, sp: .004 + Math.random() * .009, a: .2 + Math.random() * .4 });
    for (let i = 0; i < (RM ? 0 : MOBILE ? 12 : 22); i++) motes.push(mk(true));
    const GOLD = ['#d9bd80', '#b8913f', '#a07a34', '#e3cc98', '#8a6a2c', '#c9a24f'];

    function confetti(n) {
      if (RM) return;
      n = n || (MOBILE ? 120 : 200);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - .5) * 2, v = 6 + Math.random() * 9;
        bits.push({ x: W / 2 + (Math.random() - .5) * 50, y: H * .6, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 1.6 + Math.random() * 2.4, h: 5 + Math.random() * 8, rot: Math.random() * 6.3, vr: (Math.random() - .5) * .3, fl: Math.random() * 6.3, c: GOLD[(Math.random() * GOLD.length) | 0], life: 0, max: 260 + Math.random() * 160 });
      }
      burst(W / 2, H * .45, MOBILE ? 36 : 60);
    }
    function burst(x, y, n) {
      if (RM) return;
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.3, v = .8 + Math.random() * 4; sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 7 + Math.random() * 14, life: 0, max: 70 + Math.random() * 80 }); }
    }
    function tick() {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      const warm = parseFloat(root.style.getPropertyValue('--warm')) || 0;
      const vd = parseFloat(root.style.getPropertyValue('--void')) || 0;
      ctx.globalCompositeOperation = 'source-over';
      for (const m of motes) {
        m.y -= m.vy; m.ph += m.sp; m.x += Math.sin(m.ph) * .22;
        if (m.y < -30) Object.assign(m, mk(false));
        ctx.globalAlpha = m.a * (.55 + Math.sin(m.ph * 3) * .45) * (.55 + warm * .6) * (1 - vd * .8);
        ctx.drawImage(sprite, m.x - m.r / 2, m.y - m.r / 2, m.r, m.r);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]; s.life++; s.x += s.vx; s.y += s.vy; s.vx *= .97; s.vy = s.vy * .97 + .012;
        const k = 1 - s.life / s.max; if (k <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = k; ctx.drawImage(sprite, s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]; b.life++;
        b.vx *= .985; b.vy = Math.min(b.vy * .985 + .09, 1.5); b.fl += .12;
        b.x += b.vx + Math.sin(b.fl) * .6; b.y += b.vy; b.rot += b.vr;
        const k = clamp((b.max - b.life) / 60, 0, 1); if (k <= 0 || b.y > H + 20) { bits.splice(i, 1); continue; }
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.scale(1, Math.cos(b.fl));
        ctx.globalAlpha = k * .95; ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) requestAnimationFrame(tick); });
    return { confetti, burst };
  })();

  /* ---------------------------------------------------------
     MUSIC — local /assets/audio/secret.mp3, otherwise YouTube.
     armed inside the click (gesture) → faded in after unlock
     --------------------------------------------------------- */
  const Music = (() => {
    const btn = $('#music');
    const LOCAL = '/assets/audio/secret.mp3';
    const YES_LOCAL = '/assets/audio/nasi.mp3';   // dacă există, are prioritate
    const YT_ID = 'noEcRnoTu1M';          // muzica până la „DA” (Nicolae Guță)
    const YT_START = 76;                  // pornește de la 1:16
    // melodia de după „DA” — primul video are embed dezactivat de proprietar,
    // deci la eroare (101/150) trecem automat la următorul
    const YES_LIST = [
      { id: 'iE_1QyGmuGQ', start: 25 },
      { id: 'SNcuxVwzcxI', start: 0 }
    ];
    const YES_START = 25;                 // pornește de la 0:25
    const VOL = .55;
    let mode = null, yt = null, ytReady = false, on = false, fadeT = 0, track = YT_ID, pendingYes = false;
    let yesIdx = -1, yesLocal = false;
    const isYes = () => yesIdx >= 0;
    const audio = new Audio(); audio.loop = true; audio.preload = 'auto'; audio.playsInline = true;
    const yesAudio = new Audio(); yesAudio.preload = 'auto'; yesAudio.playsInline = true;

    loadYT();   // the YouTube player is always needed for the celebration song
    fetch(LOCAL, { method: 'HEAD' }).then((r) => {
      if (r.ok && /audio|octet/.test(r.headers.get('content-type') || '')) { audio.src = LOCAL; mode = 'file'; } else mode = 'yt';
    }).catch(() => { mode = 'yt'; });
    fetch(YES_LOCAL, { method: 'HEAD' }).then((r) => {
      if (r.ok && /audio|octet/.test(r.headers.get('content-type') || '')) { yesAudio.src = YES_LOCAL; yesLocal = true; }
    }).catch(() => {});
    yesAudio.addEventListener('ended', () => { yesAudio.currentTime = YES_START; yesAudio.play().catch(() => {}); });
    function playYes(i) {
      if (i >= YES_LIST.length) return;
      yesIdx = i; track = YES_LIST[i].id;
      yt.unMute();
      yt.setVolume(Math.round(VOL * 100 * 1.25));
      yt.loadVideoById({ videoId: YES_LIST[i].id, startSeconds: YES_LIST[i].start });
    }

    function loadYT() {
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;opacity:0;pointer-events:none';
      host.innerHTML = '<div id="ytP"></div>';
      body.appendChild(host);
      window.onYouTubeIframeAPIReady = () => {
        yt = new YT.Player('ytP', {
          width: 200, height: 200, videoId: YT_ID,
          playerVars: { autoplay: 0, controls: 0, playsinline: 1, disablekb: 1, rel: 0, start: YT_START },
          events: {
            onReady: () => { ytReady = true; if (pendingYes) celebrate(); },
            onStateChange: (e) => {
              if (e.data !== YT.PlayerState.ENDED) return;
              yt.seekTo(isYes() ? YES_LIST[yesIdx].start : YT_START, true);
              yt.playVideo();
            },
            onError: () => { if (isYes()) playYes(yesIdx + 1); }
          }
        });
      };
      const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s);
    }
    const media = () => (mode === 'file' ? audio : mode === 'yesfile' ? yesAudio : null);
    const getV = () => (media() ? media().volume : (ytReady ? yt.getVolume() / 100 : 0));
    const setV = (v) => { v = clamp(v, 0, 1); if (media()) media().volume = v; else if (ytReady) yt.setVolume(Math.round(v * 100)); };
    function fade(to, ms, done) {
      clearInterval(fadeT);
      let v = getV(); const step = (to - v) / Math.max(1, ms / 50);
      fadeT = setInterval(() => {
        v += step;
        if ((step >= 0 && v >= to) || (step < 0 && v <= to)) { v = to; clearInterval(fadeT); done && done(); }
        setV(v);
      }, 50);
    }
    function arm() {                       // call synchronously inside a click
      if (media()) { media().volume = 0; media().play().catch(() => {}); }
      else if (ytReady) { yt.setVolume(0); yt.unMute(); yt.playVideo(); }
    }
    function disarm() {
      if (on) return;
      if (media()) media().pause(); else if (ytReady) yt.pauseVideo();
    }
    function set(next) {
      on = next;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      if (on) { arm(); fade(isYes() ? Math.min(1, VOL * 1.25) : VOL, 2600); }
      else fade(0, 900, () => { if (media()) media().pause(); else if (ytReady) yt.pauseVideo(); });
    }
    // „DA” → switch to the celebration song, from 0:25 (call inside the click)
    function celebrate() {
      clearInterval(fadeT);
      if (yesLocal) {                      // fișier local → cel mai sigur
        audio.pause(); if (ytReady) yt.pauseVideo();
        mode = 'yesfile'; yesIdx = 0; track = 'local';
        yesAudio.volume = Math.min(1, VOL * 1.25);
        try { yesAudio.currentTime = YES_START; } catch (_) {}
        yesAudio.play().catch(() => {});
        if (yesAudio.readyState < 1) yesAudio.addEventListener('loadedmetadata', () => { yesAudio.currentTime = YES_START; }, { once: true });
      } else {
        if (!ytReady) { pendingYes = true; return; }
        pendingYes = false;
        if (mode === 'file') audio.pause();
        mode = 'yt';
        playYes(0);
      }
      on = true;
      btn.classList.add('is-on');
      btn.setAttribute('aria-pressed', 'true');
    }
    window.__music = () => (ytReady ? { track, t: yt.getCurrentTime(), state: yt.getPlayerState(), vol: yt.getVolume(), muted: yt.isMuted() } : null);
    btn.addEventListener('click', () => set(!on));
    return { arm, disarm, celebrate, start: () => set(true) };
  })();

  /* ---------------------------------------------------------
     1–3 · GATE
     --------------------------------------------------------- */
  const gate = $('#gate'), gIn = $('#gateIn'), form = $('#gForm'), input = $('#gCode'), err = $('#gErr'), gBtn = $('#gBtn');
  let busy = false;
  setTimeout(() => gIn.classList.add('ready'), T(5.4));

  const fail = (msg) => {
    gIn.classList.add('ready');
    err.textContent = msg;
    err.classList.add('on');
    form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate(40);
    input.select();
  };
  input.addEventListener('input', () => err.classList.remove('on'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const code = input.value.trim();
    if (!code) return fail('Aceasta nu este cheia potrivită.');
    busy = true;
    gBtn.classList.add('is-busy');
    Music.arm();
    fetch('/api/secret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }), cache: 'no-store' })
      .then((r) => r.json().catch(() => ({})).then((j) => ({ s: r.status, j })))
      .then(({ s, j }) => {
        busy = false; gBtn.classList.remove('is-busy');
        if (s === 200 && j && j.ok && j.html) {
          try { sessionStorage.setItem('ab-secret-k', code); } catch (_) {}
          return unlock(j.html);
        }
        Music.disarm();
        fail(s === 429 ? 'Prea multe încercări. Reveniți puțin mai târziu.' : 'Aceasta nu este cheia potrivită.');
      })
      .catch(() => {
        busy = false; gBtn.classList.remove('is-busy'); Music.disarm();
        fail('Conexiunea nu este disponibilă. Încercați din nou.');
      });
  });

  function unlock(html, resumeAt) {
    input.blur();
    film.innerHTML = html;
    prepare();
    if (resumeAt !== undefined) {           // came back after a reload: continue where they were
      gate.classList.add('is-gone');
      body.classList.add('is-film');
      play(clamp(resumeAt, 0, scenes.length - 1));
      return;
    }
    Music.start();
    gate.classList.add('is-accepted');
    root.style.setProperty('--warm', '.35');
    setTimeout(() => Fx.burst(innerWidth / 2, innerHeight / 2, MOBILE ? 30 : 50), T(1.6));
    setTimeout(() => { gate.classList.add('is-gone'); body.classList.add('is-film'); }, T(4.3));
    setTimeout(() => play(0), T(5.4));
  }

  // if the phone reloaded the page mid-film, resume silently (same tab only)
  (() => {
    let k = null, at = 0;
    try { k = sessionStorage.getItem('ab-secret-k'); at = parseInt(sessionStorage.getItem('ab-secret-at') || '0', 10) || 0; } catch (_) {}
    if (!k) return;
    gIn.style.visibility = 'hidden';
    fetch('/api/secret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: k }), cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => { if (j && j.ok && j.html) unlock(j.html, at); else throw 0; })
      .catch(() => { try { sessionStorage.removeItem('ab-secret-k'); } catch (_) {} gIn.style.visibility = ''; });
  })();

  /* ---------------------------------------------------------
     4–9 · FILM ENGINE
     --------------------------------------------------------- */
  const film = $('#film'), barsEl = $('#bars');
  let scenes = [], cur = -1, timers = [], started = 0, lastAt = 0, autoNext = 0;

  function prepare() {
    $$('.split', film).forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
    });
    $$('.chars', film).forEach((el) => {
      let i = 0;
      el.innerHTML = el.textContent.trim().split(/\s+/).map((w) =>
        '<span class="wd">' + Array.from(w).map((c) => `<span class="c" style="--i:${i++}">${esc(c)}</span>`).join('') + '</span>'
      ).join(' ');
    });
    scenes = $$('.sc', film);
    const segs = scenes.filter((s) => s.dataset.seg !== undefined).length;
    barsEl.innerHTML = Array.from({ length: segs }, () => '<span class="bar"><i></i></span>').join('');

    film.addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) return jump(go.dataset.go);
      const w = e.target.closest('[data-wa]');
      if (w) return openWa(w.dataset.wa, decodeURIComponent(w.dataset.msg || ''));
      const opt = e.target.closest('.pick__opt');
      if (opt) return choose(opt);
      if (e.target.closest('button, a')) return;
      tap();
    });
    $$('.seal', film).forEach(bindSeal);
  }

  /* decoy question: any answer is the right one */
  function choose(opt) {
    const box = opt.closest('.pick');
    if (box.classList.contains('is-done')) return;
    box.classList.add('is-done');
    opt.classList.add('is-chosen');
    const r = opt.r = opt.getBoundingClientRect();
    Fx.burst(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 10 : 16);
    const reply = $('.reply', opt.closest('.sc'));
    reply.textContent = opt.dataset.reply || '';
    later(() => reply.classList.add('on'), 500);
    later(() => play(cur + 1), T(3.6));
  }

  /* seal: press & hold ~1.8s to break it */
  function bindSeal(seal) {
    const NEED = RM ? 300 : 1800;
    let t0 = 0, raf = 0, done = false;
    const set = (v) => seal.style.setProperty('--hp', v.toFixed(3));
    const step = () => {
      const p = clamp((performance.now() - t0) / NEED, 0, 1);
      set(p);
      if (navigator.vibrate && p > .2 && Math.random() < .08) navigator.vibrate(8);
      if (p >= 1) return breakSeal();
      raf = requestAnimationFrame(step);
    };
    const down = (e) => {
      if (done) return;
      e.preventDefault();
      seal.setPointerCapture && e.pointerId !== undefined && seal.setPointerCapture(e.pointerId);
      seal.classList.add('is-holding');
      t0 = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
    };
    const up = () => {
      if (done) return;
      cancelAnimationFrame(raf);
      seal.classList.remove('is-holding');
      const from = parseFloat(seal.style.getPropertyValue('--hp')) || 0, s = performance.now();
      const back = () => { const k = clamp(1 - (performance.now() - s) / 400, 0, 1); set(from * k); if (k > 0 && !done) requestAnimationFrame(back); };
      requestAnimationFrame(back);
    };
    function breakSeal() {
      done = true;
      cancelAnimationFrame(raf);
      seal.classList.add('is-broken');
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
      const r = seal.getBoundingClientRect();
      Fx.burst(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 46 : 70);
      const sc = seal.closest('.sc');
      setTimeout(() => sc.classList.add('is-flash'), 350);
      setTimeout(() => { play(cur + 1); }, T(2.2));
      setTimeout(() => sc.classList.remove('is-flash'), 4500);
    }
    seal.addEventListener('pointerdown', down);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => seal.addEventListener(ev, up));
    seal.addEventListener('contextmenu', (e) => e.preventDefault());
    seal.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) down(e); });
    seal.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') up(); });
  }

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; };

  function play(i) {
    clearAll();
    body.classList.remove('can-next');
    const prev = scenes[cur];
    const sc = scenes[i];
    if (!sc) return;
    if (prev && prev !== sc) {
      prev.classList.remove('is-on');
      prev.classList.add('is-out');
      setTimeout(() => {
        prev.classList.remove('is-out');
        $$('.ln', prev).forEach((l) => l.classList.remove('on', 'gone'));
      }, 2000);
    }
    cur = i;
    try { sessionStorage.setItem('ab-secret-at', String(i)); } catch (_) {}
    const hold = parseFloat(sc.dataset.hold) || 0;
    root.style.setProperty('--warm', sc.dataset.warm || '0');
    root.style.setProperty('--void', sc.dataset.void || '0');
    body.classList.toggle('is-branch', !!sc.dataset.branch);
    sc.style.setProperty('--hold', (hold || 18) + 's');

    // progress
    const segIdx = sc.dataset.seg !== undefined ? +sc.dataset.seg : -1;
    $$('.bar', barsEl).forEach((b, k) => {
      const fill = $('i', b);
      fill.style.transition = 'none';
      b.classList.toggle('done', k < segIdx);
      fill.style.transform = k < segIdx ? 'scaleX(1)' : 'scaleX(0)';
      if (k === segIdx) {
        void fill.offsetWidth;
        fill.style.transition = `transform ${hold ? hold : 9}s linear`;
        fill.style.transform = 'scaleX(1)';
      }
    });

    const base = prev ? 900 : 0;   // short dip to black between scenes
    later(() => sc.classList.add('is-on'), base);
    started = performance.now() + base;
    lastAt = 0;
    $$('.ln', sc).forEach((l) => {
      const d = parseFloat(l.dataset.d) || 0;
      lastAt = Math.max(lastAt, d);
      later(() => l.classList.add('on'), base + T(d));
      if (l.dataset.out) later(() => l.classList.add('gone'), base + T(parseFloat(l.dataset.out)));
    });
    if (sc.dataset.fx === 'confetti') { later(() => Fx.confetti(), base + T(.4)); later(() => Fx.confetti(MOBILE ? 50 : 90), base + T(2.4)); }
    if (sc.dataset.flash) later(() => Fx.burst(innerWidth / 2, innerHeight * .46, MOBILE ? 20 : 34), base + T(4.4));

    if (hold > 0) {
      later(() => body.classList.add('can-next'), base + T(lastAt + 2.2));
      autoNext = base + T(hold);
      later(next, autoNext);
    }
  }

  function next() {
    const sc = scenes[cur];
    if (!sc || !(parseFloat(sc.dataset.hold) > 0)) return;
    const n = scenes[cur + 1];
    if (n && !n.dataset.branch) play(cur + 1);
  }

  function tap() {
    const sc = scenes[cur];
    if (!sc || !(parseFloat(sc.dataset.hold) > 0)) return;
    if (body.classList.contains('can-next')) return next();
    // fast-forward the reveal of this scene
    clearAll();
    $$('.ln', sc).forEach((l) => l.classList.add(l.dataset.out ? 'gone' : 'on'));
    body.classList.add('can-next');
    later(next, T(4.5));
  }

  function jump(name) {
    const sc = $('#sc-' + name, film);
    if (!sc) return;
    if (name === 'yes') { Music.celebrate(); Fx.burst(innerWidth / 2, innerHeight * .7, MOBILE ? 30 : 50); }
    play(scenes.indexOf(sc));
  }

  function openWa(num, text) {
    const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(text);
    window.__lastWa = url;
    if (MOBILE) location.href = url; else window.open(url, '_blank', 'noopener');
  }

  addEventListener('keydown', (e) => {
    if (!body.classList.contains('is-film')) return;
    if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') { if (!e.target.closest('button')) { e.preventDefault(); tap(); } }
  });
})();
