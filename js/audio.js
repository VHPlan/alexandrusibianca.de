/**
 * ALEX & BIANCA — LUXURY WEDDING AUDIO ENGINE
 * Handles smooth fade-in, mute/unmute, and background music playback upon envelope opening.
 */

class AudioEngine {
  constructor() {
    this.audio = new Audio('assets/audio/lele_daca_lumea_se_termina.mp3');
    this.audio.preload = 'auto';
    this.audio.loop = true;
    this.audio.volume = 0; // Starts at 0 for smooth luxury fade-in

    this.playerWrap = document.getElementById('floating-music-player');
    this.playBtn = document.getElementById('player-play-btn');
    this.isPlaying = false;
    this.hasUserInteracted = false;

    this.init();
  }

  init() {
    if (!this.playerWrap) return;

    this.playerWrap.addEventListener('click', () => {
      this.togglePlay();
    });
  }

  playSoftly() {
    if (this.isPlaying) return;
    this.hasUserInteracted = true;

    this.audio.play().then(() => {
      this.isPlaying = true;
      if (this.playerWrap) this.playerWrap.classList.add('playing');
      if (this.playBtn) this.playBtn.innerText = '❚❚';
      this.fadeIn();
    }).catch(() => {
      // Autoplay blocked by browser until direct click
    });
  }

  fadeIn(duration = 2000) {
    const targetVolume = 0.65;
    const stepTime = 50;
    const step = targetVolume / (duration / stepTime);

    const fadeInterval = setInterval(() => {
      if (this.audio.volume + step < targetVolume) {
        this.audio.volume += step;
      } else {
        this.audio.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  togglePlay() {
    if (!this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        if (this.playerWrap) this.playerWrap.classList.add('playing');
        if (this.playBtn) this.playBtn.innerText = '❚❚';
      });
    } else {
      this.audio.pause();
      this.isPlaying = false;
      if (this.playerWrap) this.playerWrap.classList.remove('playing');
      if (this.playBtn) this.playBtn.innerText = '▶';
    }
  }
}
