import { Container, Text, Graphics } from 'pixi.js';

export class HeartsDisplay extends Container {
  constructor() {
    super();    
    this.maxHearts = 3;
    this.currentHearts = this.maxHearts;
    this.hearts = [];
    this.heartSpacing = 15; // Увеличим расстояние
    this.baseScale = 1;
    this.gameOver = false;
    
    // Позиционирование
    this.x = 0;
    this.y = 0;
    this.zIndex = 999;
    this.createHearts();
    this.onDprChange(1);
  }
  
  createHearts() {
    this.hearts = [];
    
    try {
      // Создаем три сердечка-эмодзи
      for (let i = 0; i < this.maxHearts; i++) {
        const heart = new Text({
        text: '❤️',
        style: {
          fontFamily: 'font',
          fontSize: 30*4,   // ← увеличивай ТУТ
          align: 'center'
        }
      });
        heart.anchor.set(0);
        heart.scale.set(0.25);
        
        heart.x = i * (120 * 0.25 + this.heartSpacing); // Фиксированная ширина 60
        heart.y = 20; // Фиксированная высота
        
        // Начальная альфа - все сердечки полные
        heart.alpha = 1;
        
      //  console.log(`Heart ${i + 1} position:`, heart.x, heart.y);
        
        this.addChild(heart);
        this.hearts.push(heart);
      }
    } catch (error) { // ← ДОБАВЬТЕ ЭТУ СТРОКУ
   //   console.error('Error creating hearts:', error);
    } 
  }
 

  onDprChange(scaleDpr) {
    this.scale.set(this.baseScale / scaleDpr);
    this.x = 20/ scaleDpr;
    this.y = 20/ scaleDpr;

  };
  // Метод причинения урона
  takeDamage() {
    if (this.currentHearts === 1 ) {
      this.gameOver = true;
        return false;
    }
    
    // Находим первое неповрежденное сердечко справа налево
    for (let i = this.maxHearts - 1; i >= 0; i--) {
      const heart = this.hearts[i];
      if (heart.alpha === 1) {
        heart.alpha = 0.3; 
        this.currentHearts--;
        return true;
      }
    }
  
  }
}