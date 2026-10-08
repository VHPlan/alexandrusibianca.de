/**
 * ALEX & BIANCA — LUXURY 24K GOLD & STARLIGHT PARTICLE ENGINE
 * Features: Twinkling 4-point stars, glowing bokeh spheres, ambient stardust, mouse sparkles, and wax seal burst.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.bursts = [];
    this.mouseTrails = [];
    this.mouseX = -1000;
    this.mouseY = -1000;

    this.numDust = 45;
    this.numStars = 25;

    this.goldColors = [
      '#ffffff',
      '#fff6cc',
      '#ffd700',
      '#f5c542',
      '#dfa92c',
      '#b8860b'
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Track mouse for interactive sparkles
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (Math.random() < 0.3) {
        this.addMouseSparkle(e.clientX, e.clientY);
      }
    });

    // Generate ambient golden dust
    for (let i = 0; i < this.numDust; i++) {
      this.particles.push(this.createDustParticle());
    }

    // Generate twinkling starlight
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push(this.createStar());
    }

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createDustParticle() {
    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: Math.random() * (this.height || window.innerHeight),
      radius: Math.random() * 2.8 + 0.8,
      color: this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.1, // gently float upward
      alpha: Math.random() * 0.6 + 0.2,
      maxAlpha: Math.random() * 0.5 + 0.4,
      alphaSpeed: Math.random() * 0.012 + 0.004,
      growing: Math.random() > 0.5
    };
  }

  createStar() {
    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: Math.random() * (this.height || window.innerHeight),
      size: Math.random() * 7 + 4,
      color: this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 0.025 + 0.01,
      growing: Math.random() > 0.5
    };
  }

  addMouseSparkle(x, y) {
    if (this.mouseTrails.length > 25) return;
    this.mouseTrails.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 5 + 3,
      alpha: 0.9,
      decay: Math.random() * 0.03 + 0.02,
      vy: Math.random() * 0.8 - 0.4,
      vx: (Math.random() - 0.5) * 0.8
    });
  }

  createBurst(x, y, count = 90) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const isStar = Math.random() > 0.6;

      this.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 1.5,
        isStar,
        color: this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
        alpha: 1,
        decay: Math.random() * 0.022 + 0.012,
        gravity: 0.12,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  draw4PointStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Ambient Floating Dust
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.growing) {
        p.alpha += p.alphaSpeed;
        if (p.alpha >= p.maxAlpha) p.growing = false;
      } else {
        p.alpha -= p.alphaSpeed;
        if (p.alpha <= 0.1) p.growing = true;
      }

      if (p.y < -10) { p.y = this.height + 10; p.x = Math.random() * this.width; }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Twinkling 4-Point Stars
    for (let s of this.stars) {
      s.rotation += s.rotSpeed;
      if (s.growing) {
        s.alpha += s.twinkleSpeed;
        if (s.alpha >= 0.85) s.growing = false;
      } else {
        s.alpha -= s.twinkleSpeed;
        if (s.alpha <= 0.05) s.growing = true;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = '#ffd700';
      this.draw4PointStar(this.ctx, s.x, s.y, 4, s.size, s.size * 0.25);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Mouse trail sparkles
    for (let i = this.mouseTrails.length - 1; i >= 0; i--) {
      const m = this.mouseTrails[i];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.decay;

      if (m.alpha <= 0) {
        this.mouseTrails.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = m.alpha;
      this.ctx.fillStyle = '#fff5cc';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#e6be44';
      this.draw4PointStar(this.ctx, m.x, m.y, 4, m.size, m.size * 0.25);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Gold Explosive Bursts (Fireworks from Seal)
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.rotation += b.rotSpeed;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = b.alpha;
      this.ctx.fillStyle = b.color;
      this.ctx.shadowBlur = 14;
      this.ctx.shadowColor = '#ffd700';

      if (b.isStar) {
        this.draw4PointStar(this.ctx, b.x, b.y, 4, b.radius * 2.2, b.radius * 0.5);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
