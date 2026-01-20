import { Container, Text } from 'pixi.js';

export class TextPopup extends Container {
  constructor(text, x, y, fontSize) {
    super();

    this.life = 90;
    this.fontSize = fontSize;
    this.text = new Text(text, {
      fontFamily: 'font',
      fill: '#ffffff',
      fontSize: this.fontSize,
      fontWeight: '700',
      align: 'center',
      stroke: {
        color: 0x000000,
        width: 6
      }
    });

    this.text.anchor.set(0.5);
    this.text.roundPixels = true;
    this.addChild(this.text);

    this.x = x;
    this.y = y;
    //this.roundPixels = true;
  }

  update(delta) {
    this.life -= delta;
    this.y -= 1 * delta;
    this.alpha = this.life / 120;

    if (this.life <= 0) {
      this.destroy({ children: true });
    }
  }
}
