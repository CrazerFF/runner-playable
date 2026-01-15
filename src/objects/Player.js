import { Container, AnimatedSprite, Assets } from 'pixi.js';

export class Player extends Container {
  constructor() {
    super();
    
    // Получаем спрайтшит
    const sheet = Assets.get('player_json'); 
    console.log('Player animations:', sheet.animations);
    
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
    this.gravity = 0.2;
    this.jumpPower = -10;
    this.startY = 0;
    
    // Стартовая анимация
    this.playRun();
  }

  // ===== ANIMATIONS =====
  playIdle() { 
    this._play('idle', 0.1, true); 
  }
  
  playRun() { 
    this._play('run', 0.1, true); 
    this.y = 420;
  }
  
  playJump() { 
    this._play('jump', 0.3, false); 
  }
  
  playHit() { 
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
    
    this.isJumping = true;
    this.jumpVelocity = this.jumpPower;
    this.startY = this.y;
    this.playJump();
    
    
  }

  // ===== UPDATE =====
  update(time) {
    // Обновляем физику прыжка
    if (this.isJumping) {
      this.jumpVelocity += this.gravity;
      this.y += this.jumpVelocity;
      
      // Проверка приземления
      if (this.y >= this.startY) {
        this.y = this.startY;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.playRun();
      }
    }
    
    // Если нужно обновлять что-то еще
    // Например, проверка коллизий и т.д.
  }

}