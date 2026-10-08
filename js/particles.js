/**
 * ALEX & BIANCA — GOLD & DIAMOND DUST PARTICLE SYSTEM (FOR WHITE & GOLD THEME)
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.bursts = [];
    this.numParticles = 50;

    this.colors = [
      'rgba(212, 175, 55, 0.65)',
      'rgba(255, 215, 0, 0.75)',
      'rgba(197, 155, 63, 0.55)',
      'rgba(255, 234, 167, 0.85)'
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 2.5 + 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.5 - 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: Math.random() * 0.015 + 0.005,
      growing: Math.random() > 0.5
    };
  }

  createBurst(x, y, count = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        gravity: 0.08
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Ambient floating particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.growing) {
        p.alpha += p.alphaSpeed;
        if (p.alpha >= 0.85) p.growing = false;
      } else {
        p.alpha -= p.alphaSpeed;
        if (p.alpha <= 0.2) p.growing = true;
      }

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      this.ctx.fill();
      this.ctx.restore();
    }

    // Interactive Bursts (Fireworks / Confetti)
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = b.alpha;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
