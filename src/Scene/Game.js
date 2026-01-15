import { Container, Graphics, Sprite, Assets } from 'pixi.js'; 
import { Player } from '../objects/Player.js';
//import { CTAButton } from '../Ui/CTAButton.js';
import { ScrollingBackground } from '../objects/ScrollingBackground.js';

export class Game extends Container {
  constructor(designWidth, designHeight) {
    super();
    this.DESIGN_W = designWidth;
    this.DESIGN_H = designHeight;
    this.roundPixels = true;
    this.objects = [];
    
    // ВКЛЮЧАЕМ ИНТЕРАКТИВНОСТЬ КОНТЕЙНЕРА
    this.eventMode = 'static';
    this.interactiveChildren = true;

    this.create();
    this.setupControls();
  }

  create() {
    // Фон
    this.bg = new ScrollingBackground('bg', 6000, 704, 5,);
    this.bg.x = -3000;
    this.addChild(this.bg);

    this.player = new Player();
    this.player.x = (this.DESIGN_W / 2) - 125; // используем designWidth из конструктора
    this.player.y = (this.DESIGN_H / 2) + 74; // используем designHeight
    this.addChild(this.player);
   // this.player.playIdle();
    this.player.playRun();
   // this.player.playHit();


    // CTA кнопка (можно включить когда нужно)
    // this.cta = new CTAButton();
    // this.addChild(this.cta);

    this.objects = [this.player, this.bg];

  }

  setupControls() {
    // 1. Клик мышкой (десктоп)
    this.on('touchend', (event) => {
        this.player.jump();
        console.log('jump');
    });

    this.on('pointerup', (event) => {
        this.player.jump();
        console.log('jump');
    });
  };

  
  resize(DESIGN_W, DESIGN_H, w, h) {
    if (!this.bg) return;

    const scaleX = DESIGN_H / h;
    // Высота фона оставляем в дизайновых единицах
    this.bg.height = DESIGN_H;

    // Pivot и позиция — центр фонового тайла в сцене
    this.bg.pivot.set(this.bg.width / 2, this.bg.height / 2);
    this.bg.position.set(DESIGN_W / 2, DESIGN_H / 2);
  }

    

  // Метод update вызывается из main.js в игровом цикле
  update(time) {
    // Оптимизированный цикл
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (obj.update) obj.update(time);
    }

    // Простая гравитация (пример)
    // if (this.player.y < 1200) {
    //   this.player.y += 0.5 * time.deltaTime; // используем deltaTime
    // }
  }

  // Дополнительные методы для playable ads
  // startGame() {
  //   this.player.start();
  //   this.bg.startScrolling();
  // }

  // pauseGame() {
  //   this.player.pause();
  //   this.bg.pauseScrolling();
  // }

  // endGame() {
  //   // Сигнал для рекламной сети
  //   if (window.playableCompleted) {
  //     window.playableCompleted();
  //   }
  // }
}