/**
 * ALEX & BIANCA — WEDDING EDITORIAL & CINEMATIC INTRO INTERACTION SCRIPT
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. FLOATING BOKEH & GOLD PARTICLES CANVAS (INTRO)
  // =========================================================================
  const canvas = document.getElementById('introParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: Math.random() * 0.35 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseVal: Math.random() * Math.PI,
      });
    }

    let isIntroActive = true;

    function renderParticles() {
      if (!isIntroActive) return;
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
        ctx.fillStyle = `rgba(245, 215, 150, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(235, 195, 120, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);

    // Disable particle loop once intro is dismissed to save battery & CPU
    window.stopIntroParticles = function () {
      isIntroActive = false;
    };
  }

  // =========================================================================
  // 2. DISCOVER INVITATION (TRANSITION FROM INTRO TO EDITORIAL SITE)
  // =========================================================================
  const introScene = document.getElementById('introScene');
  const discoverBtn = document.getElementById('discoverBtn');
  const editorialSite = document.getElementById('editorialSite');

  function openEditorialSite() {
    if (!introScene) return;

    introScene.classList.add('is-dismissed');
    introScene.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');

    if (editorialSite) {
      editorialSite.classList.add('is-active');
      editorialSite.setAttribute('aria-hidden', 'false');
      // Scroll to top of editorial site smoothly
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (window.stopIntroParticles) {
      setTimeout(window.stopIntroParticles, 1500);
    }
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', openEditorialSite);
  }

  // =========================================================================
  // 3. LIVE COUNTDOWN TIMER (15 OCTOMBRIE 2027)
  // =========================================================================
  // Target: 2027-10-15T15:30:00 (Europe/Berlin timezone: CEST / UTC+2 in Oct)
  const targetDate = new Date('2027-10-15T15:30:00+02:00').getTime();

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

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
  // 4. RSVP STEPPERS & WHATSAPP INTEGRATION
  // =========================================================================
  let adultCount = 2;
  let childCount = 0;

  const adultValEl = document.getElementById('adultCountVal');
  const childValEl = document.getElementById('childCountVal');

  window.adjustAdults = function (delta) {
    adultCount = Math.max(1, Math.min(10, adultCount + delta));
    if (adultValEl) adultValEl.textContent = adultCount;
  };

  window.adjustChildren = function (delta) {
    childCount = Math.max(0, Math.min(10, childCount + delta));
    if (childValEl) childValEl.textContent = childCount;
  };

  window.sendWhatsAppRSVP = function (targetRecipient) {
    const nameInput = document.getElementById('rsvpGuestName');
    const guestName = nameInput ? nameInput.value.trim() : '';

    if (!guestName) {
      alert('Vă rugăm să introduceți numele dumneavoastră.');
      if (nameInput) nameInput.focus();
      return;
    }

    const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
    const isAttending = attendanceRadio ? attendanceRadio.value === 'yes' : true;

    const messageNotes = document.getElementById('rsvpNotes');
    const notes = messageNotes ? messageNotes.value.trim() : '';

    let text = `✨ *Răspuns Invitație Nuntă — Alex & Bianca* ✨\n\n`;
    text += `👤 *Nume:* ${guestName}\n`;
    text += `💌 *Prezență:* ${isAttending ? 'Confirm cu drag prezența! 🎉' : 'Cu regret nu voi putea fi alături de voi.'}\n`;

    if (isAttending) {
      text += `👥 *Adulți:* ${adultCount}\n`;
      if (childCount > 0) {
        text += `👶 *Copii:* ${childCount}\n`;
      }
    }

    if (notes) {
      text += `📝 *Mesaj / Mențiuni:* ${notes}\n`;
    }

    text += `\n📅 *15 Octombrie 2027*`;

    // Phone numbers:
    // Alex: 4917655700551
    // Bianca: 4915563441309
    const phone = targetRecipient === 'alex' ? '4917655700551' : '4915563441309';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // =========================================================================
  // 5. GALLERY LIGHTBOX
  // =========================================================================
  const lightbox = document.getElementById('edLightbox');
  const lightboxImg = document.getElementById('edLightboxImg');
  const galleryItems = document.querySelectorAll('.ed-gallery-item');
  let currentImgIndex = 0;

  const galleryImages = Array.from(galleryItems).map((item) => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  });

  function showLightbox(index) {
    if (!lightbox || !lightboxImg || galleryImages.length === 0) return;
    currentImgIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImgIndex];
    lightbox.classList.add('is-open');
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('is-open');
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => showLightbox(index));
  });

  const closeBtn = document.getElementById('edLbClose');
  const prevBtn = document.getElementById('edLbPrev');
  const nextBtn = document.getElementById('edLbNext');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showLightbox(currentImgIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showLightbox(currentImgIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentImgIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentImgIndex + 1);
  });
})();
