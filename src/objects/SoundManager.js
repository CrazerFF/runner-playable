import { Howl, Howler } from 'howler';

class SoundManager {
  constructor() {
    Howler.autoSuspend = false;

    // пользовательский мут (кнопка)
    this.enabled = true;

    // мут из-за потери фокуса
    this.mutedByFocus = false;

    this.sounds = {
      music: new Howl({
        src: ['assets/audio/music.mp3'],
        loop: true,
        volume: 0.3,
      }),

      jump: new Howl({
        src: ['assets/audio/jump.mp3'],
        volume: 0.7,
      }),

      collect: new Howl({
        src: ['assets/audio/collect.mp3'],
        volume: 0.8,
      }),

      hit: new Howl({
        src: ['assets/audio/hit.mp3'],
        volume: 0.8,
      }),

      finish: new Howl({
        src: ['assets/audio/finish.mp3'],
        volume: 1,
      }),

      fail: new Howl({
        src: ['assets/audio/fail.mp3'],
        volume: 0.6,
      }),
    };

    this.initFocusHandlers();
  }

  // ===============================
  // ФОКУС / ПОТЕРЯ ФОКУСА
  // ===============================

  initFocusHandlers() {
    window.addEventListener('blur', () => {
      this.muteByFocus();
    });

    window.addEventListener('focus', () => {
      this.restoreAfterFocus();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.muteByFocus();
      } else {
        this.restoreAfterFocus();
      }
    });
  }

  muteByFocus() {
    if (!this.enabled) return;

    this.mutedByFocus = true;
    Howler.volume(0);
  }

  restoreAfterFocus() {
    if (!this.enabled) return;

    if (this.mutedByFocus) {
      this.mutedByFocus = false;
      Howler.volume(1);
    }
  }

  // ===============================
  // PUBLIC API
  // ===============================

  play(name) {
    if (!this.enabled) return;
    this.sounds[name]?.play();
  }

  playMusic() {
    if (!this.enabled) return;

    const music = this.sounds.music;
    if (!music.playing()) {
      music.play();
    }
  }

  stopMusic() {
    this.sounds.music.stop();
  }

  // пользовательский mute (кнопка)
  mute(value) {
    this.enabled = !value;

    if (value) {
      Howler.volume(0);
    } else {
      // если окно сейчас активно — возвращаем звук
      if (!this.mutedByFocus) {
        Howler.volume(1);
      }
    }
  }
}

export const sound = new SoundManager();
