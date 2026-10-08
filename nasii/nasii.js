/* =====================================================================
   /nasii — Alex & Bianca · cinematic question for the godparents
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

  /* Numărul de WhatsApp al mirilor (format internațional, fără +) */
  const WHATSAPP = { alex: '4917655700551', bianca: '4915563441309' };

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------------------------------------------------------
     1. PERSONALIZARE — /nasii?pentru=Andrei-si-Maria
     --------------------------------------------------------- */
  const raw = (new URLSearchParams(location.search).get('pentru') || '').trim();
  const cap = (s) => s.toLocaleLowerCase('ro').replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('ro'));
  let couple = '';
  if (raw) {
    const parts = raw
      .replace(/\+/g, ' ')
      .split(/\s*(?:[-_\s](?:si|și|and|und)[-_\s]|&|,)\s*/i)
      .map((p) => cap(p.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()))
      .filter(Boolean)
      .slice(0, 3);
    couple = parts.join(' & ').slice(0, 60);
  }
  if (couple) {
    body.classList.add('has-for');
    const gf = $('#gateFor');
    gf.textContent = couple + ',';
    gf.hidden = false;
    $('#gateL1').textContent = 'avem ceva important să vă spunem…';
    const af = $('#askFor');
    af.textContent = couple;
    af.hidden = false;
    document.title = couple + ' — o întrebare de la Alex & Bianca';
  }

  /* ---------------------------------------------------------
     2. TEXT SPLITTING
     --------------------------------------------------------- */
  $$('.rv').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  });
  $$('.rvc').forEach((el) => {
    let i = 0;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) =>
      '<span class="wd">' + Array.from(w).map((c) => `<span class="c" style="--i:${i++}">${esc(c)}</span>`).join('') + '</span>'
    ).join(' ');
  });

  /* ---------------------------------------------------------
     3. FX CANVAS — very few gold motes + fine confetti
     --------------------------------------------------------- */
  const Fx = (() => {
    const cv = $('#fx');
    const ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const motes = [], bits = [], sparks = [];
    let running = true;

    const sprite = (() => {
      const s = document.createElement('canvas');
      s.width = s.height = 64;
      const g = s.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,244,214,1)');
      gr.addColorStop(.18, 'rgba(236,208,150,.85)');
      gr.addColorStop(.45, 'rgba(205,160,90,.22)');
      gr.addColorStop(1, 'rgba(205,160,90,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return s;
    })();

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const N = RM ? 0 : (MOBILE ? 14 : 26);
    for (let i = 0; i < N; i++) motes.push(newMote(true));
    function newMote(init) {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 20,
        r: 6 + Math.random() * 12,
        vy: .08 + Math.random() * .22,
        ph: Math.random() * 6.28,
        sp: .004 + Math.random() * .01,
        a: .25 + Math.random() * .45
      };
    }

    const GOLDS = ['#efe1bd', '#cdb07a', '#b8955a', '#e3cc98', '#9c7b45', '#f7efd9'];
    function confetti(n) {
      if (RM) return;
      n = n || (MOBILE ? 130 : 220);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - .5) * 1.9;
        const v = 6 + Math.random() * 9;
        bits.push({
          x: W / 2 + (Math.random() - .5) * 60, y: H * .58,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          w: 2 + Math.random() * 2.6, h: 5 + Math.random() * 8,
          rot: Math.random() * 6.28, vr: (Math.random() - .5) * .3,
          fl: Math.random() * 6.28, c: GOLDS[(Math.random() * GOLDS.length) | 0],
          life: 0, max: 260 + Math.random() * 160
        });
      }
      for (let i = 0; i < (MOBILE ? 40 : 70); i++) {
        const a = Math.random() * 6.28, v = 1 + Math.random() * 4.5;
        sparks.push({ x: W / 2, y: H * .45, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 8 + Math.random() * 16, life: 0, max: 90 + Math.random() * 90 });
      }
    }
    function burst(x, y, n) {
      if (RM) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28, v = .6 + Math.random() * 3;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 6 + Math.random() * 12, life: 0, max: 60 + Math.random() * 60 });
      }
    }

    let t = 0;
    function tick() {
      if (!running) return;
      t++;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const warm = parseFloat(root.style.getPropertyValue('--warm')) || 0;
      for (const m of motes) {
        m.y -= m.vy; m.ph += m.sp;
        m.x += Math.sin(m.ph) * .25;
        if (m.y < -30) Object.assign(m, newMote(false));
        const tw = .55 + Math.sin(m.ph * 3) * .45;
        ctx.globalAlpha = m.a * tw * (.6 + warm * .6);
        ctx.drawImage(sprite, m.x - m.r / 2, m.y - m.r / 2, m.r, m.r);
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life++; s.x += s.vx; s.y += s.vy; s.vx *= .97; s.vy = s.vy * .97 + .015;
        const k = 1 - s.life / s.max;
        if (k <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = k;
        ctx.drawImage(sprite, s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.life++;
        b.vx *= .985; b.vy = b.vy * .985 + .09;
        if (b.vy > 1.6) b.vy = 1.6;
        b.fl += .12;
        b.x += b.vx + Math.sin(b.fl) * .6; b.y += b.vy; b.rot += b.vr;
        const k = clamp((b.max - b.life) / 60, 0, 1);
        if (k <= 0 || b.y > H + 20) { bits.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.scale(1, Math.cos(b.fl));
        ctx.globalAlpha = k * .95;
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
    return { confetti, burst };
  })();

  /* ---------------------------------------------------------
     4. MUSIC — local /assets/audio/nasii.mp3, otherwise YouTube
     --------------------------------------------------------- */
  const Music = (() => {
    const btn = $('#music');
    const LOCAL = '/assets/audio/nasii.mp3';
    const YT_ID = 'q9wpOvgKCIg';
    const VOL = .55;
    let on = false, mode = null, yt = null, ytReady = false, fadeT = 0;
    const audio = new Audio();
    audio.loop = true; audio.preload = 'auto'; audio.playsInline = true;

    fetch(LOCAL, { method: 'HEAD' })
      .then((r) => {
        const ct = r.headers.get('content-type') || '';
        if (r.ok && /audio|octet/.test(ct)) { audio.src = LOCAL; mode = 'file'; } else loadYT();
      })
      .catch(loadYT);

    function loadYT() {
      mode = 'yt';
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;opacity:0;pointer-events:none';
      host.innerHTML = '<div id="ytPlayer"></div>';
      document.body.appendChild(host);
      window.onYouTubeIframeAPIReady = () => {
        yt = new YT.Player('ytPlayer', {
          width: 200, height: 200, videoId: YT_ID,
          playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: YT_ID, playsinline: 1, disablekb: 1, rel: 0 },
          events: {
            onReady: () => { ytReady = true; if (on) play(); },
            onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) { yt.seekTo(0); yt.playVideo(); } }
          }
        });
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    function fade(get, set, to, ms, done) {
      clearInterval(fadeT);
      let v = get();
      const step = (to - v) / Math.max(1, ms / 50);
      fadeT = setInterval(() => {
        v += step;
        if ((step >= 0 && v >= to) || (step < 0 && v <= to)) { v = to; clearInterval(fadeT); done && done(); }
        set(clamp(v, 0, 1));
      }, 50);
    }
    function play() {
      if (mode === 'file') {
        audio.volume = 0;
        audio.play().catch(() => {});
        fade(() => audio.volume, (v) => (audio.volume = v), VOL, 2400);
      } else if (mode === 'yt' && ytReady) {
        yt.setVolume(0); yt.unMute(); yt.playVideo();
        let v = 0;
        fade(() => v, (x) => { v = x; yt.setVolume(Math.round(x * 100)); }, VOL, 2400);
      }
    }
    function stop() {
      if (mode === 'file') fade(() => audio.volume, (v) => (audio.volume = v), 0, 900, () => audio.pause());
      else if (mode === 'yt' && ytReady) {
        let v = yt.getVolume() / 100;
        fade(() => v, (x) => { v = x; yt.setVolume(Math.round(x * 100)); }, 0, 900, () => yt.pauseVideo());
      }
    }
    function set(next) {
      on = next;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      on ? play() : stop();
    }
    btn.addEventListener('click', () => set(!on));
    return { start: () => set(true) };
  })();

  /* ---------------------------------------------------------
     5. SCENA 1 — gate
     --------------------------------------------------------- */
  const gate = $('#gate');
  const discover = $('#discover');
  setTimeout(() => gate.classList.add('is-ready'), RM ? 0 : (couple ? 7600 : 7200));

  discover.addEventListener('click', () => {
    Music.start();
    const r = discover.getBoundingClientRect();
    Fx.burst(r.left + r.width / 2, r.top + r.height / 2, MOBILE ? 26 : 40);
    body.classList.add('is-opening');
    setTimeout(() => body.classList.add('is-open'), RM ? 0 : 450);
    setTimeout(() => {
      body.classList.remove('is-locked');
      window.scrollTo(0, 0);
      onScroll();
    }, RM ? 50 : 1200);
    setTimeout(() => { gate.style.display = 'none'; }, RM ? 100 : 2600);
  });

  /* ---------------------------------------------------------
     6. SCROLL-DRIVEN SCENES
     --------------------------------------------------------- */
  const scenes = $$('[data-scene]').map((el) => ({
    el,
    warm: el.hasAttribute('data-warm'),
    hot: el.hasAttribute('data-hot'),
    items: $$('[data-at]', el).map((n) => ({ n, at: +n.dataset.at, out: n.dataset.out ? +n.dataset.out : 9 }))
  }));
  const pars = $$('[data-par]').map((el) => ({ el, k: +el.dataset.par, img: $('img', el) }));
  const answer = $('#answer');

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }
  function frame() {
    ticking = false;
    const vh = window.innerHeight;
    let warm = 0;
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      const span = Math.max(1, r.height - vh);
      const p = clamp(-r.top / span, 0, 1);
      if (r.bottom < -vh || r.top > vh * 2) { if (s.hot && r.bottom < 0) warm = Math.max(warm, .7); continue; }
      s.el.style.setProperty('--p', p.toFixed(4));
      for (const it of s.items) {
        it.n.classList.toggle('on', p >= it.at && p < it.out);
        it.n.classList.toggle('out', p >= it.out);
      }
      if (s.warm) warm = Math.max(warm, clamp((p - .05) * 1.4, 0, 1));
      if (s.hot) {
        const enter = clamp((r.top < vh ? 1 : 0), 0, 1);
        warm = Math.max(warm, enter * (.85 + clamp((p - .4) * .5, 0, .15)));
      }
    }
    root.style.setProperty('--warm', warm.toFixed(3));

    for (const p of pars) {
      const r = p.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      p.img.style.setProperty('--y', (c * p.k * 100).toFixed(2) + '%');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .2 });
  io.observe($('.duo'));
  io.observe(answer);

  /* ---------------------------------------------------------
     7. SCENA 5 — answers
     --------------------------------------------------------- */
  const resYes = $('#resYes');
  const resTime = $('#resTime');
  const sign = couple ? '\n\n— ' + couple : '';
  const wa = (to, text) => {
    const url = 'https://wa.me/' + (WHATSAPP[to] || WHATSAPP.alex) + '?text=' + encodeURIComponent(text);
    window.__lastWa = url;
    if (MOBILE) window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  };
  function show(el) {
    el.classList.add('is-on');
    el.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked');
  }
  function hide(el) {
    el.classList.remove('is-on');
    el.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-locked');
  }

  $('#yes').addEventListener('click', () => {
    show(resYes);
    root.style.setProperty('--warm', '1');
    setTimeout(() => Fx.confetti(), RM ? 0 : 500);
    setTimeout(() => Fx.confetti(MOBILE ? 60 : 100), RM ? 0 : 2200);
  });
  $('#time').addEventListener('click', () => show(resTime));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => hide(b.closest('.result'))));

  const MSG = {
    yes: 'Dragi Alex & Bianca,\n\nDA, CU DRAG! ✨\nVom fi nașii voștri și ne bucurăm enorm.',
    talk: 'Dragi Alex & Bianca,\n\nne-a emoționat mult întrebarea voastră. Hai să vorbim, cu drag.'
  };
  $$('[data-wa]').forEach((b) => b.addEventListener('click', () => wa(b.dataset.to, MSG[b.dataset.wa] + sign)));

  /* debug: ?skip opens straight away */
  if (/[?&]skip/.test(location.search)) {
    gate.classList.add('is-ready');
    body.classList.add('is-open');
    body.classList.remove('is-locked');
    gate.style.display = 'none';
    frame();
  }
})();
