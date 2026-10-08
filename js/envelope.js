/**
 * ALEX & BIANCA — ULTRA-LUXURY 3D ENVELOPE CEREMONY (WHITE & 24K GOLD)
 * Interactive Mouse Sheen Reflection, 3D Physics Tilt, Wax Fracture, and Particle Fireworks
 */

class EnvelopeCeremony {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;

    this.screen = document.getElementById('envelope-screen');
    this.box = document.getElementById('royal-box-3d');
    this.seal = document.getElementById('royal-seal');
    this.ribbon = document.getElementById('royal-ribbon');
    this.card = document.getElementById('royal-card');
    this.openBtn = document.getElementById('royal-box-cta');
    this.sheen = document.querySelector('.env-sheen-sweep');

    this.isOpening = false;
    this.isOpened = false;

    this.init();
  }

  init() {
    if (!this.screen || !this.box) return;

    // 3D Parallax Tilt with Mouse & Dynamic Sheen
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseleave', () => this.handleMouseLeave());

    // 3D Tilt with Device Orientation on Mobile
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
      this.screen.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission().then(res => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
          }
        }).catch(() => {});
      }, { once: true });
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
    }

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

    // Update dynamic specular reflection sheen
    if (this.sheen) {
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;
      this.sheen.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }
  }

  handleMouseLeave() {
    if (this.isOpened || this.isOpening || !this.box) return;
    this.box.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  handleOrientation(e) {
    if (this.isOpened || this.isOpening || !this.box) return;
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    const rotY = Math.min(14, Math.max(-14, gamma * 0.4));
    const rotX = Math.min(14, Math.max(-14, (beta - 45) * 0.3));

    this.box.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  openEnvelope() {
    if (this.isOpening || this.isOpened) return;
    this.isOpening = true;

    // Smooth reset transform for pristine unfold
    this.box.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // 1. Play Lele & Andra Voloș song instantly
    if (this.audio) {
      this.audio.play();
    }

    // 2. Gold Starlight & Diamond Dust Fireworks Explosion from Seal
    if (this.seal && this.particles) {
      const rect = this.seal.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      
      this.particles.createBurst(originX, originY, 110);
      setTimeout(() => {
        this.particles.createBurst(originX - 40, originY - 20, 50);
        this.particles.createBurst(originX + 40, originY + 20, 50);
      }, 150);

      this.seal.classList.add('broken');
      this.seal.classList.add('unlocked');
    }

    // 3. Unfurl Ribbon
    if (this.ribbon) {
      this.ribbon.classList.add('hide');
    }

    // 4. Open Flap & Slide Letter Card Up
    setTimeout(() => {
      this.box.classList.add('open');
    }, 250);

    // 5. Fade out envelope stage & reveal main luxury site
    setTimeout(() => {
      this.screen.classList.add('opened');
      this.isOpened = true;
    }, 1800);
  }
}
