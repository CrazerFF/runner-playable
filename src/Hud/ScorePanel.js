import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class ScorePanel extends Container {
  constructor(appWidth = 800, appHeight = 600) {
    super();

    // фон панели
    this.panel = new Sprite(Assets.get('score'));
    this.panel.anchor.set(1, 0);
    this.addChild(this.panel);

    // фиксированный scale — панель не изменяется при ресайзе
    this.baseScale = 0.145;
    this.panel.scale.set(this.baseScale);

    // текущий счет
    this.score = 0;
    this.scoreBaseScale = 1;

    // стиль текста счета
    this.scoreTextStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 26 * 4,
      fill: 0x0099,
      align: 'right',
    });

    // текстовое отображение счета
    this.scoreText = new Text({ text: `$${this.score}`, style: this.scoreTextStyle });
    this.scoreText.scale.set(this.scoreBaseScale * 0.25);
    this.addChild(this.scoreText);

    // отступ текста относительно панели
    this.textMargin = 57;


    // для начального отображения
    this.resize(appWidth, appHeight);
  }

  resize(appWidth, appHeight) {
    const margin = 20;

    // позиция панели
    this.panel.x = appWidth - margin;
    this.panel.y = margin;

    // текст справа от панели
    this.scoreText.x = this.panel.x - this.panel.width + this.textMargin - 2;
    this.scoreText.y = this.panel.y + this.panel.height / 2 - this.scoreText.height / 2;
  }

  onDprChange(scaleDpr) {
    this.panel.scale.set(this.baseScale / scaleDpr);
    this.scoreText.scale.set(0.25 / scaleDpr);
    this.textMargin = 60 / scaleDpr;
  }

  addScore(amount) {
    this.score += amount;
    this.updateText();
  }

  updateText() {
    this.scoreText.text = `$${this.score}`;
  }

  reset() {
    this.score = 0;
    this.updateText();
  }

  scoreFinal() {
  //  this.finalText.text = `$${this.score}`;
  //  this.finalText.visible = true;
  }
}