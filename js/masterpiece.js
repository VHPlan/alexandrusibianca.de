/**
 * ALEX & BIANCA — MASTERPIECE INTERACTION SCRIPT
 */

(function () {
  'use strict';

  // 1. PARTICLES ENGINE (INTRO)
  const canvas = document.getElementById('introParticles');
  let introParticleEngine = null;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: Math.random() * 0.35 + 0.08,
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

    introParticleEngine = {
      stop: () => { isRunning = false; }
    };
  }

  // 2. DISCOVER INVITATION TRANSITION
  const introScene = document.getElementById('introScene');
  const discoverBtn = document.getElementById('discoverBtn');
  const masterSite = document.getElementById('masterSite');

  function openMasterSite() {
    if (!introScene) return;

    introScene.classList.add('is-dismissed');
    introScene.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');

    if (masterSite) {
      masterSite.classList.add('is-active');
      masterSite.setAttribute('aria-hidden', 'false');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (introParticleEngine) {
      setTimeout(introParticleEngine.stop, 1500);
    }
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', openMasterSite);
  }

  // 3. LIVE COUNTDOWN TIMER (15 OCTOMBRIE 2027)
  const targetDate = new Date('2027-10-15T15:30:00+02:00').getTime();

  const daysEl = document.getElementById('mDays');
  const hoursEl = document.getElementById('mHours');
  const minutesEl = document.getElementById('mMinutes');
  const secondsEl = document.getElementById('mSeconds');

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

  // 4. GALLERY STRIP & LIGHTBOX
  const galleryStrip = document.getElementById('masterGalStrip');
  const btnPrev = document.getElementById('masterGalPrev');
  const btnNext = document.getElementById('masterGalNext');

  if (galleryStrip && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      galleryStrip.scrollBy({ left: -260, behavior: 'smooth' });
    });
    btnNext.addEventListener('click', () => {
      galleryStrip.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  const lightbox = document.getElementById('masterLightbox');
  const lightboxImg = document.getElementById('masterLightboxImg');
  const closeBtn = document.getElementById('masterLbClose');
  const galleryThumbnails = document.querySelectorAll('.master-gal-thumb img');

  galleryThumbnails.forEach((img) => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('is-open');
      }
    });
  });

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => lightbox.classList.remove('is-open'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('is-open');
    });
  }

  // 5. RSVP SUBMISSION VIA WHATSAPP
  window.submitMasterRsvp = function () {
    const nameInput = document.getElementById('masterGuestName');
    const guestName = nameInput ? nameInput.value.trim() : '';

    if (!guestName) {
      alert('Vă rugăm să introduceți numele și prenumele.');
      if (nameInput) nameInput.focus();
      return;
    }

    const attendanceSelect = document.getElementById('masterAttendance');
    const attendanceVal = attendanceSelect ? attendanceSelect.value : 'yes';
    const isAttending = attendanceVal === 'yes';

    const guestsCount = document.getElementById('masterGuestCount') ? document.getElementById('masterGuestCount').value : '2';
    const notes = document.getElementById('masterNotes') ? document.getElementById('masterNotes').value.trim() : '';

    let text = `✨ *Răspuns Invitație Nuntă — Alex & Bianca* ✨\n\n`;
    text += `👤 *Nume:* ${guestName}\n`;
    text += `💌 *Prezență:* ${isAttending ? 'Confirm cu drag prezența! 🎉' : 'Cu regret nu voi putea fi alături de voi.'}\n`;

    if (isAttending) {
      text += `👥 *Număr persoane:* ${guestsCount}\n`;
    }

    if (notes) {
      text += `📝 *Mesaj:* ${notes}\n`;
    }

    text += `\n📅 *15 Octombrie 2027 · Lavin Bruchsal*`;

    const phone = '4917655700551';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

})();
