import { Container, Graphics } from 'pixi.js';
import { AnimatedSprite, Assets } from 'pixi.js';

export class Player extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    // Получаем спрайтшит
    this.staying  = false;
    const sheet = Assets.get('player_json'); 
    this.isHit = false;
    
    // Создаем анимированный спрайт ВНУТРИ контейнера
    this.sprite = new AnimatedSprite(sheet.animations['idle']);
    
    // Настройки спрайта
    this.sprite.animationSpeed = 0.1;
    this.sprite.loop = true;
    this.sprite.anchor.set(0.5, 0.3);
    this.sprite.scale.set(0.592);
    // Добавляем спрайт в контейнер
    this.addChild(this.sprite);
    
    // Сохраняем анимации
    this.animations = {
      idle: sheet.animations['idle'],
      run: sheet.animations['run'],
      jump: sheet.animations['jump'],
      hit: sheet.animations['hit']
    };
    
    // Физика прыжка
    this.isJumping = false;
    this.jumpVelocity = 0;
    this.gravity = 0.5;
    this.jumpPower = -13.5;
    this.startY = 0;

    // ===== HITBOX (DEBUG) =====
    this.hitbox = new Graphics();

    this.hitbox.rect(
        -this.sprite.width * 0.2,
        -this.sprite.height * 0.2,
        this.sprite.width * 0.4,
        this.sprite.height * 0.7
      )
      .stroke({ width: 2, color: 0xff0000, alpha: 0 });
    this.addChild(this.hitbox);
    this.hitbox.zIndex = 999;

    // Стартовая анимация
    this.playRun();
    this.zIndex = 998;

    this._isFlashing = false;
  }

  // ===== ANIMATIONS =====
  playIdle() { 
    this.staying = true;
    this._play('idle', 0.1, true); 
  }
  
  playRun() { 
    this.staying = false;
    this._play('run', 0.14, true); 
    this.y = 420;
  }
  
  playJump() { 
    this.staying = false;
    this._play('jump', 0.3, false); 
  }
  
  playHit() { 
    this.staying = false;
    this._play('hit', 0.1, false); 
  }

  _play(name, speed, loop) {
    const frames = this.animations[name];
    if (!frames || frames.length === 0) return;
    
    // Если уже играет эта анимация
    if (this.sprite.textures === frames) return;
    
    this.sprite.textures = frames;
    this.sprite.animationSpeed = speed;
    this.sprite.loop = loop;
    this.sprite.gotoAndPlay(0);
  }

  // ===== JUMP =====
  jump() {
    if (this.isJumping) return;
    if (this._isFlashing) return;
    
    this.isJumping = true;
    this.jumpVelocity = this.jumpPower;
    this.startY = this.y;
    this.playJump();
  }

  flashRed() {
  if (this._isFlashing) return;

  this._isFlashing = true;

  const sprite = this.sprite;
  let count = 0;

  const flash = () => {
    sprite.tint = 0xff0000; // красный

    setTimeout(() => {
      sprite.tint = 0xffffff; // обратно
      count++;

      if (count < 3) {
        setTimeout(flash, 80); // скорость мигания
      } else {
        this._isFlashing = false;
        this.isHit = false;        
        if (!this.scene.uiLayer.heartsDisplay.gameOver) {
            this.playRun();
        }
        
      }
    }, 80);
  };

  flash();
}


  // ===== UPDATE =====
  update(delta) {
    // Обновляем физику прыжка
    if (this.isJumping) {
      this.jumpVelocity += this.gravity * delta;
      this.y += this.jumpVelocity * delta;
      
      // Проверка приземления
      if (this.y >= this.startY) {
        this.y = this.startY;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.playRun();
      }
    }
  }
}