import { Howl, Howler } from 'howler';

class SoundManager {
  constructor() {
    Howler.autoSuspend = false;

    this.enabled = true;

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
  }

  play(name) {
    if (!this.enabled) return;
    this.sounds[name]?.play();
  }

  playMusic() {
    if (!this.enabled) return;
    if (!this.sounds.music.playing()) {
      this.sounds.music.play();
    }
  }

  stopMusic() {
    this.sounds.music.stop();
  }

  mute(value) {
    this.enabled = !value;
    Howler.mute(value);
  }
}

export const sound = new SoundManager();
