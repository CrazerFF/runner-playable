
import { Sprite } from 'pixi.js';

export class Particle extends Sprite {
  constructor(texture, x, y, mode = 'up') {
    super(texture);

    this.anchor.set(0.5);
    this.x = x;  // важна эта строка
    this.y = y;

    const speed = Math.random() * 5 + 4;

    if (mode === 'up') {
      const spread = Math.PI / 2;
      const angle = -Math.PI / 2 + (Math.random() * spread - spread / 2);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    } else {
      // Режим "стена сверху"
      this.vx = Math.random() * 1 - 0.5;  // немного разброса по X
      this.vy = speed;                    // скорость вниз
    }

    this.life = 300;
    this.maxLife = this.life;
    this.scale.set(Math.random() * 0.6 + 0.4);
  }

  update(delta = 1) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;

    this.life--;
    this.alpha = this.life / this.maxLife;

    return this.life <= 0;
  }
}
