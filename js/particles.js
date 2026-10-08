/**
 * ALEX & BIANCA — THE WEDDING
 * Fine Metallic Gold Stardust Particle Canvas
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.bursts = [];
    this.mouse = { x: -1000, y: -1000, isHovering: false };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.particleCount = window.innerWidth < 768 ? 30 : 65;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovering = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.isHovering = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.isHovering = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isHovering = false;
    });

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  createParticle(x, y) {
    return {
      x: x !== undefined ? x : Math.random() * this.width,
      y: y !== undefined ? y : Math.random() * this.height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.12,
      alpha: Math.random() * 0.6 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      flickerSpeed: Math.random() * 0.025 + 0.01,
      color: Math.random() > 0.35 ? '#f5e2a3' : '#d4af37',
      glow: Math.random() * 6 + 2
    };
  }

  createBurst(x, y, count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.bursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 0.8,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.012,
        color: Math.random() > 0.4 ? '#fff0ba' : '#d4af37',
        gravity: 0.06
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = p.baseAlpha + Math.sin(Date.now() * p.flickerSpeed) * 0.2;

      if (this.mouse.isHovering) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }
      }

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.glow;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

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
      this.ctx.fillStyle = b.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = b.color;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleEngine = ParticleEngine;
