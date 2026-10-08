/**
 * ALEX & BIANCA — THE WEDDING | AUDIO ENGINE
 * Primary Soundtrack: LeLe — Dacă lumea se termină (feat. Andra Voloș)
 */

class AudioEngine {
  constructor() {
    this.playlist = [
      {
        title: 'LeLe — Dacă lumea se termină',
        tag: '👑 Melodia Mirilor',
        src: 'assets/audio/lele_daca_lumea_se_termina.mp3'
      },
      {
        title: 'Florin Salam — Te-Am Găsit Frumoasă Stea',
        tag: '💎 Hit Romantic',
        src: 'assets/audio/florin_salam_stea.mp3'
      },
      {
        title: 'Florin Salam — Dacă Tu N-Ai Fi',
        tag: '🌹 Dragoste Eternă',
        src: 'assets/audio/florin_salam_daca_tu_n-ai_fi.mp3'
      }
    ];

    this.currentIndex = 0;
    this.isPlaying = false;

    this.audio = new Audio();
    this.audio.src = this.playlist[0].src;
    this.audio.preload = 'auto';
    this.audio.volume = 0.95;

    this.playerBox = document.getElementById('floating-music-player') || document.getElementById('floating-soundwave-bar');
    this.vinylDisc = document.getElementById('vinyl-disc');
    this.trackTitle = document.getElementById('player-track-title') || document.getElementById('soundwave-title');
    this.trackTag = document.getElementById('player-track-tag') || document.getElementById('soundwave-badge');
    this.playBtn = document.getElementById('player-play-btn') || document.getElementById('soundwave-play-btn');
    this.nextBtn = document.getElementById('player-next-btn') || document.getElementById('soundwave-next-btn');

    this.init();
  }

  init() {
    this.updateUI();

    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    if (this.playerBox) {
      this.playerBox.addEventListener('click', (e) => {
        if (e.target !== this.playBtn && e.target !== this.nextBtn) {
          this.toggle();
        }
      });
    }

    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }

  updateUI() {
    const current = this.playlist[this.currentIndex];
    if (this.trackTitle) this.trackTitle.textContent = current.title;
    if (this.trackTag) this.trackTag.textContent = current.tag;
    if (this.playBtn) this.playBtn.textContent = this.isPlaying ? '❚❚' : '▶';

    if (this.playerBox) {
      if (this.isPlaying) {
        this.playerBox.classList.add('playing');
      } else {
        this.playerBox.classList.remove('playing');
      }
    }
  }

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    }).catch((err) => {
      console.log('Autoplay audio notification:', err);
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.audio.src = this.playlist[this.currentIndex].src;
    this.play();
  }
}
