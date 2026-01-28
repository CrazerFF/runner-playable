import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { sound } from '../objects/SoundManager';
import { Player } from '../objects/Player.js';
import { Spawner } from '../objects/Spawner.js';
import { CollisionManager } from '../objects/CollisionManager.js';
import { ScrollingBackground } from '../objects/ScrollingBackground.js';
import { TutorialManager } from '../objects/TutorialManager.js';
import { Tape } from '../objects/Tape.js';
import { Firework } from '../objects/Firework.js';
import { FireworkSequence } from '../objects/FireworkSequence.js';
import { GameScoreDisplay } from '../objects/GameScoreDisplay.js';
import { CtaButton } from '../Hud/CtaButton.js';
import { TextPopup } from '../objects/TextPopup.js';

export class Game extends Container {
  constructor(designWidth, designHeight, w, h, uiLayer) {
    super();
    this.DESIGN_W = designWidth;
    this.DESIGN_H = designHeight;
    this.roundPixels = true;
    this.objects = [];
    this.collidables = [];
    this.uiLayer = uiLayer;
    this.scorePanel = uiLayer.scorePanel;
    this.score = 0;
    this.gamePaused = false;
    this.gameFinished = false;
    this.flagJump = false;

    this.collectCount = 0;

    this.collectMessages = ['Awesome!', 'Perfect!', 'Fantastic!'];

    // ВКЛЮЧАЕМ ИНТЕРАКТИВНОСТЬ КОНТЕЙНЕРА
    this.eventMode = 'static';
    this.interactiveChildren = true;

    this.create();
    this.setupControls();
    //  this.resize(w, h);

    // запуск фоновой музыки
    window.addEventListener(
      'pointerdown',
      () => {
        sound.playMusic();
      },
      { once: true },
    );
  }

  create() {
    this.sortableChildren = true;
    // Фон
    this.bg = new ScrollingBackground('bg', 6000, 704, 5);
    this.bg.x = -3000;
    this.addChild(this.bg);
    this.objects.push(this.bg);

    // Спавнер
    this.spawner = new Spawner(this, 1280, 720);
    this.objects.push(this.spawner);

    // Игрок
    this.player = new Player(this);
    this.player.x = this.DESIGN_W / 2 - 125;
    this.player.y = this.DESIGN_H / 2 + 74;
    this.addChild(this.player);
    this.objects.push(this.player);

    this.tutorial = new TutorialManager(this);
    this.addChild(this.tutorial);
    this.objects.push(this.tutorial);

    this.tape = new Tape(0, 320);
    this.addChild(this.tape);
    this.tape.visible = false;
    this.objects.push(this.tape);

    this.seq = new FireworkSequence(this, this.DESIGN_W);

    // this.gameScore = new GameScoreDisplay(this.uiLayer.scorePanel);
    // this.addChild(this.gameScore);
    // this.gameScore.x = 150;
    // this.gameScore.y = 410;
    // this.gameScore.scale.set(0.7);
    // this.gameScore.zIndex = 3000;
    // this.gameScore.visible = true;

    const click = new Howl({ src: ['click.mp3'], volume: 0.6 });

    this.on('pointerdown', () => {
      click.play();
    });

    const music = new Howl({
      src: ['music.mp3'],
      loop: true,
      volume: 0.3,
    });
  }

  onGameOver() {
    this.scene.gameFinished = true; // чтобы включить секвенцию
    //  this.scene.seq.start();               // запускаем таймлайн
    this.scene.gameScore.visible = true; // показываем финальные очки
    this.scene.uiLayer.installButton.visible = false; // показываем кнопку
  }

  startTutorial() {
    if (this.gamePaused) return;

    this.gamePaused = true;

    this.tutorial = new Tutorial(this);
    this.uiLayer.addChild(this.tutorial);
  }

  setPaused(value) {
    this.gamePaused = value;
  }

  update(delta) {
    this.seq.update(delta);
    this.tutorial.update(delta);
    this.uiLayer.ctaButton.update(delta);
    this.uiLayer.installButton.update(delta);
    //  this.uiLayer.update(delta);
    // this.gameScore.update(delta);
    if (this.spawner?.timer) {
      this.spawner.timer.update(delta);
    }

    if (this.gamePaused) {
      // Обновляем только вращение flash объектов
      for (const obj of this.objects) {
        if (obj && obj.type === 'flash' && obj.rotationSpeed) {
          obj.rotation += obj.rotationSpeed * delta;
        }
      }
      if (this.tutorial.hand) {
        this.tutorial.animation(delta);
      }
      if (this.tape) {
        this.tape.update(delta);
      }
    }
    if (this.gamePaused) return;
    // апдейт всех объектов
    for (const obj of this.objects) {
      if (obj.update) obj.update(delta);
      if (obj._collectUpdate) {
        obj._collectUpdate();
      }

      // удаляем объекты за пределами экрана
      this.destroyOffscreenObjects();
    }

    CollisionManager.check(this.player, this.collidables, (obj) => {
      if (obj.type === 'enemy' || obj.type === 'cone') this.onPlayerHit(obj);
      if (obj.type === 'money' || obj.type === 'card')
        this.onPlayerCollectItem(obj, delta);
    });
  }

  onPlayerHit(obj) {
    if (this.player.isHit) return;
    if (this.player.isJumping) return;
    sound.play('hit');
    this.player.isHit = true;
    this.player.playHit(); // теперь сам Player решает, когда вернуться в бег
    this.player.flashRed();
    this.uiLayer.heartsDisplay.takeDamage();
  }

  onPlayerCollectItem(obj, delta) {
    if (!obj || obj._collected) return;
    obj._collected = true;
    sound.play('collect');

    // ===== СЧЁТЧИК СБОРА =====
    this.collectCount++;

    // показываем текст только на каждую 3-ю вещь
    if (this.collectCount % 4 === 0) {
      const messageIndex =
        Math.floor(this.collectCount / 3 - 1) % this.collectMessages.length;

      const message = this.collectMessages[messageIndex];

      const popup = new TextPopup(
        message,
        this.DESIGN_W / 2,
        this.DESIGN_H / 2,
        50,
      );

      popup.zIndex = 6700;
      this.addChild(popup);
      this.objects.push(popup);
    }

    const isMoney = obj.type === 'money';
    const scoreValue = isMoney ? 20 : 35;

    // === стартовые параметры ===
    const startX = obj.x;
    const startY = obj.y;
    const startScale = obj.scale.x;
    const startRotation = obj.rotation || 0;

    const duration = 40; // кадров
    let t = 0;

    // сколько крутиться (2 оборота)
    const totalRotation = Math.PI * 4;

    // === каждый кадр анимация ===
    obj._collectUpdate = () => {
      if (obj._collectDone) return;
      t++;
      const p = Math.min(t / duration, 1);

      // ease-out cubic
      const ease = 1 - Math.pow(1 - p, 3) * delta;

      // ===== РЕАЛЬНАЯ ЦЕЛЬ: ScorePanel =====
      const panel = this.uiLayer.scorePanel.panel;

      // локальная точка цели (центр панели)
      const localTarget = {
        x: -panel.width * 4,
        y: panel.height * 3,
      };

      // UI → global → Game
      const globalTarget = panel.toGlobal(localTarget);
      const target = this.toLocal(globalTarget);

      // === движение ===
      obj.x = startX + (target.x - startX) * ease;
      obj.y = startY + (target.y - startY) * ease;

      // === уменьшение ===
      const scale = startScale * (1 - p);
      obj.scale.set(scale);

      // === вращение ===
      obj.rotation = startRotation + totalRotation * ease;

      // === конец ===
      if (p >= 1) {
        obj._collectDone = true;
        obj._collectUpdate = null;
        this.addScore(scoreValue);
        this.destroyObject(obj);
      }
    };
  }

  addScore(value) {
    this.score = value;
    this.uiLayer.scorePanel.addScore(this.score);
  }

  setupControls() {
    this.on('touchend', (event) => {
      if (!this.flagJump) return;
      if (this.gamePaused) return;

      this.player.jump();
      sound.play('jump');
    });

    this.on('pointerup', (event) => {
      if (!this.flagJump) return;

      this.player.jump();
    });
  }

  resize(DESIGN_W, DESIGN_H, w, h) {
    if (!this.bg) return;

    const scaleX = DESIGN_H / h;
    // Высота фона оставляем в дизайновых единицах
    this.bg.height = DESIGN_H;

    // Pivot и позиция — центр фонового тайла в сцене
    this.bg.pivot.set(this.bg.width / 2, this.bg.height / 2);
    this.bg.position.set(DESIGN_W / 2, DESIGN_H / 2);
    this.children.forEach((child) => {
      if (child?.resize) {
        child.resize(w, h);
      }
    });
  }

  // ---- метод для удаления объектов за экраном ----
  destroyOffscreenObjects() {
    const margin = 800; // запас слева
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];

      // не удаляем фон, игрока и спавнер
      if (
        obj === this.bg ||
        obj === this.player ||
        obj === this.spawner ||
        obj === this.tape
      )
        continue;

      if (obj.x + (obj.width || 0) < -margin) {
        // удалить с канваса
        if (obj.parent) obj.parent.removeChild(obj);

        // удалить из collidables
        const collIndex = this.collidables.indexOf(obj);
        if (collIndex !== -1) this.collidables.splice(collIndex, 1);

        // destroy PIXI (без текстур Assets)
        if (obj.destroy) obj.destroy({ children: true });

        // удалить из массива объектов
        this.objects.splice(i, 1);
      }
    }
  }

  destroyObject(obj) {
    if (!obj) return;

    // убрать из сцены
    if (obj.parent) obj.parent.removeChild(obj);

    // убрать из objects
    const i = this.objects.indexOf(obj);
    if (i !== -1) this.objects.splice(i, 1);

    // убрать из collidables
    const c = this.collidables.indexOf(obj);
    if (c !== -1) this.collidables.splice(c, 1);

    obj.destroy();
  }
}
