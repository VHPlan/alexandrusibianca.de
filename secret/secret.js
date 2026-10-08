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
    const GOLD = ['#d9bd80', '#b8913f', '#a07a34', '#e3cc98', '#8a6a2c', '#c9a24f', '#f1e2bb', '#fff3d6', '#c79a4a'];
    const glit = [];
    const pick = () => GOLD[(Math.random() * GOLD.length) | 0];

    // one confetti piece launched from (x,y) at angle a with speed v
    function shoot(x, y, a, v) {
      const shape = Math.random();
      bits.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        w: shape < .2 ? 4 + Math.random() * 3 : 3 + Math.random() * 4,
        h: shape < .2 ? 0 : 8 + Math.random() * 10,          // h:0 → round sequin
        rot: Math.random() * 6.3, vr: (Math.random() - .5) * .35, fl: Math.random() * 6.3, fs: .08 + Math.random() * .14,
        c: pick(), life: 0, max: 420 + Math.random() * 260
      });
    }
    function glitter(n, fromTop) {
      for (let i = 0; i < n; i++) {
        glit.push({
          x: Math.random() * W, y: fromTop ? -10 - Math.random() * H * .5 : H * (.2 + Math.random() * .6),
          vx: (Math.random() - .5) * .5, vy: .5 + Math.random() * 1.3,
          s: 2.5 + Math.random() * 5, ph: Math.random() * 6.3, sp: .12 + Math.random() * .2,
          life: 0, max: 260 + Math.random() * 260
        });
      }
    }
    // speed needed to reach height h with drag .985 / gravity .2 (fitted: h ≈ 41.8·v − 310)
    const vFor = (h) => (h + 310) / 41.8;
    // cannons: bottom-left, bottom-right, and a central fountain — all shooting UP to the top of the screen
    function volley(scale) {
      const n = Math.round((MOBILE ? 75 : 120) * scale);
      const hv = () => vFor(H * (.55 + Math.random() * .6));
      for (let i = 0; i < n; i++) {
        shoot(-10, H + 10, -Math.PI / 2 + .12 + Math.random() * .38, hv() * 1.08);
        shoot(W + 10, H + 10, -Math.PI / 2 - .12 - Math.random() * .38, hv() * 1.08);
      }
      for (let i = 0; i < n * .9; i++) shoot(W / 2 + (Math.random() - .5) * W * .3, H + 10, -Math.PI / 2 + (Math.random() - .5) * .55, hv());
    }
    function confetti(n) {
      if (RM) return;
      if (n) { volley(.55); glitter(MOBILE ? 50 : 80, true); return; }
      volley(1);
      glitter(MOBILE ? 90 : 150, true);
      glitter(MOBILE ? 40 : 60, false);
      burst(W / 2, H * .42, MOBILE ? 40 : 70);
      setTimeout(() => volley(.6), 600);
      setTimeout(() => { glitter(MOBILE ? 70 : 110, true); burst(W * .3, H * .3, 24); burst(W * .7, H * .35, 24); }, 1300);
      setTimeout(() => { volley(.45); glitter(MOBILE ? 60 : 90, true); }, 3200);
      setTimeout(() => { volley(.35); glitter(MOBILE ? 60 : 90, true); }, 5600);
      setTimeout(() => glitter(MOBILE ? 50 : 80, true), 8000);
    }
    function burst(x, y, n) {
      if (RM) return;
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.3, v = .8 + Math.random() * 4; sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 7 + Math.random() * 14, life: 0, max: 70 + Math.random() * 80 }); }
    }
    function star(x, y, s) {               // 4-point glitter star
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
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
      // confetti: shoots up, slows, then flutters down
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]; b.life++;
        b.vx *= .985; b.vy = b.vy < 0 ? b.vy * .985 + .2 : Math.min(b.vy * .99 + .045, 1.8); b.fl += b.fs;
        b.x += b.vx + (b.vy > 0 ? Math.sin(b.fl) * .9 : 0); b.y += b.vy; b.rot += b.vr;
        const k = clamp((b.max - b.life) / 60, 0, 1); if (k <= 0 || (b.y > H + 30 && b.vy > 0)) { bits.splice(i, 1); continue; }
        const shine = Math.abs(Math.cos(b.fl));
        ctx.globalAlpha = k * (.55 + shine * .45);
        ctx.fillStyle = shine > .93 ? '#fff6dc' : b.c;
        if (!b.h) { ctx.beginPath(); ctx.ellipse(b.x, b.y, b.w / 2, Math.max(.4, b.w / 2 * shine), b.rot, 0, 6.3); ctx.fill(); }
        else { ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.scale(1, Math.cos(b.fl)); ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore(); }
      }
      // glitter: twinkling stars drifting down
      for (let i = glit.length - 1; i >= 0; i--) {
        const g = glit[i]; g.life++; g.ph += g.sp; g.x += g.vx + Math.sin(g.ph * .3) * .3; g.y += g.vy;
        const k = clamp((g.max - g.life) / 50, 0, 1); if (k <= 0 || g.y > H + 20) { glit.splice(i, 1); continue; }
        if (g.y < -5) continue;
        const tw = .35 + .65 * Math.abs(Math.sin(g.ph));
        ctx.globalAlpha = k * tw * .55; ctx.drawImage(sprite, g.x - g.s * 1.6, g.y - g.s * 1.6, g.s * 3.2, g.s * 3.2);
        ctx.globalAlpha = k * tw; ctx.fillStyle = tw > .85 ? '#fffaf0' : '#d8b56a'; star(g.x, g.y, g.s * tw);
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
    // melodia de după „DA” — iE_1QyGmuGQ are embed dezactivat de proprietar (oEmbed 401);
    // eroarea lui comuta melodia în afara atingerii → pe telefon nu mai pornea nimic. L-am scos.
    const YES_LIST = [
      { id: 'SNcuxVwzcxI', start: 17 }
    ];
    const YES_START = 25;                 // pentru nasi.mp3 local: pornește de la 0:25
    const VOL = .55;
    let mode = null, yt = null, ytReady = false, on = false, fadeT = 0, track = YT_ID, pendingYes = false;
    let yesIdx = -1, yesLocal = false;
    const isYes = () => yesIdx >= 0;
    const audio = new Audio(); audio.preload = 'metadata'; audio.playsInline = true;
    const yesAudio = new Audio(); yesAudio.preload = 'metadata'; yesAudio.playsInline = true;

    // fișierele locale sunt sursa principală (merg pe orice telefon); YouTube doar dacă lipsesc
    audio.src = LOCAL; mode = 'file';
    yesAudio.src = YES_LOCAL; yesLocal = true;
    audio.addEventListener('error', () => { if (mode === 'file') mode = 'yt'; loadYT(); }, { once: true });
    yesAudio.addEventListener('error', () => { yesLocal = false; loadYT(); }, { once: true });
    // pornește de la secunda dorită (și după ce browserul a aflat durata, pe iOS)
    function seekStart(el, t) {
      const go = () => { if (el.currentTime < t - 1) { try { el.currentTime = t; } catch (_) {} } };
      if (el.readyState >= 1) go(); else el.addEventListener('loadedmetadata', go, { once: true });
    }
    seekStart(audio, YT_START);
    audio.addEventListener('ended', () => { audio.currentTime = YT_START; audio.play().catch(() => {}); });
    yesAudio.addEventListener('ended', () => { yesAudio.currentTime = YES_START; yesAudio.play().catch(() => {}); });
    function playYes(i) {
      if (i >= YES_LIST.length) return;
      yesIdx = i; track = YES_LIST[i].id;
      yt.unMute();
      yt.setVolume(Math.round(VOL * 100 * 1.25));
      yt.loadVideoById({ videoId: YES_LIST[i].id, startSeconds: YES_LIST[i].start });
    }

    let ytLoaded = false;
    function loadYT() {
      if (ytLoaded) return; ytLoaded = true;
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:0;bottom:0;width:200px;height:200px;opacity:.01;z-index:-1;pointer-events:none;overflow:hidden';
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
    let chk = 0;
    function verify() {                    // phone blocked it? → reset button, one tap starts it
      clearTimeout(chk);
      chk = setTimeout(() => {
        if (!on) return;
        const m = media();
        const ok = m ? !m.paused : (ytReady && yt.getPlayerState && yt.getPlayerState() === YT.PlayerState.PLAYING);
        if (!ok) { on = false; btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); }
      }, 3500);
    }
    function set(next) {
      on = next;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      if (on) { arm(); fade(isYes() ? Math.min(1, VOL * 1.25) : VOL, 2600); verify(); }
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

  // vault dial — turns like a combination lock with every keystroke
  const dial = $('#gDial');
  let rot = 0, lastLen = 0, tickT = 0;
  input.addEventListener('input', () => {
    const d = input.value.length - lastLen; lastLen = input.value.length;
    rot += (d >= 0 ? 1 : -1) * (24 + Math.random() * 30) * Math.max(1, Math.abs(d));
    dial.style.setProperty('--rot', rot + 'deg');
    dial.classList.add('tick'); clearTimeout(tickT); tickT = setTimeout(() => dial.classList.remove('tick'), 180);
  });

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

  /* seal: press & hold ~1.8s → envelope opens */
  function bindSeal(seal) {
    const NEED = RM ? 300 : 1800;
    const sc = seal.closest('.sc');
    let t0 = 0, raf = 0, done = false;
    const set = (v) => sc.style.setProperty('--hp', v.toFixed(3));
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
      seal.classList.add('is-holding'); sc.classList.add('is-holding');
      t0 = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
    };
    const up = () => {
      if (done) return;
      cancelAnimationFrame(raf);
      seal.classList.remove('is-holding'); sc.classList.remove('is-holding');
      const from = parseFloat(sc.style.getPropertyValue('--hp')) || 0, s = performance.now();
      const back = () => { const k = clamp(1 - (performance.now() - s) / 400, 0, 1); set(from * k); if (k > 0 && !done) requestAnimationFrame(back); };
      requestAnimationFrame(back);
    };
    function breakSeal() {
      done = true;
      cancelAnimationFrame(raf);
      sc.classList.remove('is-holding');
      seal.classList.add('is-broken');
      sc.classList.add('is-open');
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
      const r = seal.getBoundingClientRect();
      Fx.burst(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 46 : 70);
      const env = sc.querySelector('.env__body').getBoundingClientRect();
      setTimeout(() => Fx.burst(env.left + env.width / 2, env.top, MOBILE ? 40 : 60), 1500);
      setTimeout(() => sc.classList.add('is-flash'), T(4.8));
      setTimeout(() => { play(cur + 1); }, T(6.4));
      setTimeout(() => sc.classList.remove('is-flash'), 9000);
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
    if (sc.dataset.fx === 'confetti') later(() => Fx.confetti(), base + T(.1));
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
