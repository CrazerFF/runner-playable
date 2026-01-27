import { Sprite, Assets, Graphics } from 'pixi.js';
import { Enemy } from './Enemy.js';
import { sound } from './SoundManager';
import { TextPopup } from './TextPopup.js';

export class Spawner {
  constructor(scene, designWidth, designHeight) {
    this.scene = scene;
    this.designWidth = designWidth;
    this.designHeight = designHeight;

    // Таймеры декоративных объектов
    this.treeTimer = 0;
    this.treeDelay = 100;
    this.treeTimer2 = 0;
    this.treeDelay2 = 75;
    this.poleTimer = 0;
    this.poleDelay = 100;
    this.kustTimer = 0;
    this.kustDelay = 100; // Исправлено: было kuetDelay
    this.currentKustIndex = 0; // Индекс текущего куста для поочерёдного спавна
    
    // Для точечного спавна
    this.timeAccumulator = 0;

    // обычные спавны по времени
    this.scheduledSpawns = [
      { time: 0.0, type: 'startIntro' },
      { time: 0.0, type: 'money', x: 0, y: 0, texture: 'money' },
      { time: 0.2, type: 'money', x: 1000, y: 440, texture: 'money' },
      { time: 2.8, type: 'money', x: 1000, y: 440, texture: 'money' },
      { time: 3.3, type: 'card', x: 1500, y: 430, texture: 'card' },
      { time: 9.15, type: 'startEnemyTutorial' },
      { time: 9.15, type: 'playerIdle'},
      { time: 5.7, type: 'enemy', x: 1400, y: 530 },

      { time: 9.5, type: 'money', x: 1000, y: 410, texture: 'money' },
      
      { time: 10.5, type: 'coneFlash', x: 1500, y: 430, texture: 'coneFlash' },
      { time: 10.5, type: 'cone', x: 1500, y: 430, texture: 'cone' },
      { time: 11.0, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 12.7, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 14.4, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 13.5, type: 'coneFlash', x: 1500, y: 430, texture: 'coneFlash' },
      { time: 13.5, type: 'cone', x: 1500, y: 430, texture: 'cone' },
      { time: 13.6, type: 'card', x: 1500, y: 320, texture: 'card' },
      { time: 16.1, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 16.5, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 15.5, type: 'coneFlash', x: 1500, y: 430, texture: 'coneFlash' },
      { time: 15.5, type: 'cone', x: 1500, y: 430, texture: 'cone' },
      { time: 15.6, type: 'card', x: 1500, y: 320, texture: 'card' },

      { time: 18.5, type: 'enemy', x: 1400, y: 530 },
      { time: 18.6, type: 'card', x: 1500, y: 320, texture: 'card' },
      { time: 19.3, type: 'card', x: 1500, y: 320, texture: 'card' },

      { time: 23, type: 'money', x: 1000, y: 410, texture: 'money' },
      { time: 23.5, type: 'money', x: 1000, y: 330, texture: 'money' },
      { time: 24, type: 'money', x: 1000, y: 250, texture: 'money' },
      { time: 24.5, type: 'money', x: 1000, y: 330, texture: 'money' },
      { time: 25, type: 'money', x: 1000, y: 410, texture: 'money' },

      { time: 26, type: 'finish', x: 1000, y:490, texture: 'finish' },
      { time: 29.9, type: 'pause', x: 1000, y:490, texture: 'pause' },

      { time: 29.8, type: 'flash', x: 130, y:380, texture: 'flash' },
      { time: 29.8, type: 'paypal', x: 162, y:360, texture: 'card' },

      { time: 24.2, type: 'tape'},
      { time: 0.2, type: 'tear'},
      { time: 29.9, type: 'firework'},

    ];

    // ======== Заполняем экран деревьями, столбами и кустами на старте ========
    const visibleWidth = this.designWidth + 400;
    const spacing = 500;
    for (let x = 0; x <= visibleWidth; x += spacing) {
      this.scheduledSpawns.unshift({ time: 0, type: 'tree', x, y: this.designHeight * 0.0 });
      this.scheduledSpawns.unshift({ time: 0, type: 'tree2', x, y: this.designHeight * 0.0 });
      this.scheduledSpawns.unshift({ time: 0, type: 'pole', x, y: this.designHeight * 0.035 });
      this.scheduledSpawns.unshift({ time: 0, type: 'kust', x, y: this.designHeight * 0.53 });
    }
  }

  update(delta) {
    
    // Обновляем таймеры декоративных объектов
    this.treeTimer += delta;
    if (this.treeTimer >= this.treeDelay) {
      this.spawnTree();
      this.treeTimer = 0;
    }

    this.treeTimer2 += delta;
    if (this.treeTimer2 >= this.treeDelay2) {
      this.spawnTree2();
      this.treeTimer2 = 0;
    }

    this.poleTimer += delta;
    if (this.poleTimer >= this.poleDelay) {
      this.spawnPole();
      this.poleTimer = 0;
    }

    this.kustTimer += delta;
    if (this.kustTimer >= this.kustDelay) {
      this.spawnKust();
      this.kustTimer = 0;
    }

    // ===== Точечный спавн =====
    this.timeAccumulator += delta * (1 / 60);
    for (const spawn of this.scheduledSpawns) {
      if (!spawn.spawned && this.timeAccumulator >= spawn.time) {
        this.spawnByType(spawn);
        spawn.spawned = true;
      }
    }

    // ===== Двигаем все объекты влево, кроме игрока =====
    const speed = 5;
    for (const obj of this.scene.objects) {
      if (obj instanceof Enemy) continue;
      if (obj === this.scene.player) continue;
      if (obj === this.scene.bg) continue;
      if (obj === this.scene.tutorial) continue;
      
      // Статические объекты (не двигаются)
      const staticObjects = ['flash', 'paypal'];
      if (obj.type && staticObjects.includes(obj.type)) continue;

      obj.x -= speed * delta;
      if (obj.type === 'coneFlash') {
        const blinkSpeed = 1.5;
        const alpha = 0.5 + Math.sin(Date.now() * 0.001 * blinkSpeed * Math.PI * 2) * 0.5;
        obj.alpha = Math.max(0.3, alpha);
      }
    }
    
    if (this.scene.uiLayer.heartsDisplay.gameOver) {
      this.scene.player.playIdle();
      this.spawnGameOverSequence();
    }
  }

  spawnGameOverSequence() {
    if (!this.scene || !this.scene.addChild) return;

    this.scene.gamePaused = true;

    const overlay = new Graphics();
    overlay.rect(-10000, -10000, this.designWidth+20000, this.designHeight+10000);
    overlay.fill({ color: 0x000000, alpha: 0.6 });
    overlay.type = 'overlay';
    overlay.zIndex = 999;
    
    this.scene.addChild(overlay);
    this.scene.objects.push(overlay);

    const failSpawn = { type: 'fail', x: this.designWidth / 2 - 505, y: this.designHeight / 2 };
    this.spawnByType(failSpawn);
  
    setTimeout(() => {
      const failObj = this.scene.objects.find(obj => obj.type === 'fail');
      if (failObj) {
        this.scene.removeChild(failObj);
        this.scene.objects = this.scene.objects.filter(o => o !== failObj);
      }
      
      const overlayObj = this.scene.objects.find(obj => obj.type === 'overlay');
      if (overlayObj) {
        this.scene.removeChild(overlayObj);
        this.scene.objects = this.scene.objects.filter(o => o !== overlayObj);
      }
      
      this.spawnByType({ type: 'paypal', x: this.designWidth / 2 - 505, y: this.designHeight / 2 });
      this.spawnByType({ type: 'flash', x: this.designWidth / 2 - 505, y: this.designHeight / 2 });

      if (this.scene.gameScore) this.scene.gameScore.visible = true;
      if (this.scene.uiLayer?.installButton) this.scene.uiLayer.installButton.visible = true;
    }, 1500);
  }

  spawnTree() {
    const tree = new Sprite(Assets.get('tree'));
    tree.x = this.designWidth + 200;
    tree.y = this.designHeight * 0.0;
    tree.type = 'tree';
    tree.zIndex = 1;

    this.scene.addChild(tree);
    this.scene.objects.push(tree);
  }

  spawnTree2() {
    const tree2 = new Sprite(Assets.get('tree2'));
    tree2.x = this.designWidth + 200;
    tree2.y = this.designHeight * 0.0;
    tree2.type = 'tree';
    tree2.zIndex = 1;

    this.scene.addChild(tree2);
    this.scene.objects.push(tree2);
  }

  spawnPole() {
    const pole = new Sprite(Assets.get('pole'));
    pole.x = this.designWidth + 200;
    pole.y = this.designHeight * 0.035;
    pole.type = 'pole';
    pole.zIndex = 1;

    this.scene.addChild(pole);
    this.scene.objects.push(pole);
  }

  spawnKust() {
    // Массив доступных текстур кустов
    const kustTextures = ['kust1', 'kust2', 'kust3'];
    
    // Получаем текущую текстуру и переходим к следующей
    const textureName = kustTextures[this.currentKustIndex];
    this.currentKustIndex = (this.currentKustIndex + 1) % kustTextures.length;
    
    const kust = new Sprite(Assets.get(textureName));
    kust.x = this.designWidth + 200;
    kust.y = this.designHeight * 0.53; // Или отрегулируйте высоту по необходимости
    kust.scale.set(0.5);
    kust.anchor.set(1,1);
    kust.type = 'kust';
    kust.zIndex = 1;

    this.scene.addChild(kust);
    this.scene.objects.push(kust);
  }

  spawnByType(spawn) {
    let obj;
    switch (spawn.type) {
      case 'enemy':
        obj = new Enemy(this.scene);
        obj.type = 'enemy';
        obj.zIndex = 5;
        break;
      case 'money':
        obj = new Sprite(Assets.get(spawn.texture || 'money'));
        obj.scale.set(0.09);
        obj.type = 'money';
        obj.anchor.set(0.5, 1);
        obj.zIndex = 5;

        this.textPopup = new TextPopup(
          'Congratulations! /n choose yo',
          this.designWidth/2-510,
          this.designHeight/2-200,
          45
        );
        this.scene.addChild(this.textPopup);
        this.textPopup.zIndex=2700;

        break;
      case 'card':
        obj = new Sprite(Assets.get(spawn.texture || 'card'));
        obj.scale.set(0.11);
        obj.anchor.set(0.5, 0.5);
        obj.type = 'card';
        obj.zIndex = 5;
        break;
      case 'tree':
        obj = new Sprite(Assets.get('tree'));
        obj.type = 'tree';
        obj.zIndex = 5;
        break;
      case 'tree2':
        obj = new Sprite(Assets.get('tree2'));
        obj.type = 'tree';
        obj.zIndex = 5;
        break;
      case 'pole':
        obj = new Sprite(Assets.get('pole'));
        obj.type = 'pole';
        obj.zIndex = 5;
        break;
      case 'kust':
        // Для точечного спавна также используем поочерёдность
        const kustTextures = ['kust1', 'kust2', 'kust3'];
        const textureIndex = Math.floor(Math.random() * kustTextures.length); // Или можно использовать циклический подход
        const kustTexture = kustTextures[textureIndex];
        
        
        obj = new Sprite(Assets.get(kustTexture));
        obj.type = 'kust';
        obj.scale.set(0.5);
        obj.anchor.set(1,1);
        obj.zIndex = 5;
        break;
      case 'cone':
        obj = new Sprite(Assets.get('cone'));
        obj.scale.set(0.7);
        obj.type = 'cone';
        obj.zIndex = 5;
        break;
      case 'coneFlash':
        obj = new Sprite(Assets.get('coneFlash'));
        obj.type = 'coneFlash';
        obj.scale.set(0.7);
        obj.zIndex = 5;
        break;
      case 'startIntro':
        this.scene.tutorial.startIntro();
        return;
      case 'startEnemyTutorial':
        this.scene.tutorial.startEnemyTutorial();
        return;
      case 'playerIdle':
        this.scene.player.playIdle();
        return;
      case 'finish':
        obj = new Sprite(Assets.get('finish'));
        obj.scale.set(1);
        obj.type = 'finish';
        obj.zIndex = 2;
        break;
      case 'pause':
        this.scene.gamePaused = true;
        this.scene.player.playIdle();
        return;
      case 'paypal':
        obj = new Sprite(Assets.get('card'));
        obj.scale.set(0.3);
        obj.anchor.set(0.5, 0.5);
        obj.type = 'card';
        obj.zIndex = 1400;
        break;
      case 'flash':
        obj = new Sprite(Assets.get('flash'));
        obj.scale.set(1);
        obj.anchor.set(0.5, 0.5);
        obj.type = 'flash';
        obj.rotationSpeed = 0.03;
        obj.zIndex = 1399;
        sound.play('finish');
        sound.stopMusic();
        break;
      case 'tape':
        this.scene.tape.visible = true;
        this.scene.tape.x = 1550;
        this.scene.tape.zIndex = 2000;
        break;
      case 'tear':
        this.scene.tape.tear();
        break;
      case 'firework':
        this.scene.gameFinished = true;
        this.scene.seq.start();
        this.scene.gameScore.visible = true;
        this.scene.uiLayer.installButton.visible = true;
        break;
      case 'fail':
        obj = new Sprite(Assets.get('fail'));
        obj.scale.set(1);
        obj.anchor.set(0.5, 0.5);
        obj.type = 'fail';
        obj.zIndex = 5000;
        sound.play('fail');
        sound.stopMusic();

        this.textPopup = new TextPopup(
          'Congratulations!',
          this.hand.x,
          this.hand.y - 220,
          45
        );
        this.addChild(this.textPopup);
        break;
    }

    if (!obj) return;

    obj.x = spawn.x;
    obj.y = spawn.y;

    this.scene.addChild(obj);
    this.scene.objects.push(obj);

    if (['enemy', 'money', 'card', 'cone'].includes(spawn.type)) {
      this.scene.collidables.push(obj);
    }
  }
}