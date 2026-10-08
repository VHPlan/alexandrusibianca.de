/**
 * ALEX & BIANCA — HIGH-FASHION EDITORIAL REVEAL ORCHESTRATION
 * Product reveal physics: Perspective shift, illuminated crest, paper band release, gatefold unfold, card elevation.
 */

class CoutureRevealEngine {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;

    this.coverScreen = document.getElementById('editorial-cover-screen');
    this.envelopeWrap = document.getElementById('sculptural-envelope-wrap');
    this.crest = document.getElementById('band-ab-crest');
    this.promptBtn = document.getElementById('cover-action-prompt');
    this.mainStory = document.getElementById('fashion-editorial-main');

    this.isUnlocking = false;
    this.isCompleted = false;

    this.init();
  }

  init() {
    if (!this.coverScreen || !this.envelopeWrap) return;

    // Interactive Trigger Listeners
    const triggerReveal = (e) => {
      e.stopPropagation();
      this.executeRevealSequence();
    };

    if (this.crest) this.crest.addEventListener('click', triggerReveal);
    if (this.promptBtn) this.promptBtn.addEventListener('click', triggerReveal);
    if (this.envelopeWrap) this.envelopeWrap.addEventListener('click', triggerReveal);
  }

  executeRevealSequence() {
    if (this.isUnlocking || this.isCompleted) return;
    this.isUnlocking = true;

    // 1. Soft Background Romance Audio Start
    if (this.audio) {
      this.audio.playSoftly();
    }

    // Step 1: Perspective Alignment
    this.envelopeWrap.classList.add('opening-step-1');

    // Step 2: AB Crest Illuminates & Golden Particle Flare
    setTimeout(() => {
      this.envelopeWrap.classList.add('opening-step-2');

      if (this.crest && this.particles) {
        const rect = this.crest.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        this.particles.createBurst(originX, originY, 65);
      }
    }, 400);

    // Step 3: Paper Belly-Band Releases & Slides Off
    setTimeout(() => {
      this.envelopeWrap.classList.add('opening-step-3');
    }, 900);

    // Step 4: Architectural Gatefold Flaps Open in 3D
    setTimeout(() => {
      this.envelopeWrap.classList.add('opening-step-4');
    }, 1400);

    // Step 5: Heavy Cotton Invitation Card Elevates
    setTimeout(() => {
      this.envelopeWrap.classList.add('opening-step-5');
      if (this.particles) {
        this.particles.createBurst(window.innerWidth / 2, window.innerHeight * 0.45, 50);
      }
    }, 2000);

    // Step 6: Full-Screen Transition to Scene 1 (Title Spread)
    setTimeout(() => {
      this.coverScreen.classList.add('opened');
      if (this.mainStory) this.mainStory.classList.add('active');
      this.isCompleted = true;

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3200);
  }
}
