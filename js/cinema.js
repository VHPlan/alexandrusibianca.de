/**
 * ALEX & BIANCA — CINEMATIC FULL-SCREEN STORIES / KEYNOTE ENGINE
 * Zero vertical scroll. Tap, click, keyboard or swipe navigation.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PARTICLES ENGINE (INTRO & CINEMA AMBIENCE)
  // =========================================================================
  function initParticleCanvas(canvasId, particleCount, maxSpeed) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: Math.random() * maxSpeed + 0.08,
        speedX: (Math.random() - 0.5) * 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.006,
        pulseVal: Math.random() * Math.PI,
      });
    }

    let isRunning = true;
    function loop() {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(0.05, p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal)));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 140, ${currentAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(235, 195, 110, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return {
      stop: () => { isRunning = false; }
    };
  }

  const introEngine = initParticleCanvas('introParticles', 45, 0.35);
  const cinemaEngine = initParticleCanvas('cinemaParticles', 35, 0.25);

  // =========================================================================
  // 2. DISCOVER INVITATION (INTRO -> CINEMA STAGE TRANSITION)
  // =========================================================================
  const introScene = document.getElementById('introScene');
  const discoverBtn = document.getElementById('discoverBtn');
  const cinemaStage = document.getElementById('cinemaStage');

  function openCinema() {
    if (!introScene) return;

    introScene.classList.add('is-dismissed');
    introScene.setAttribute('aria-hidden', 'true');

    if (cinemaStage) {
      cinemaStage.classList.add('is-active');
      cinemaStage.setAttribute('aria-hidden', 'false');
      goToSlide(0);
    }

    if (introEngine) {
      setTimeout(introEngine.stop, 1500);
    }
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', openCinema);
  }

  // =========================================================================
  // 3. HORIZONTAL SLIDE CONTROLLER (STORIES ENGINE)
  // =========================================================================
  const slides = document.querySelectorAll('.cinema-slide');
  const barSegments = document.querySelectorAll('.cinema-bar-segment');
  const prevBtn = document.getElementById('cinemaPrevBtn');
  const nextBtn = document.getElementById('cinemaNextBtn');
  const totalSlides = slides.length;
  let currentSlide = 0;

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentSlide = index;

    // Update slides visibility
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('is-current');
      } else {
        slide.classList.remove('is-current');
      }
    });

    // Update progress bar segments
    barSegments.forEach((segment, i) => {
      segment.classList.remove('is-viewed', 'is-active');
      if (i < currentSlide) {
        segment.classList.add('is-viewed');
      } else if (i === currentSlide) {
        segment.classList.add('is-active');
      }
    });

    // Update Prev / Next button state
    if (prevBtn) prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
    if (nextBtn) nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
  }

  window.cinemaGoToSlide = goToSlide;

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlide + 1);
    });
  }

  barSegments.forEach((segment) => {
    segment.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIdx = parseInt(segment.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx)) goToSlide(targetIdx);
    });
  });

  // Tap navigation: Left half = Previous, Right half = Next
  if (cinemaStage) {
    cinemaStage.addEventListener('click', (e) => {
      // Ignore clicks on interactive controls, inputs, buttons, links
      if (e.target.closest('button, input, textarea, a, label, .cinema-topbar, .slide-rsvp-sheet')) {
        return;
      }
      const width = window.innerWidth;
      if (e.clientX < width * 0.35) {
        goToSlide(currentSlide - 1);
      } else {
        goToSlide(currentSlide + 1);
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!cinemaStage || !cinemaStage.classList.contains('is-active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (['ArrowRight', 'Space'].includes(e.key)) {
      goToSlide(currentSlide + 1);
      e.preventDefault();
    } else if (['ArrowLeft'].includes(e.key)) {
      goToSlide(currentSlide - 1);
      e.preventDefault();
    }
  });

  // Touch Swipe for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    if (!cinemaStage || !cinemaStage.classList.contains('is-active')) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!cinemaStage || !cinemaStage.classList.contains('is-active')) return;
    if (e.target.closest('input, textarea, button, a, label')) return;

    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        goToSlide(currentSlide + 1); // Swipe left -> Next
      } else {
        goToSlide(currentSlide - 1); // Swipe right -> Prev
      }
    }
  }, { passive: true });

  // =========================================================================
  // 4. LIVE COUNTDOWN TIMER (15 OCTOMBRIE 2027)
  // =========================================================================
  const targetDate = new Date('2027-10-15T15:30:00+02:00').getTime();

  const daysEl = document.getElementById('cDays');
  const hoursEl = document.getElementById('cHours');
  const minutesEl = document.getElementById('cMinutes');
  const secondsEl = document.getElementById('cSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 5. RSVP & WHATSAPP GENERATOR
  // =========================================================================
  let adultCount = 2;
  let childCount = 0;

  const adultValEl = document.getElementById('cAdultVal');
  const childValEl = document.getElementById('cChildVal');

  window.cAdjustAdults = function (delta) {
    adultCount = Math.max(1, Math.min(10, adultCount + delta));
    if (adultValEl) adultValEl.textContent = adultCount;
  };

  window.cAdjustChildren = function (delta) {
    childCount = Math.max(0, Math.min(10, childCount + delta));
    if (childValEl) childValEl.textContent = childCount;
  };

  window.cSendWhatsApp = function (recipient) {
    const nameInput = document.getElementById('cGuestName');
    const guestName = nameInput ? nameInput.value.trim() : '';

    if (!guestName) {
      alert('Vă rugăm să introduceți numele dumneavoastră.');
      if (nameInput) nameInput.focus();
      return;
    }

    const attendanceRadio = document.querySelector('input[name="cAttendance"]:checked');
    const isAttending = attendanceRadio ? attendanceRadio.value === 'yes' : true;

    const messageNotes = document.getElementById('cNotes');
    const notes = messageNotes ? messageNotes.value.trim() : '';

    let text = `✨ *Răspuns Invitație Nuntă — Alex & Bianca* ✨\n\n`;
    text += `👤 *Nume:* ${guestName}\n`;
    text += `💌 *Prezență:* ${isAttending ? 'Confirm cu drag prezența! 🎉' : 'Cu regret nu voi putea participa.'}\n`;

    if (isAttending) {
      text += `👥 *Adulți:* ${adultCount}\n`;
      if (childCount > 0) {
        text += `👶 *Copii:* ${childCount}\n`;
      }
    }

    if (notes) {
      text += `📝 *Mesaj / Mențiuni:* ${notes}\n`;
    }

    text += `\n📅 *15 Octombrie 2027 · Lavin Bruchsal*`;

    const phone = recipient === 'alex' ? '4917655700551' : '4915563441309';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // =========================================================================
  // 6. GALLERY LIGHTBOX
  // =========================================================================
  const lightbox = document.getElementById('cLightbox');
  const lightboxImg = document.getElementById('cLightboxImg');
  const galleryCells = document.querySelectorAll('.slide-gallery-cell');
  let currentImgIndex = 0;

  const galleryImages = Array.from(galleryCells).map((item) => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  });

  function showLightbox(index) {
    if (!lightbox || !lightboxImg || galleryImages.length === 0) return;
    currentImgIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImgIndex];
    lightbox.style.display = 'flex';
  }

  function closeLightbox() {
    if (lightbox) lightbox.style.display = 'none';
  }

  galleryCells.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(index);
    });
  });

  const closeBtn = document.getElementById('cLbClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
})();
