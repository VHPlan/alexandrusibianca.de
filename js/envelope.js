/**
 * ALEX & BIANCA — BESPOKE 3D PHYSICAL ENVELOPE CEREMONY
 * Camera zoom, wax seal fracture, 3D flap physics, and physical card extraction
 */

class EnvelopeCeremony {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;

    this.screen = document.getElementById('envelope-screen');
    this.stage = document.querySelector('.envelope-3d-stage');
    this.box = document.getElementById('royal-box-3d');
    this.seal = document.getElementById('royal-seal');
    this.card = document.getElementById('royal-card');
    this.prompt = document.getElementById('royal-box-cta');
    this.sheen = document.querySelector('.env-sheen-sweep');
    this.mainInvitation = document.getElementById('main-invitation');

    this.isOpening = false;
    this.isOpened = false;

    // Inertia & Physics Tracking
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.currentRotX = 0;
    this.currentRotY = 0;

    this.init();
  }

  init() {
    if (!this.screen || !this.box) return;

    // 3D Parallax Tilt with Mouse & Specular Sheen
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
    if (this.prompt) this.prompt.addEventListener('click', triggerOpen);
    if (this.box) this.box.addEventListener('click', triggerOpen);

    // Spring Inertia Render Loop
    this.renderLoop();
  }

  handleMouseMove(e) {
    if (this.isOpened || this.isOpening || !this.box) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.targetRotX = ((clientY - centerY) / centerY) * -10;
    this.targetRotY = ((clientX - centerX) / centerX) * 12;

    // Specular light glint position
    if (this.sheen) {
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;
      this.sheen.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }
  }

  handleMouseLeave() {
    if (this.isOpened || this.isOpening) return;
    this.targetRotX = 0;
    this.targetRotY = 0;
  }

  handleOrientation(e) {
    if (this.isOpened || this.isOpening || !this.box) return;
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    this.targetRotY = Math.min(12, Math.max(-12, gamma * 0.4));
    this.targetRotX = Math.min(12, Math.max(-12, (beta - 45) * 0.3));
  }

  renderLoop() {
    if (!this.isOpened && !this.isOpening && this.box) {
      this.currentRotX += (this.targetRotX - this.currentRotX) * 0.08;
      this.currentRotY += (this.targetRotY - this.currentRotY) * 0.08;
      this.box.style.transform = `rotateX(${this.currentRotX.toFixed(2)}deg) rotateY(${this.currentRotY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(() => this.renderLoop());
  }

  openEnvelope() {
    if (this.isOpening || this.isOpened) return;
    this.isOpening = true;

    // Smooth transform reset
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.box.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // Step 1: Gentle Camera Zoom toward Envelope
    if (this.stage) {
      this.stage.classList.add('zooming');
    }

    // Step 2: Play Background Music Softly
    if (this.audio) {
      this.audio.playSoftly();
    }

    // Step 3: Wax Seal Fracture & Champagne Gold Sparklers
    setTimeout(() => {
      if (this.seal && this.particles) {
        const rect = this.seal.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        this.particles.createBurst(originX, originY, 100);
        setTimeout(() => {
          this.particles.createBurst(originX - 30, originY - 15, 45);
          this.particles.createBurst(originX + 30, originY + 15, 45);
        }, 120);

        this.seal.classList.add('broken');
      }
    }, 150);

    // Step 4: 3D Flap Unfolding & Card Slides Upward
    setTimeout(() => {
      this.box.classList.add('open');
    }, 380);

    // Step 5: Smooth Transition into Main Wedding Invitation
    setTimeout(() => {
      this.screen.classList.add('opened');
      if (this.mainInvitation) this.mainInvitation.classList.add('active');
      this.isOpened = true;

      // Soft cascade of celebratory sparkles
      if (this.particles) {
        this.particles.createBurst(window.innerWidth / 2, window.innerHeight * 0.3, 50);
      }

      // Scroll to top of main content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  }
}
