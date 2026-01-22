import { Assets } from 'pixi.js';
import { Firework } from './Firework.js';
import { Particle } from './Particle.js';

export class FireworkSequence {
  constructor(container, width) {
    this.container = container;
    this.width = width;

    // Текстуры частиц
    this.textures = [
      Assets.get('spark1'),
      Assets.get('spark2'),
      Assets.get('spark3'),
      Assets.get('spark4')
    ];

    // Нижние фонтаны
    this.left = null;
    this.right = null;

    // Верхняя стена (занавес)
    this.curtainActive = false;
    this.curtainTimer = 0;
    this.curtainDurationFrames = 120; // ≈ 1.5 сек
    this.curtainSpawnRate = 16;
    this.curtainParticles = [];

    // Таймер задержки перед занавесом
    this.curtainDelayFrames = 120; // ≈ 2 сек
    this.curtainCountdown = 0;
    this.curtainStarted = false;

    // Флаг активности всей последовательности
    this.isActive = false;
  }

  start() {
    this.isActive = true;

    // Сброс всех таймеров
    this.curtainCountdown = 0;
    this.curtainTimer = 0;
    this.curtainStarted = false;
    this.curtainActive = false;

    // Запускаем нижние фонтаны
    this.left = new Firework(-150, 550);
    this.right = new Firework(450, 550);

    this.left.onComplete = () => { this.left.finished = true; };
    this.right.onComplete = () => { this.right.finished = true; };

    this.container.addChild(this.left, this.right);
  }

  stop() {
    this.isActive = false;

    if (this.left) {
      this.container.removeChild(this.left);
      this.left = null;
    }
    if (this.right) {
      this.container.removeChild(this.right);
      this.right = null;
    }

    this.clearCurtainParticles();
  }

  startCurtain() {
    this.curtainActive = true;
    this.curtainTimer = 0;
    this.curtainStarted = true;
  }

  clearCurtainParticles() {
    for (let i = this.curtainParticles.length - 1; i >= 0; i--) {
      const p = this.curtainParticles[i];
      if (p.parent) this.container.removeChild(p);
    }
    this.curtainParticles = [];
  }

  update() {
    if (!this.isActive) return;

    // Обновляем нижние фонтаны
    this.left?.update(1);
    this.right?.update(1);

    // Запуск верхнего фонтана через задержку
    if (!this.curtainStarted) {
      this.curtainCountdown++;
      if (this.curtainCountdown >= this.curtainDelayFrames) {
        this.startCurtain();
      }
    }

    // Верхний фонтан (занавес)
    if (this.curtainActive) {
      this.curtainTimer++;

      // Создаём новые частицы, пока не прошла duration
      if (this.curtainTimer <= this.curtainDurationFrames) {
        for (let i = 0; i < this.curtainSpawnRate; i++) {
          const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
          const x = (Math.random() * this.width*15) - 1500;
          const p = new Particle(texture, x, -20, 'down');
          this.container.addChild(p);
          this.curtainParticles.push(p);
        }
      }

      // Обновляем существующие частицы
      for (let i = this.curtainParticles.length - 1; i >= 0; i--) {
        const p = this.curtainParticles[i];
        if (p.update(1)) {
          this.container.removeChild(p);
          this.curtainParticles.splice(i, 1);
        }
      }

      // Завершаем занавес, когда время прошло и все частицы исчезли
      if (this.curtainTimer >= this.curtainDurationFrames && this.curtainParticles.length === 0) {
        this.curtainActive = false;
      }
    }
  }
}
