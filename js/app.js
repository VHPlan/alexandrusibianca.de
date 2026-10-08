/**
 * ALEX & BIANCA — VOGUE WEDDINGS / HAUTE COUTURE CONTROLLER
 * Coordinates Particle Engine, Audio Engine, Couture Reveal, Runway Countdown, RSVP & Social Actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles
  const particles = new ParticleEngine('particles-canvas');

  // 2. Initialize Audio Engine
  const audio = new AudioEngine();

  // 3. Initialize High-Fashion Couture Reveal
  const coutureReveal = new CoutureRevealEngine(audio, particles);

  // 4. Runway Live Countdown Timer (20 June 2027, 17:30)
  const targetDate = new Date('June 20, 2027 17:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const pad = (num) => String(num).padStart(2, '0');

    if (distance < 0) {
      if (document.getElementById('cd-days')) document.getElementById('cd-days').innerText = '00';
      if (document.getElementById('cd-hours')) document.getElementById('cd-hours').innerText = '00';
      if (document.getElementById('cd-minutes')) document.getElementById('cd-minutes').innerText = '00';
      if (document.getElementById('cd-seconds')) document.getElementById('cd-seconds').innerText = '00';
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

  // 5. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Interactive RSVP Selection Pills
  const choicePills = document.querySelectorAll('.rsvp-choice-pill');
  choicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      choicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const input = pill.querySelector('input[type="radio"]');
      if (input) input.checked = true;
    });
  });

  // 7. Full-Screen RSVP Submission
  const rsvpForm = document.getElementById('rsvp-fashion-form');
  const rsvpSuccess = document.getElementById('rsvp-success-modal');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name-field')?.value || '';
      const attending = document.querySelector('input[name="attending"]:checked')?.value || 'yes';
      const guestCount = document.getElementById('guest-count-field')?.value || '2';
      const guestNote = document.getElementById('guest-note-field')?.value || '';

      // Persist to localStorage
      localStorage.setItem('alex_bianca_vogue_rsvp', JSON.stringify({
        name: guestName,
        attending,
        guests: guestCount,
        note: guestNote,
        date: new Date().toISOString()
      }));

      // Particle flare
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const rect = submitBtn.getBoundingClientRect();
        particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
      }

      // Show confirmation
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.classList.add('active');
        const confirmedDisplay = document.getElementById('rsvp-guest-name-output');
        if (confirmedDisplay) confirmedDisplay.innerText = guestName;
      }
    });
  }

  // 8. Download Calendar Event (.ics Generator)
  const calendarBtns = document.querySelectorAll('.btn-download-ics');
  calendarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ics = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Alex & Bianca//Wedding Invitation//RO
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Nunta Alex & Bianca — Palatul Snagov
DESCRIPTION:Sărbătorim împreună cel mai frumos capitol la Palatul Snagov!
LOCATION:Palatul Snagov, Aleea Palatului 1, Snagov, Ilfov
DTSTART:20270620T143000Z
DTEND:20270621T030000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Alex_si_Bianca_20_Iunie_2027.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  // 9. WhatsApp Direct Sharing
  const whatsappBtns = document.querySelectorAll('.btn-share-whatsapp');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const message = `✨ Alex & Bianca — 20 Iunie 2027 la Palatul Snagov. Descoperă invitația oficială aici: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    });
  });
});
