/**
 * THE 200.000€ ROYAL WEDDING - LIVE DEDICATIONS BOARD
 * Interactive live guest dedication feed with initial royal wishes
 */

class DedicationsBoard {
  constructor(audioEngine, particleEngine) {
    this.audio = audioEngine;
    this.particles = particleEngine;
    this.container = document.getElementById('dedications-list');
    this.form = document.getElementById('dedication-quick-form');
    this.STORAGE_KEY = 'AB_200K_DEDICATIONS_LIST';

    this.defaultDedications = [
      {
        from: 'Nașii Mari (Familia Ionescu)',
        song: 'Florin Salam — Nevasta Mea',
        message: 'Să vă iubiți toată viața ca în prima zi! Casă de piatră și o viață regească împreună!',
        amount: '10.000€ VIP',
        time: 'Acum 10 minute'
      },
      {
        from: 'Frații & Cavalerii de Onoare',
        song: 'Florin Salam — Oriunde Ai Fi',
        message: 'Pentru Alexandru & Bianca, cel mai frumos cuplu din România! Să curgă șampania până dimineață!',
        amount: '5.000€ VIP',
        time: 'Acum 25 minute'
      },
      {
        from: 'Domnișoarele de Onoare',
        song: 'Regina Inimii Mele',
        message: 'Bianca, ești cea mai spectaculoasă mireasă din univers! Vă dorim fericire infinită!',
        amount: 'VIP Rose',
        time: 'Acum 40 minute'
      }
    ];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  getDedications() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return this.defaultDedications;
  }

  saveDedications(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  render() {
    const list = this.getDedications();
    this.container.innerHTML = list.map(item => `
      <div class="dedication-card reveal revealed">
        <div class="dedication-header">
          <div class="dedication-from">
            <span class="gold-24k-text">👑 ${escapeHtml(item.from)}</span>
            <span class="dedication-time">${item.time}</span>
          </div>
          <span class="dedication-badge">${escapeHtml(item.amount || 'VIP Gold')}</span>
        </div>
        <div class="dedication-song">🎵 Piesă Solicitată: <strong>${escapeHtml(item.song)}</strong></div>
        <p class="dedication-msg">„${escapeHtml(item.message)}”</p>
      </div>
    `).join('');
  }

  handleSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('dedication-author');
    const songInput = document.getElementById('dedication-song-input');
    const msgInput = document.getElementById('dedication-text-input');

    const from = nameInput ? nameInput.value.trim() : '';
    const song = songInput ? songInput.value.trim() : 'Manea Specială de Dragoste';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!from || !message) {
      alert('Vă rugăm să introduceți numele și mesajul dedicației!');
      return;
    }

    const newDedication = {
      from,
      song,
      message,
      amount: 'VIP Dedicație Live',
      time: 'Chiar acum'
    };

    const currentList = this.getDedications();
    currentList.unshift(newDedication);
    this.saveDedications(currentList);
    this.render();

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (songInput) songInput.value = '';
    if (msgInput) msgInput.value = '';

    // Sparkle & audio confirmation
    const btnRect = this.form.querySelector('button[type="submit"]').getBoundingClientRect();
    if (this.particles) {
      this.particles.createBurst(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, 80);
    }
    if (this.audio) {
      this.audio.playConfirmSuccess();
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.DedicationsBoard = DedicationsBoard;
