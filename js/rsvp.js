/**
 * ALEX & BIANCA — VIP GOLD TICKET RSVP ENGINE
 */

class LuxuryRSVP {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;

    this.formContainer = document.getElementById('rsvp-form-container');
    this.form = document.getElementById('rsvp-form');
    this.choiceYes = document.getElementById('rsvp-choice-yes');
    this.choiceNo = document.getElementById('rsvp-choice-no');
    this.detailedFields = document.getElementById('rsvp-detailed-fields');
    this.guestDetailsGroup = document.getElementById('rsvp-guest-details-group');
    this.successContainer = document.getElementById('rsvp-success-container');
    this.ticketGuestName = document.getElementById('ticket-guest-name');
    this.editBtn = document.getElementById('rsvp-edit-response-btn');

    this.selectedAttendance = null;

    this.init();
  }

  init() {
    if (!this.form) return;

    if (this.choiceYes) {
      this.choiceYes.addEventListener('click', () => {
        this.selectAttendance(true);
      });
    }

    if (this.choiceNo) {
      this.choiceNo.addEventListener('click', () => {
        this.selectAttendance(false);
      });
    }

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    if (this.editBtn) {
      this.editBtn.addEventListener('click', () => {
        this.successContainer.style.display = 'none';
        this.formContainer.style.display = 'block';
      });
    }

    // Check saved state
    const saved = localStorage.getItem('alex_bianca_rsvp_2027');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.name && this.ticketGuestName) {
          this.ticketGuestName.textContent = data.name;
        }
      } catch (e) {}
    }
  }

  selectAttendance(isAttending) {
    this.selectedAttendance = isAttending;

    if (isAttending) {
      this.choiceYes.classList.add('selected');
      this.choiceNo.classList.remove('selected');
      if (this.guestDetailsGroup) this.guestDetailsGroup.style.display = 'contents';
    } else {
      this.choiceNo.classList.add('selected');
      this.choiceYes.classList.remove('selected');
      if (this.guestDetailsGroup) this.guestDetailsGroup.style.display = 'none';
    }

    this.detailedFields.style.display = 'block';
  }

  handleSubmit() {
    const name = document.getElementById('rsvp-name').value;
    const guests = document.getElementById('rsvp-guests') ? document.getElementById('rsvp-guests').value : '1';
    const children = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
    const menu = document.getElementById('rsvp-menu') ? document.getElementById('rsvp-menu').value : 'standard';
    const message = document.getElementById('rsvp-message') ? document.getElementById('rsvp-message').value : '';

    const payload = {
      attendance: this.selectedAttendance ? 'attending' : 'declined',
      name,
      guests,
      children,
      menu,
      message,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem('alex_bianca_rsvp_2027', JSON.stringify(payload));

    if (this.ticketGuestName) {
      this.ticketGuestName.textContent = name;
    }

    // Gold particle burst
    if (this.particles) {
      this.particles.createBurst(window.innerWidth / 2, window.innerHeight / 2, 90);
    }

    this.formContainer.style.display = 'none';
    this.successContainer.style.display = 'block';
  }
}
