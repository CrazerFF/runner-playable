import { Sprite, Assets, Graphics } from 'pixi.js';
import { Enemy } from './Enemy.js';

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

    // Для точечного спавна
    this.timeAccumulator = 0;

    // обычные спавны по времени
    this.scheduledSpawns = [
      { time: 0.0, type: 'startIntro' },
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
      { time: 29.2, type: 'tear'},
      { time: 29.9, type: 'firework'},
    //  { time: 0, type: 'firework'},

   

    ];

    // ======== Заполняем экран деревьями и столбами на старте ========
    const visibleWidth = this.designWidth + 400; // ширина видимой зоны + запас
    const spacing = 500; // расстояние между объектами
    for (let x = 0; x <= visibleWidth; x += spacing) {
      this.scheduledSpawns.unshift({ time: 0, type: 'tree', x, y: this.designHeight * 0.0 });
      this.scheduledSpawns.unshift({ time: 0, type: 'tree2', x, y: this.designHeight * 0.0 });
      this.scheduledSpawns.unshift({ time: 0, type: 'pole', x, y: this.designHeight * 0.035 });
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

    // ===== Точечный спавн =====
    this.timeAccumulator += delta * (1 / 60); // в секундах
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
    //  if (obj === this.scene.tape) continue;
      
      
      // Статические объекты (не двигаются)
      const staticObjects = ['flash', 'paypal']; // добавьте все статические
      if (obj.type && staticObjects.includes(obj.type)) continue;


      obj.x -= speed * delta;
      if (obj.type === 'coneFlash') {
        // Мигание с частотой 2 Гц (2 раза в секунду)
        const blinkSpeed = 1.5; // частота мигания
        const alpha = 0.5 + Math.sin(Date.now() * 0.001 * blinkSpeed * Math.PI * 2) * 0.5;
        obj.alpha = Math.max(0.3, alpha); // от 0.3 до 1.0
      }
    }
    if (this.scene.uiLayer.heartsDisplay.gameOver) {
       this.scene.player.playIdle();
      // this.fail();
      // тут сет таймаут и
      this.spawnGameOverSequence();
    }
    
  }
spawnGameOverSequence() {
    if (!this.scene || !this.scene.addChild) return;

    this.scene.gamePaused = true;

    // 1. Создаем затемнение
    const overlay = new Graphics();
    overlay.rect(-10000, -10000, this.designWidth+20000, this.designHeight+10000);
    overlay.fill({ color: 0x000000, alpha: 0.6 });
    overlay.type = 'overlay';
    overlay.zIndex = 999; // Ниже fail
    
    this.scene.addChild(overlay);
    this.scene.objects.push(overlay);

    // 2. Создаем fail
    const failSpawn = { type: 'fail', x: this.designWidth / 2 - 505, y: this.designHeight / 2 };
    this.spawnByType(failSpawn);
  
    // 3. Через 1.5 секунды удаляем fail и затемнение, добавляем остальное
    setTimeout(() => {
        // Удаляем fail
        const failObj = this.scene.objects.find(obj => obj.type === 'fail');
        if (failObj) {
            this.scene.removeChild(failObj);
            this.scene.objects = this.scene.objects.filter(o => o !== failObj);
        }
        
        // Удаляем затемнение
        const overlayObj = this.scene.objects.find(obj => obj.type === 'overlay');
        if (overlayObj) {
            this.scene.removeChild(overlayObj);
            this.scene.objects = this.scene.objects.filter(o => o !== overlayObj);
        }
        
        // Создаём Paypal и Flash
        this.spawnByType({ type: 'paypal', x: this.designWidth / 2 - 505, y: this.designHeight / 2 });
        this.spawnByType({ type: 'flash', x: this.designWidth / 2 - 505, y: this.designHeight / 2 });

        // Показываем финальные очки и кнопку
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
        obj.anchor.set(0.5, 0.5);
        obj.zIndex = 5;
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
        obj.rotationSpeed = 0.03
        obj.zIndex = 1399;
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
