/**
 * ALEX & BIANCA — EDITORIAL WEDDING CONTROLLER
 * Initializes Particles, Audio Engine, 3D Envelope Ceremony, Minimalist Countdown, Conversational RSVP, Calendar & WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Starlight Particles Engine
  const particles = new ParticleEngine('particles-canvas');

  // 2. Initialize Audio Engine
  const audio = new AudioEngine();

  // 3. Initialize 3D Envelope Ceremony
  const envelope = new EnvelopeCeremony(audio, particles);

  // 4. Live Countdown Timer (20 June 2027, 17:30)
  const targetDate = new Date('June 20, 2027 17:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const pad = (num) => String(num).padStart(2, '0');

    if (distance < 0) {
      if (document.getElementById('cd-days')) document.getElementById('cd-days').innerText = '00';
      if (document.getElementById('cd-hours')) document.getElementById('cd-hours').innerText = '00';
      if (document.getElementById('cd-minutes')) document.getElementById('cd-minutes').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (document.getElementById('cd-days')) document.getElementById('cd-days').innerText = pad(days);
    if (document.getElementById('cd-hours')) document.getElementById('cd-hours').innerText = pad(hours);
    if (document.getElementById('cd-minutes')) document.getElementById('cd-minutes').innerText = pad(minutes);
    if (document.getElementById('cd-seconds')) document.getElementById('cd-seconds').innerText = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Conversational RSVP Toggle Selection
  const toggleButtons = document.querySelectorAll('.rsvp-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const input = btn.querySelector('input[type="radio"]');
      if (input) input.checked = true;
    });
  });

  // 7. RSVP Form Submission
  const rsvpForm = document.getElementById('rsvp-dialogue-form');
  const rsvpSuccess = document.getElementById('rsvp-success-view');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name-input').value;
      const attending = document.querySelector('input[name="attending"]:checked')?.value || 'yes';
      const guestCount = document.getElementById('guest-count-input')?.value || '2';
      const guestNote = document.getElementById('guest-note-input')?.value || '';

      // Save to localStorage
      localStorage.setItem('alex_bianca_editorial_rsvp', JSON.stringify({
        name: guestName,
        attending,
        guests: guestCount,
        note: guestNote,
        timestamp: new Date().toISOString()
      }));

      // Particle celebration burst
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const rect = submitBtn.getBoundingClientRect();
      particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);

      // Show success dialogue
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.classList.add('active');
        const nameDisplay = document.getElementById('rsvp-guest-confirmed-name');
        if (nameDisplay) nameDisplay.innerText = guestName;
      }
    });
  }

  // 8. Add to Calendar (.ics Generator)
  const calendarBtns = document.querySelectorAll('.btn-action-calendar');
  calendarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Alex & Bianca//Wedding Invitation//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Nunta Alex & Bianca
DESCRIPTION:Suntem încântați să sărbătorim nunta noastră la Palatul Snagov!
LOCATION:Palatul Snagov, Aleea Palatului 1, Snagov
DTSTART:20270620T143000Z
DTEND:20270621T030000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Nunta_Alex_si_Bianca_2027.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  // 9. WhatsApp Sharing
  const whatsappBtns = document.querySelectorAll('.btn-action-whatsapp');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const message = `✨ Alex & Bianca — 20 Iunie 2027 la Palatul Snagov. Vezi invitația oficială aici: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    });
  });
});
