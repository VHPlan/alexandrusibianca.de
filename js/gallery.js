/**
 * ALEX & BIANCA — THE WEDDING
 * Fullscreen Cinematic Editorial Gallery
 */

class LuxuryGallery {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.track = document.getElementById('gallery-strip');
    this.wrapper = document.getElementById('gallery-viewport-track');
    this.prevBtn = document.getElementById('gallery-prev-btn');
    this.nextBtn = document.getElementById('gallery-next-btn');

    this.lightbox = document.getElementById('gallery-lightbox');
    this.lightboxImg = document.getElementById('lightbox-img-full');
    this.lightboxClose = document.getElementById('lightbox-close-btn');

    this.currentIndex = 0;
    this.cardWidth = 360;
    this.cards = [];
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.isDragging = false;
    this.animationID = 0;

    this.init();
  }

  init() {
    if (!this.track || !this.wrapper) return;
    this.cards = Array.from(this.track.querySelectorAll('.gallery-frame-item'));
    if (!this.cards.length) return;

    this.updateDimensions();
    window.addEventListener('resize', () => this.updateDimensions());

    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    this.wrapper.addEventListener('pointerdown', (e) => this.dragStart(e));
    this.wrapper.addEventListener('pointermove', (e) => this.drag(e));
    this.wrapper.addEventListener('pointerup', () => this.dragEnd());
    this.wrapper.addEventListener('pointerleave', () => this.dragEnd());

    this.cards.forEach((card) => {
      const img = card.querySelector('.gallery-frame-img');
      card.addEventListener('click', () => {
        if (Math.abs(this.currentTranslate - this.prevTranslate) < 8) {
          this.openLightbox(img ? img.src : '');
        }
      });
    });

    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });
  }

  updateDimensions() {
    const first = this.cards[0];
    if (first) {
      this.cardWidth = first.offsetWidth + 28;
    }
    this.setPositionByIndex();
  }

  dragStart(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.animationID = requestAnimationFrame(() => this.animate());
    this.wrapper.style.cursor = 'grabbing';
  }

  drag(e) {
    if (!this.isDragging) return;
    const diff = e.clientX - this.startX;
    this.currentTranslate = this.prevTranslate + diff;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    cancelAnimationFrame(this.animationID);
    this.wrapper.style.cursor = 'grab';

    const moved = this.currentTranslate - this.prevTranslate;
    if (moved < -50 && this.currentIndex < this.cards.length - 1) {
      this.currentIndex += 1;
    }
    if (moved > 50 && this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
    this.setPositionByIndex();
  }

  animate() {
    if (this.track) this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    if (this.isDragging) requestAnimationFrame(() => this.animate());
  }

  setPositionByIndex() {
    this.currentTranslate = this.currentIndex * -this.cardWidth;
    this.prevTranslate = this.currentTranslate;
    if (this.track) this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.audio) this.audio.playClick();
      this.setPositionByIndex();
    }
  }

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      if (this.audio) this.audio.playClick();
      this.setPositionByIndex();
    }
  }

  openLightbox(src) {
    if (!this.lightbox || !this.lightboxImg) return;
    this.lightboxImg.src = src;
    this.lightbox.classList.add('active');
    if (this.audio) this.audio.playClick();
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

window.LuxuryGallery = LuxuryGallery;
