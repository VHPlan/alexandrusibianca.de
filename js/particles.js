/**
 * ALEX & BIANCA — BRIGHT JOYFUL WEDDING PARTICLES & ROSE PETALS ENGINE
 * Renders floating champagne gold stardust, sparkling 4-point stars, and soft drifting rose petals.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.petals = [];
    this.bursts = [];

    this.numDust = 35;
    this.numStars = 18;
    this.numPetals = 16;

    this.goldColors = [
      'rgba(212, 175, 55, 0.85)',
      'rgba(247, 230, 164, 0.95)',
      'rgba(232, 207, 141, 0.8)',
      'rgba(180, 140, 50, 0.65)'
    ];

    this.petalColors = [
      'rgba(255, 218, 218, 0.65)',
      'rgba(245, 196, 196, 0.55)',
      'rgba(255, 235, 235, 0.75)',
      'rgba(235, 180, 180, 0.5)'
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate ambient golden dust
    for (let i = 0; i < this.numDust; i++) {
      this.particles.push(this.createDustParticle());
    }

    // Generate twinkling starlight
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push(this.createStar());
    }

    // Generate soft drifting rose petals
    for (let i = 0; i < this.numPetals; i++) {
      this.petals.push(this.createPetal());
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
      radius: Math.random() * 2.2 + 0.8,
      color: this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1, // float upward
      alpha: Math.random() * 0.6 + 0.2,
      maxAlpha: Math.random() * 0.5 + 0.35,
      alphaSpeed: Math.random() * 0.01 + 0.003,
      growing: Math.random() > 0.5
    };
  }

  createStar() {
    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: Math.random() * (this.height || window.innerHeight),
      size: Math.random() * 6 + 3.5,
      color: this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      growing: Math.random() > 0.5
    };
  }

  createPetal() {
    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: Math.random() * (this.height || window.innerHeight),
      width: Math.random() * 10 + 8,
      height: Math.random() * 16 + 12,
      color: this.petalColors[Math.floor(Math.random() * this.petalColors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      vx: Math.random() * 0.6 + 0.2,
      vy: Math.random() * 0.8 + 0.3, // gently fall like a blossom
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: Math.random() * 0.03 + 0.01
    };
  }

  createBurst(x, y, count = 75) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      const isPetal = Math.random() > 0.6;

      this.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: isPetal ? (Math.random() * 5 + 3) : (Math.random() * 3 + 1.2),
        color: isPetal ? this.petalColors[Math.floor(Math.random() * this.petalColors.length)] : this.goldColors[Math.floor(Math.random() * this.goldColors.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        gravity: 0.08,
        isPetal
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

  drawPetal(ctx, x, y, width, height, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.bezierCurveTo(width / 2, -height / 3, width / 2, height / 3, 0, height / 2);
    ctx.bezierCurveTo(-width / 2, height / 3, -width / 2, -height / 3, 0, -height / 2);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Soft Rose Petals Floating
    for (let pet of this.petals) {
      pet.oscillation += pet.oscSpeed;
      pet.x += pet.vx + Math.sin(pet.oscillation) * 0.5;
      pet.y += pet.vy;
      pet.rotation += pet.rotSpeed;

      if (pet.y > this.height + 20) {
        pet.y = -20;
        pet.x = Math.random() * this.width;
      }
      if (pet.x > this.width + 20) pet.x = -20;

      this.drawPetal(this.ctx, pet.x, pet.y, pet.width, pet.height, pet.rotation, pet.color);
    }

    // 2. Ambient Floating Golden Stardust
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
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Twinkling 4-Point Starlight
    for (let s of this.stars) {
      s.rotation += s.rotSpeed;
      if (s.growing) {
        s.alpha += s.twinkleSpeed;
        if (s.alpha >= 0.8) s.growing = false;
      } else {
        s.alpha -= s.twinkleSpeed;
        if (s.alpha <= 0.05) s.growing = true;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#d4af37';
      this.draw4PointStar(this.ctx, s.x, s.y, 4, s.size, s.size * 0.25);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Gold Confetti & Petal Bursts
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
      this.ctx.shadowColor = '#d4af37';
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
