import { Container, Text, TextStyle } from 'pixi.js';

export class TextPopup extends Container {
  constructor(text, x, y, fontSize) {
    super();

    this.life = 90;
    this.fontSize = fontSize;
    
    // Создаем стиль текста отдельно
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#ffffff',
      fontSize: this.fontSize * 4,
      fontWeight: '700',
      align: 'center',
      stroke: {
        color: 0x000000,
        width: 6*4
      }
    });

    // Используем новый синтаксис Text
    this.text = new Text({
      text: text,
      style: textStyle
    });

    this.text.anchor.set(0.5);
    this.text.roundPixels = true;
    this.addChild(this.text);

    this.x = x;
    this.y = y;
    this.text.scale.set(0.25);
    this.roundPixels = true;
  }

update(delta) {
    const speed = 1;      // пиксели на кадр
    const totalLife = 90; // кадров жизни
    this.life -= delta;
    this.y -= speed * delta;   // умножаем на 60, чтобы скорость была в пикселях/сек
    this.alpha = this.life / totalLife;

    if (this.life <= 0) {
        this.destroy({ children: true });
    }
}

}