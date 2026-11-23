/**
 * ALEX & BIANCA — DIGITAL STORYBOOK FULL-SCREEN SYSTEM
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. PARTICLES ENGINE (INTRO & STORYBOOK AMBIENCE)
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
  const ambientEngine = initParticleCanvas('storybookAmbientCanvas', 35, 0.25);

  // =========================================================================
  // 2. DISCOVER INVITATION (INTRO -> STORYBOOK TRANSITION)
  // =========================================================================
  const introScene = document.getElementById('introScene');
  const discoverBtn = document.getElementById('discoverBtn');
  const storybookSite = document.getElementById('storybookSite');

  function openStorybook() {
    if (!introScene) return;

    introScene.classList.add('is-dismissed');
    introScene.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');

    if (storybookSite) {
      storybookSite.classList.add('is-active');
      storybookSite.setAttribute('aria-hidden', 'false');
      storybookSite.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (introEngine) {
      setTimeout(introEngine.stop, 1500);
    }
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', openStorybook);
  }

  // =========================================================================
  // 3. STORYBOOK CHAPTER NAVIGATION (DOTS & INTERSECTION OBSERVER)
  // =========================================================================
  const chapters = document.querySelectorAll('.sb-chapter');
  const navDots = document.querySelectorAll('.sb-nav-dot');

  if (chapters.length > 0 && navDots.length > 0 && storybookSite) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navDots.forEach((dot) => {
            if (dot.getAttribute('data-target') === id) {
              dot.classList.add('is-active');
            } else {
              dot.classList.remove('is-active');
            }
          });
        }
      });
    }, {
      root: storybookSite,
      threshold: 0.5
    });

    chapters.forEach((chap) => observer.observe(chap));

    navDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl && storybookSite) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Keyboard Navigation (Page Up, Page Down, Arrow Up, Arrow Down)
  window.addEventListener('keydown', (e) => {
    if (!storybookSite || !storybookSite.classList.contains('is-active')) return;
    if (['ArrowDown', 'PageDown'].includes(e.key)) {
      // Find current chapter
      const current = Array.from(chapters).find(c => {
        const r = c.getBoundingClientRect();
        return r.top >= -50 && r.top < window.innerHeight / 2;
      });
      if (current && current.nextElementSibling && current.nextElementSibling.classList.contains('sb-chapter')) {
        current.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        e.preventDefault();
      }
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      const current = Array.from(chapters).find(c => {
        const r = c.getBoundingClientRect();
        return r.top >= -50 && r.top < window.innerHeight / 2;
      });
      if (current && current.previousElementSibling && current.previousElementSibling.classList.contains('sb-chapter')) {
        current.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
        e.preventDefault();
      }
    }
  });

  // =========================================================================
  // 4. LIVE COUNTDOWN TIMER (15 OCTOMBRIE 2027)
  // =========================================================================
  const targetDate = new Date('2027-10-15T15:30:00+02:00').getTime();

  const daysEl = document.getElementById('sbDays');
  const hoursEl = document.getElementById('sbHours');
  const minutesEl = document.getElementById('sbMinutes');
  const secondsEl = document.getElementById('sbSeconds');

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

  const adultValEl = document.getElementById('sbAdultVal');
  const childValEl = document.getElementById('sbChildVal');

  window.sbAdjustAdults = function (delta) {
    adultCount = Math.max(1, Math.min(10, adultCount + delta));
    if (adultValEl) adultValEl.textContent = adultCount;
  };

  window.sbAdjustChildren = function (delta) {
    childCount = Math.max(0, Math.min(10, childCount + delta));
    if (childValEl) childValEl.textContent = childCount;
  };

  window.sbSendWhatsApp = function (recipient) {
    const nameInput = document.getElementById('sbGuestName');
    const guestName = nameInput ? nameInput.value.trim() : '';

    if (!guestName) {
      alert('Vă rugăm să introduceți numele dumneavoastră.');
      if (nameInput) nameInput.focus();
      return;
    }

    const attendanceRadio = document.querySelector('input[name="sbAttendance"]:checked');
    const isAttending = attendanceRadio ? attendanceRadio.value === 'yes' : true;

    const messageNotes = document.getElementById('sbNotes');
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
  const lightbox = document.getElementById('sbLightbox');
  const lightboxImg = document.getElementById('sbLightboxImg');
  const galleryTiles = document.querySelectorAll('.sb-gallery-tile');
  let currentImgIndex = 0;

  const galleryImages = Array.from(galleryTiles).map((item) => {
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

  galleryTiles.forEach((item, index) => {
    item.addEventListener('click', () => showLightbox(index));
  });

  const closeBtn = document.getElementById('sbLbClose');
  const prevBtn = document.getElementById('sbLbPrev');
  const nextBtn = document.getElementById('sbLbNext');

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
