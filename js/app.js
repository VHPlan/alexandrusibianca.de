/**
 * ALEX & BIANCA — LUXURY WEDDING INVITATION CONTROLLER
 * Main app logic: Intro transition, countdown, RSVP, calendar, WhatsApp share & scroll reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles
  const particles = new ParticleEngine('particles-canvas');

  // 2. Intro Screen Opening Transition
  const introScreen = document.getElementById('intro-screen');
  const openBtn = document.getElementById('btn-open-invitation');
  const mainInvitation = document.getElementById('main-invitation');

  if (openBtn && introScreen && mainInvitation) {
    openBtn.addEventListener('click', () => {
      // Golden Particle Burst at Button Position
      const rect = openBtn.getBoundingClientRect();
      particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 85);

      // Fade out intro & reveal main invitation
      introScreen.classList.add('opened');
      mainInvitation.classList.add('active');

      // Scroll smoothly to Hero
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    });
  }

  // 3. Live Countdown Timer (20 June 2027, 17:30)
  const targetDate = new Date('June 20, 2027 17:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    if (document.getElementById('days')) document.getElementById('days').innerText = pad(days);
    if (document.getElementById('hours')) document.getElementById('hours').innerText = pad(hours);
    if (document.getElementById('minutes')) document.getElementById('minutes').innerText = pad(minutes);
    if (document.getElementById('seconds')) document.getElementById('seconds').innerText = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. RSVP Radio Group Selection
  const radioCards = document.querySelectorAll('.rsvp-radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = card.querySelector('input[type="radio"]');
      if (input) input.checked = true;
    });
  });

  // 6. RSVP Form Submission
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name').value;
      const attending = document.querySelector('input[name="attending"]:checked')?.value || 'yes';
      const guestsCount = document.getElementById('guest-count')?.value || '1';

      // Save to localStorage
      localStorage.setItem('alex_bianca_rsvp', JSON.stringify({
        name: guestName,
        attending,
        guests: guestsCount,
        timestamp: new Date().toISOString()
      }));

      // Particle celebration burst
      const btn = rsvpForm.querySelector('button[type="submit"]');
      const rect = btn.getBoundingClientRect();
      particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);

      // Show success view
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.classList.add('active');
        const nameDisplay = document.getElementById('rsvp-success-name');
        if (nameDisplay) nameDisplay.innerText = guestName;
      }
    });
  }

  // 7. Add to Calendar (.ics Generator)
  const calendarBtn = document.getElementById('btn-add-calendar');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Alex & Bianca//Wedding Invitation//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Nunta Alex & Bianca
DESCRIPTION:Suntem bucuroși să sărbătorim nunta noastră alături de voi la Palatul Snagov!
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
  }

  // 8. WhatsApp Sharing
  const whatsappBtn = document.getElementById('btn-whatsapp-share');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const message = `✨ Ne căsătorim! Alex & Bianca vă invită să sărbătoriți alături de ei pe 20 Iunie 2027 la Palatul Snagov. Vezi invitația oficială aici: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    });
  }
});
