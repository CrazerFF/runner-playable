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
      wordWrap: true,
      breakWords: true,
      stroke: {
        color: 0x000000,
        width: 6 * 4,
      },
    });

    this.text = new Text({
      text: text,
      style: textStyle,
    });

    this.text.anchor.set(0.5);
    this.text.roundPixels = true;
    this.addChild(this.text);

    this.x = x;
    this.y = y;
    this.text.scale.set(0.25);
    this.roundPixels = true;
    this.appWidth = window.innerWidth;
    this.resize(this.appWidth);
  }

  update(delta) {
    const speed = 1.5;
    const totalLife = 90;
    this.life -= delta;
    this.y -= speed * delta;
    this.alpha = this.life / totalLife;

    if (this.life <= 0) {
    //  this.destroy({ children: true });
    }
  }
  resize(appWidth) {
    // Максимальная ширина попапа относительно экрана
    const maxTextWidth = appWidth * 0.6 * 5.6;
    // Ограничиваем, чтобы не было слишком узко
    const wrapWidth = Math.max(780, maxTextWidth);
    this.text.style.wordWrapWidth = wrapWidth;
    // Центрирование не трогаем
    this.text.anchor.set(0.5);
  }
}
