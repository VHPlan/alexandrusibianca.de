/**
 * ALEX & BIANCA — THE WEDDING
 * Ultimate Love Manea Jukebox Player (Florin Salam - Te-Am Găsit Frumoasă Stea)
 */

class AudioEngine {
  constructor() {
    this.playlist = [
      {
        title: 'Florin Salam — Te-Am Găsit Frumoasă Stea',
        tag: '👑 Piesa Specială de Dragoste',
        src: 'assets/audio/florin_salam_stea.mp3'
      },
      {
        title: 'Florin Salam — Dacă Tu N-Ai Fi',
        tag: '💎 Hit Romantic de Nuntă',
        src: 'assets/audio/florin_salam_daca_tu_n-ai_fi.mp3'
      },
      {
        title: 'Florin Salam — Nevasta Mea',
        tag: '🌹 Iubirea Vieții Mele',
        src: 'assets/audio/florin_salam_nevasta_mea.mp3'
      },
      {
        title: 'Florin Salam — Oriunde Ai Fi Te Voi Iubi',
        tag: '✨ Dragoste Eternă',
        src: 'assets/audio/florin_salam_oriunde_ai_fi.mp3'
      }
    ];

    this.currentIndex = 0;
    this.isPlaying = false;
    
    this.audio = new Audio();
    this.audio.src = this.playlist[0].src;
    this.audio.preload = 'auto';
    this.audio.volume = 0.9;

    this.playerBox = document.getElementById('floating-music-player');
    this.vinylDisc = document.getElementById('vinyl-disc');
    this.trackTitle = document.getElementById('player-track-title');
    this.trackTag = document.getElementById('player-track-tag');
    this.playBtn = document.getElementById('player-play-btn');
    this.nextBtn = document.getElementById('player-next-btn');

    this.init();
  }

  init() {
    this.updateTrackInfo();

    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMusic();
      });
    }

    if (this.playerBox) {
      this.playerBox.addEventListener('click', (e) => {
        if (e.target.closest('#player-next-btn')) return;
        this.toggleMusic();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextTrack();
      });
    }

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    // Unlock audio on first user touch anywhere
    const unlock = () => {
      if (!this.isPlaying) {
        this.audio.load();
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
  }

  updateTrackInfo() {
    const track = this.playlist[this.currentIndex];
    if (this.trackTitle) this.trackTitle.textContent = track.title;
    if (this.trackTag) this.trackTag.textContent = track.tag;
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  playMusic() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      if (this.playerBox) this.playerBox.classList.add('playing');
      if (this.vinylDisc) this.vinylDisc.classList.add('spinning');
      if (this.playBtn) this.playBtn.innerHTML = '❚❚';
    }).catch(err => {
      console.warn('Waiting for user gesture to play:', err);
    });
  }

  pauseMusic() {
    this.audio.pause();
    this.isPlaying = false;
    if (this.playerBox) this.playerBox.classList.remove('playing');
    if (this.vinylDisc) this.vinylDisc.classList.remove('spinning');
    if (this.playBtn) this.playBtn.innerHTML = '▶';
  }

  nextTrack() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    const wasPlaying = this.isPlaying;
    this.audio.src = this.playlist[this.currentIndex].src;
    this.updateTrackInfo();
    if (wasPlaying) {
      this.playMusic();
    }
  }
}

window.AudioEngine = AudioEngine;
