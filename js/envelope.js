/**
 * ALEX & BIANCA — TRUE 3D ENVELOPE & LETTER MECHANICS
 */

class EnvelopeCeremony {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;

    this.screen = document.getElementById('envelope-screen');
    this.box = document.getElementById('envelope-3d-box');
    this.seal = document.getElementById('envelope-seal');
    this.ribbon = document.getElementById('envelope-ribbon');
    this.letter = document.getElementById('envelope-letter');
    this.flap = document.getElementById('envelope-flap');
    this.openBtn = document.getElementById('envelope-open-btn');

    this.isOpening = false;
    this.isOpened = false;

    this.init();
  }

  init() {
    if (!this.screen || !this.box) return;

    // 3D Parallax Tilt
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    const triggerOpen = (e) => {
      e.stopPropagation();
      this.openEnvelope();
    };

    if (this.seal) this.seal.addEventListener('click', triggerOpen);
    if (this.openBtn) this.openBtn.addEventListener('click', triggerOpen);
    if (this.box) this.box.addEventListener('click', triggerOpen);
  }

  handleMouseMove(e) {
    if (this.isOpened || this.isOpening || !this.box) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const rotX = ((clientY - centerY) / centerY) * -12;
    const rotY = ((clientX - centerX) / centerX) * 14;

    this.box.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  openEnvelope() {
    if (this.isOpening || this.isOpened) return;
    this.isOpening = true;

    // Reset 3D transform for clean unfolding
    this.box.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // 1. Play Lele & Andra Voloș love song instantly
    if (this.audio) {
      this.audio.play();
    }

    // 2. Gold Particle Fireworks at Seal Position
    if (this.seal && this.particles) {
      const rect = this.seal.getBoundingClientRect();
      this.particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);
      this.seal.classList.add('shattered');
    }

    // 3. Dissolve Ribbon
    if (this.ribbon) {
      this.ribbon.classList.add('dissolve');
    }

    // 4. Open Flap & Rise Letter
    setTimeout(() => {
      this.box.classList.add('open');
    }, 250);

    // 5. Fade out envelope stage & reveal main site
    setTimeout(() => {
      this.screen.classList.add('opened');
      this.isOpened = true;
    }, 1800);
  }
}
