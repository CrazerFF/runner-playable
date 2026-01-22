import { Container, Assets } from 'pixi.js';
import { Particle } from './Particle';
import { Sprite } from 'pixi.js';

export class Firework extends Container {
  constructor(x, y, direction = 'up', duration = 120) {
    super();

    this.x = x;
    this.y = y;
    this.direction = direction;

    this.textures = [
      Assets.get('spark1'),
      Assets.get('spark2'),
      Assets.get('spark3'),
      Assets.get('spark4')
    ];

    this.spawnRate = 4;
    this.duration = duration;
    this.timer = 0;

    this.particles = [];
  }

  update(delta = 1) {
    this.timer += delta;

    // СПАВН
    if (this.timer < this.duration) {
      for (let i = 0; i < this.spawnRate; i++) {
        const tex = this.textures[Math.floor(Math.random() * this.textures.length)];
        const p = new Particle(tex, 0, 0, this.direction);
        this.particles.push(p);
        this.addChild(p);
      }
    }

    // ОБНОВЛЕНИЕ
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (p.update(delta)) {
        this.removeChild(p);
        this.particles.splice(i, 1);
      }
    }

    // УДАЛЕНИЕ ЭМИТТЕРА
    if (this.timer >= this.duration && this.particles.length === 0) {
      this.parent?.removeChild(this);
      this.onComplete?.();
    }
  }
}
