/**
 * ALEX & BIANCA — THE WEDDING
 * 3D Royal Gate Opening Ceremony
 */

class EnvelopeCeremony {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;
    this.screen = document.getElementById('envelope-screen');
    this.box = document.getElementById('royal-box-3d');
    this.seal = document.getElementById('royal-seal');
    this.doorLeft = document.getElementById('door-left');
    this.doorRight = document.getElementById('door-right');
    this.ribbon = document.getElementById('royal-ribbon');
    this.card = document.getElementById('royal-card');
    this.ctaBtn = document.getElementById('royal-box-cta');

    this.isOpened = false;
    this.isOpening = false;

    this.init();
  }

  init() {
    if (!this.screen || !this.box) return;

    // 3D Parallax Tilt
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

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
      this.openBox();
    };

    if (this.seal) this.seal.addEventListener('click', triggerOpen);
    if (this.ctaBtn) this.ctaBtn.addEventListener('click', triggerOpen);
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

  handleOrientation(e) {
    if (this.isOpened || this.isOpening || !this.box) return;
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    const rotY = Math.min(14, Math.max(-14, gamma * 0.4));
    const rotX = Math.min(14, Math.max(-14, (beta - 45) * 0.3));

    this.box.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  openBox() {
    if (this.isOpening || this.isOpened) return;
    this.isOpening = true;

    this.box.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // 1. Play Florin Salam Love Manea instantly!
    if (this.audio) {
      this.audio.playMusic();
    }

    // 2. Dissolve ribbon & break seal with golden fireworks
    if (this.ribbon) this.ribbon.classList.add('hide');

    const sealRect = this.seal ? this.seal.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    if (this.particles) {
      this.particles.createBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2, 80);
    }

    if (this.seal) {
      this.seal.classList.add('broken');
    }

    // 3. Swing French Doors open in 3D
    setTimeout(() => {
      if (this.doorLeft) this.doorLeft.classList.add('open');
      if (this.doorRight) this.doorRight.classList.add('open');
    }, 250);

    // 4. Slide out luxury invitation card
    setTimeout(() => {
      if (this.card) this.card.classList.add('rise-up');
      if (this.particles) {
        this.particles.createBurst(window.innerWidth / 2, window.innerHeight * 0.45, 50);
      }
    }, 600);

    // 5. Smooth camera push into hero section
    setTimeout(() => {
      if (this.screen) this.screen.classList.add('opened');
      document.body.style.overflowY = 'auto';
      this.isOpened = true;
      this.isOpening = false;

      document.querySelectorAll('.hero-section .reveal').forEach(el => {
        el.classList.add('revealed');
      });
    }, 1800);
  }
}

window.EnvelopeCeremony = EnvelopeCeremony;
