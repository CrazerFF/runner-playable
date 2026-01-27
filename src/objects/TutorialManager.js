import { Container, Sprite, Assets, Graphics } from 'pixi.js';
import { TextPopup } from './TextPopup.js';

export class TutorialManager extends Container {
  constructor(game) {
    super();

    this.game = game;
    this.active = false;
    this.currentStep = null;
    this.zIndex = 1000;

    // ===== ПРОЗРАЧНАЯ КЛИКАБЕЛЬНАЯ ОБЛАСТЬ =====
    this.clickArea = new Graphics();
    
    

    // рука
    this.hand = new Sprite(Assets.get('hand'));
    this.hand.anchor.set(0.5);
    this.hand.scale.set(0.06);
    this.hand.visible = false;
    this.hand.zIndex = 1022;
    this.addChild(this.hand);
    this.hand.interactive = true;
    this.hand.on('pointerup', () => this.onTap());

    // Исправление для PixiJS v8 (убрать предупреждения)
    this.clickArea.rect(-400, -400, this.game.DESIGN_W + 1400, this.game.DESIGN_H + 400);
    this.clickArea.fill(0xFFFFFF);
    this.clickArea.alpha = 0.01; // почти прозрачный, но кликабельный
    
    this.clickArea.interactive = true;
    this.clickArea.cursor = 'pointer';
    this.clickArea.zIndex = 1010;
    this.clickArea.visible = false;
    this.clickArea.on('pointerup', () => this.onTap());
    this.clickArea.on('touchend', () => this.onTap());
    this.addChild(this.clickArea);

    this.textPopup = null;
  }

  animation(delta) {
  if (!this.hand || !this.hand.visible) return;
  
  // Просто используем текущее время
  const time = Date.now() * 0.003; // текущее время в секундах
  
  // Пульсация масштаба
  const scale = 1 + Math.sin(time * 2) * 0.005;
  this.hand.scale.set(scale);
  
  // Легкое движение вверх-вниз
  const offsetY = Math.sin(time * 1.5) * 3;
  this.hand.y = this.game.DESIGN_H / 2 + 160 + offsetY; // или другая базовая позиция
}

  // ===== СТАРТОВЫЙ ТУТОРИАЛ =====
  startIntro() {
    if (this.active) return;

    this.active = true;
    this.game.gamePaused = true;
    this.game.flagJump = false;
    this.game.player.playIdle();

    // Активируем большую кликабельную область
    this.clickArea.visible = true;

    this.hand.visible = true;
    this.hand.x = this.game.DESIGN_W / 2 ;
    this.hand.y = this.game.DESIGN_H / 2 + 160;

    this.textPopup = new TextPopup(
      'Tap to start earning!',
      this.hand.x,
      this.hand.y - 220,
      45
    );
    this.addChild(this.textPopup);
  }

  // ===== ВРАГ =====
  startEnemyTutorial() {
    if (this.active) return;

    this.active = true;
    this.game.gamePaused = true;
    this.game.flagJump = true;

    // Активируем большую кликабельную область
    this.clickArea.visible = true;

    this.hand.visible = true;
    this.hand.x = this.game.DESIGN_W / 2;
    this.hand.y = this.game.DESIGN_H / 2 - 40;

    this.textPopup = new TextPopup(
      'Jump to avoid enemies!',
      this.hand.x,
      this.hand.y - 120,
      50
    );
    this.addChild(this.textPopup);
  }

  // ===== ТАП =====
// ===== ТАП =====
onTap() {
    if (!this.active) return;

    console.log('Tutorial tap detected');
    this.active = false;
    this.game.gamePaused = false;
    this.game.player.playIdle();
    
    // Скрываем кликабельную область
    this.clickArea.visible = false;
    this.hand.visible = false;

    // Если есть текст, запускаем отложенное уничтожение через 3 секунды
    if (this.textPopup) {
        const popup = this.textPopup;

        // Через 3 секунды уничтожаем попап и очищаем ссылку
        setTimeout(() => {
            if (popup && !popup.destroyed) {
                popup.destroy({ children: true });
            }
            if (this.textPopup === popup) {
                this.textPopup = null;
            }
        }, 3000);
    }

    this.game.player.playRun();
}


  // ===== ОБНОВЛЕНИЕ =====
update(delta) {
    if (this.game.gamePaused) return;
  if (this.textPopup) {
    if (this.textPopup.destroyed) {
      this.textPopup = null;
      return;
    }
    
    // Защита от больших значений delta
    const safeDelta = Math.min(delta, 0.4);
    this.textPopup.update(safeDelta);

    if (this.textPopup && this.textPopup.life <= 0) {
      this.textPopup = null;
    }
  }
}

  // ===== ОЧИСТКА =====
  destroy(options) {
    // удаляем кликабельную область
    if (this.clickArea) {
      this.clickArea.destroy();
    }
    super.destroy(options);
  }
}