/**
 * ALEX & BIANCA — THE WEDDING | MAIN APP CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  const particles = new ParticleEngine('particles-canvas');
  const audio = new AudioEngine();
  const envelope = new EnvelopeCeremony(audio, particles);
  const gallery = new LuxuryGallery(audio);
  const rsvp = new LuxuryRSVP(audio, particles);

  initGuestPersonalization();
  initCountdown();
  initCalendarActions();
  initWhatsAppShare();
  initScrollAnimations();
});

/**
 * 1. GUEST NAME PERSONALIZATION VIA URL (?guest=Familia%20Popescu)
 */
function initGuestPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get('guest');

  if (guestName) {
    const banner = document.getElementById('guest-personalization-banner');
    const nameSpan = document.getElementById('personalized-guest-name');
    if (banner && nameSpan) {
      nameSpan.textContent = decodeURIComponent(guestName);
      banner.style.display = 'inline-block';
    }

    const rsvpNameInput = document.getElementById('rsvp-name');
    if (rsvpNameInput && !rsvpNameInput.value) {
      rsvpNameInput.value = decodeURIComponent(guestName);
    }
  }
}

/**
 * 2. LIVE COUNTDOWN TIMER (20 IUNIE 2027, 14:00:00)
 */
function initCountdown() {
  const targetDate = new Date('2027-06-20T14:00:00+03:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 3. CALENDAR ACTIONS (GOOGLE CALENDAR & .ICS DOWNLOAD)
 */
function initCalendarActions() {
  const googleBtn = document.getElementById('btn-add-google-cal');
  const icsBtn = document.getElementById('btn-add-apple-cal');

  const eventData = {
    title: 'Nunta Alex & Bianca',
    description: 'Vă invităm cu drag să sărbătoriți alături de noi nunta noastră!',
    location: 'Palatul Snagov, România',
    startTime: '20270620T110000Z',
    endTime: '20270621T030000Z'
  };

  if (googleBtn) {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.startTime}/${eventData.endTime}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    googleBtn.setAttribute('href', googleUrl);
    googleBtn.setAttribute('target', '_blank');
  }

  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadIcs(eventData);
    });
  }
}

function downloadIcs(data) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alex & Bianca//The Wedding//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${data.title}`,
    `DESCRIPTION:${data.description}`,
    `LOCATION:${data.location}`,
    `DTSTART:${data.startTime}`,
    `DTEND:${data.endTime}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Reminder: Nunta Alex & Bianca mâine!',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Alex-Bianca-Wedding-2027.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 4. WHATSAPP SHARING
 */
function initWhatsAppShare() {
  const shareBtn = document.getElementById('btn-whatsapp-share');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', () => {
    const text = `Te invităm la nunta noastră! ✨\nALEX & BIANCA — THE WEDDING\n20 Iunie 2027 • Palatul Snagov\n\nDeschide invitația digitală aici:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}

/**
 * 5. SCROLL REVEAL (INTERSECTION OBSERVER)
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-item');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
