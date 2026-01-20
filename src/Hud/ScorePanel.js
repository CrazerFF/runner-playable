import { Container, Sprite, Text, TextStyle, Assets } from 'pixi.js';

export class ScorePanel extends Container {
  constructor() {
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

    // текстовое отображение
    this.scoreText = new Text('0', new TextStyle({
      fontFamily: 'font', // шрифт, который загрузили через FontFace
      fontSize: 28,
      fill: 0x0099,
    //  stroke: 0x000000,
    //  strokeThickness: 4,
      align: 'right',
    }));
    this.addChild(this.scoreText);

    // отступ текста относительно панели
    this.textMargin = 60;
  }

  resize(appWidth, appHeight) {
    // позиция панели с margin
    const margin = 20;
    this.panel.x = appWidth - margin;
    this.panel.y = margin;

    // текст справа от панели
    this.scoreText.x = this.panel.x - this.panel.width + this.textMargin;
    this.scoreText.y = this.panel.y + this.panel.height / 2 - this.scoreText.height / 2;
  }

  // метод добавления очков
  addScore(amount) {
    this.score += amount;
    this.updateText();
  }

  // обновление текста
  updateText() {
    this.scoreText.text = `$${this.score}`;
  }

  // сброс счета
  reset() {
    this.score = 0;
    this.updateText();
  }
}
