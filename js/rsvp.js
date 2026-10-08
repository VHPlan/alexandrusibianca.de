/**
 * ALEX & BIANCA — THE WEDDING
 * Progressive Reveal Luxury RSVP Experience
 */

class LuxuryRSVP {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;
    this.form = document.getElementById('rsvp-form');
    this.formContainer = document.getElementById('rsvp-form-container');
    this.successContainer = document.getElementById('rsvp-success-container');
    
    this.choiceYesBtn = document.getElementById('rsvp-choice-yes');
    this.choiceNoBtn = document.getElementById('rsvp-choice-no');
    this.detailedFields = document.getElementById('rsvp-detailed-fields');
    this.guestDetailsGroup = document.getElementById('rsvp-guest-details-group');
    this.editBtn = document.getElementById('rsvp-edit-response-btn');

    this.currentAttendance = null;
    this.STORAGE_KEY = 'ALEX_BIANCA_WEDDING_RSVP';

    this.init();
  }

  init() {
    if (!this.form) return;

    this.loadExistingRSVP();

    if (this.choiceYesBtn) {
      this.choiceYesBtn.addEventListener('click', () => {
        this.selectChoice('confirmed');
      });
    }

    if (this.choiceNoBtn) {
      this.choiceNoBtn.addEventListener('click', () => {
        this.selectChoice('declined');
      });
    }

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    if (this.editBtn) {
      this.editBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playClick();
        this.showForm();
      });
    }
  }

  selectChoice(status) {
    this.currentAttendance = status;
    if (this.audio) this.audio.playClick();

    if (status === 'confirmed') {
      this.choiceYesBtn.classList.add('selected');
      this.choiceNoBtn.classList.remove('selected');
      if (this.guestDetailsGroup) this.guestDetailsGroup.style.display = 'contents';
    } else {
      this.choiceNoBtn.classList.add('selected');
      this.choiceYesBtn.classList.remove('selected');
      if (this.guestDetailsGroup) this.guestDetailsGroup.style.display = 'none';
    }

    if (this.detailedFields) {
      this.detailedFields.style.display = 'block';
    }
  }

  loadExistingRSVP() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.showSuccess(data, false);
      }
    } catch (e) {}
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.currentAttendance) {
      alert('Vă rugăm să alegeți o opțiune de participare.');
      return;
    }

    const name = document.getElementById('rsvp-name').value.trim();
    const guests = document.getElementById('rsvp-guests') ? document.getElementById('rsvp-guests').value : '1';
    const children = document.getElementById('rsvp-children') ? document.getElementById('rsvp-children').value : '0';
    const menu = document.getElementById('rsvp-menu') ? document.getElementById('rsvp-menu').value : 'standard';
    const message = document.getElementById('rsvp-message').value.trim();

    if (!name) {
      alert('Vă rugăm să introduceți numele dumneavoastră.');
      return;
    }

    const payload = {
      attendance: this.currentAttendance,
      name,
      guests,
      children,
      menu,
      message,
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const rect = submitBtn.getBoundingClientRect();
    if (this.particles) {
      this.particles.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
    }
    if (this.audio) {
      this.audio.playSuccess();
    }

    this.showSuccess(payload, true);
  }

  showSuccess(data, triggerScroll = true) {
    if (!this.formContainer || !this.successContainer) return;

    const msgEl = document.getElementById('rsvp-success-message');
    if (msgEl) {
      if (data.attendance === 'confirmed') {
        msgEl.innerHTML = `MULȚUMIM, ${escapeHtml(data.name).toUpperCase()}.<br>ABIA AȘTEPTĂM SĂ SĂRBĂTORIM ÎMPREUNĂ.`;
      } else {
        msgEl.innerHTML = `MULȚUMIM PENTRU RĂSPUNS, ${escapeHtml(data.name).toUpperCase()}.<br>VĂ PURTĂM CU DRAG ÎN SUFLET.`;
      }
    }

    this.formContainer.style.display = 'none';
    this.successContainer.style.display = 'block';

    if (triggerScroll) {
      this.successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  showForm() {
    if (!this.formContainer || !this.successContainer) return;
    this.successContainer.style.display = 'none';
    this.formContainer.style.display = 'block';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.LuxuryRSVP = LuxuryRSVP;
