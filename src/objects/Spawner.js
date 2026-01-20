import { Sprite, Assets } from 'pixi.js';
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
      { time: 0.2, type: 'money', x: 1000, y: 393, texture: 'money' },
      { time: 3.0, type: 'money', x: 1000, y: 393, texture: 'money' },
      { time: 9.15, type: 'startEnemyTutorial', tutorialId: 'jump' },
      { time: 5.0, type: 'enemy', x: 1400, y: 530 },
      { time: 5.0, type: 'card', x: 1500, y: 390, texture: 'card' },
      { time: 12.0, type: 'enemy', x: 2200, y: 525 },
      { time: 19.0, type: 'enemy', x: 2200, y: 530 },
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

      obj.x -= speed * delta;
    }
    
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
        obj = new Enemy();
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
        obj.type = 'cone';
        obj.zIndex = 5;
        break;
      case 'coneFlash':
        obj = new Sprite(Assets.get('coneFlash'));
        obj.type = 'coneFlash';
        obj.zIndex = 5;
        break;
      case 'startIntro':
        this.scene.tutorial.startIntro();
        return;
      case 'startEnemyTutorial':
        this.scene.tutorial.startEnemyTutorial();
        return;
    }

    if (!obj) return;

    obj.x = spawn.x;
    obj.y = spawn.y;

    this.scene.addChild(obj);
    this.scene.objects.push(obj);

    if (['enemy', 'money', 'card'].includes(spawn.type)) {
      this.scene.collidables.push(obj);
    }
  }
}
