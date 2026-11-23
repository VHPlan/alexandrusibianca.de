/**
 * ALEX & BIANCA — ROYAL EDITORIAL EXPERIENCE
 * Modern White & Gold Wedding Publication
 */

(function () {
  'use strict';

  // Target Wedding Date: 15 Octombrie 2027, 18:00
  var TARGET_DATE = new Date('2027-10-15T18:00:00+02:00').getTime();

  /* ==========================================================================
     1. INTRO PARTICLES
     ========================================================================== */
  function initIntroParticles() {
    var canvas = document.getElementById('introParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    var particleCount = Math.min(60, Math.floor(width / 20));
    var particles = [];

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * 0.02 + 0.01,
        up: Math.random() > 0.5
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.up) {
          p.alpha += p.pulse;
          if (p.alpha >= 0.85) p.up = false;
        } else {
          p.alpha -= p.pulse;
          if (p.alpha <= 0.15) p.up = true;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(235, 205, 130, ' + p.alpha + ')';
        ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      var intro = document.getElementById('introScene');
      if (intro && !intro.classList.contains('is-dismissed')) {
        requestAnimationFrame(render);
      }
    }

    render();
  }

  /* ==========================================================================
     2. TRANSITION FROM INTRO TO EDITORIAL
     ========================================================================== */
  function initTransition() {
    var discoverBtn = document.getElementById('discoverBtn');
    var introScene = document.getElementById('introScene');
    var editorialSite = document.getElementById('editorialSite');

    if (!discoverBtn || !introScene || !editorialSite) return;

    discoverBtn.addEventListener('click', function () {
      introScene.classList.add('is-dismissed');
      document.body.classList.remove('is-locked');
      editorialSite.classList.add('is-active');

      setTimeout(function () {
        editorialSite.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    });
  }

  /* ==========================================================================
     3. COUNTDOWN TIMER
     ========================================================================== */
  function initCountdown() {
    var daysEl = document.getElementById('edDays');
    var hoursEl = document.getElementById('edHours');
    var minutesEl = document.getElementById('edMinutes');
    var secondsEl = document.getElementById('edSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      var now = Date.now();
      var diff = TARGET_DATE - now;

      if (diff <= 0) {
        daysEl.textContent = '000';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(3, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     4. GALLERY NAVIGATION & LIGHTBOX
     ========================================================================== */
  function initGallery() {
    var track = document.getElementById('edGalTrack');
    var prev = document.getElementById('edGalPrev');
    var next = document.getElementById('edGalNext');
    var lightbox = document.getElementById('edLightbox');
    var lbImg = document.getElementById('edLbImg');
    var lbClose = document.getElementById('edLbClose');

    if (track && prev && next) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -260, behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        track.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }

    if (lightbox && lbImg) {
      document.querySelectorAll('.ed-gal-item img').forEach(function (img) {
        img.addEventListener('click', function () {
          lbImg.src = img.src;
          lbImg.alt = img.alt || 'Fotografie nuntă';
          lightbox.classList.add('is-open');
        });
      });

      if (lbClose) {
        lbClose.addEventListener('click', function () {
          lightbox.classList.remove('is-open');
        });
      }

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          lightbox.classList.remove('is-open');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
          lightbox.classList.remove('is-open');
        }
      });
    }
  }

  /* ==========================================================================
     5. RSVP WHATSAPP SUBMISSION
     ========================================================================== */
  window.submitEditorialRsvp = function () {
    var name = (document.getElementById('edGuestName') || {}).value || '';
    var attendance = (document.getElementById('edAttendance') || {}).value || 'yes';
    var count = (document.getElementById('edGuestCount') || {}).value || '2';
    var notes = (document.getElementById('edNotes') || {}).value || '';

    if (!name.trim()) {
      alert('Vă rugăm să introduceți numele dumneavoastră.');
      return;
    }

    var attendingText = attendance === 'yes' ? 'DA, voi fi prezent(ă) cu mare drag!' : 'Din păcate, NU pot participa.';
    var message = 'Bună Alex & Bianca!\n\n' +
      'Confirmare participare nuntă (15.10.2027):\n' +
      '• Nume: ' + name.trim() + '\n' +
      '• Răspuns: ' + attendingText + '\n' +
      '• Număr persoane: ' + count + '\n';

    if (notes.trim()) {
      message += '• Mesaj: ' + notes.trim() + '\n';
    }

    message += '\nCu drag!';

    var phone = '4917655700551';
    var waUrl = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodeURIComponent(message);
    window.open(waUrl, '_blank');
  };

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initIntroParticles();
    initTransition();
    initCountdown();
    initGallery();
  });
})();
