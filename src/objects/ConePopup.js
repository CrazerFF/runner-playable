import { Container, Text, TextStyle, Graphics } from 'pixi.js';

export class ConePopup extends Container {
  constructor(x, y) {
    super();

    // ===== ФОН (ПРЯМОУГОЛЬНИК) =====
    this.bg = new Graphics();
    this.addChild(this.bg);

    // ===== СТИЛЬ ТЕКСТА =====
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fill: '#ff0000',
      fontSize: 20 * 4,
      fontWeight: '700',
      align: 'center',
      wordWrap: true,
      breakWords: true,
      stroke: {
        color: 0x000000,
        width: 3 * 4,
      },
    });

    this.text = new Text({
      text: 'EVADE',
      style: textStyle,
    });

    this.text.anchor.set(0.5);
    this.text.roundPixels = true;
    this.addChild(this.text);

    this.x = x+40;
    this.y = y+20;

    // DPR-хак
    this.text.scale.set(0.25);
    this.bg.scale.set(0.25);

    this.roundPixels = true;

    this.appWidth = window.innerWidth;
    this.resize(this.appWidth);
  }

  resize(appWidth) {
    // ===== ПЕРЕНОС ТЕКСТА =====
    const maxTextWidth = appWidth * 0.6 * 5.6;
    const wrapWidth = Math.max(780, maxTextWidth);
    this.text.style.wordWrapWidth = wrapWidth;

    // ===== ПЕРЕРИСОВКА ФОНА =====
    this.drawBg();
  }

  drawBg() {
    const paddingX = 35;
    const paddingY = 15;
    const radius = 10;

    const textBounds = this.text.getLocalBounds();

    const w = textBounds.width + paddingX * 2;
    const h = textBounds.height + paddingY * 2;

    this.bg.clear();

    // заливка
    this.bg.roundRect(
      -w / 2,
      -h / 2,
      w,
      h,
      radius,
    );
    this.bg.fill({ color: 0xffab03 });

    // обводка
    this.bg.stroke({
      color: 0xff9800,
      width: 3 * 4,
      alignment: 0,
    });
  }
}
