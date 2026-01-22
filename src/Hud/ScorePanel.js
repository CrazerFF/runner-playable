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
    this.textMargin = 55;

    // финальный счет (по центру экрана)
    this.finalTextStyle = new TextStyle({
      fontFamily: 'font',
      fontSize: 64 * 4,
      fill: 0xffffff,
      stroke: { // Исправлено: новый синтаксис для stroke
        width: 6,
        color: 0x000000
      },
      align: 'center',
    });

    this.finalText = new Text({ text: '', style: this.finalTextStyle });
    this.finalText.anchor.set(0.5);
    this.finalText.visible = false;
    this.addChild(this.finalText);
    this.finalText.scale.set(0.25);

    // для начального отображения
    this.resize(appWidth, appHeight);
  }

  resize(appWidth, appHeight) {
    const margin = 20;

    // позиция панели
    this.panel.x = appWidth - margin;
    this.panel.y = margin;

    // текст справа от панели
    this.scoreText.x = this.panel.x - this.panel.width + this.textMargin;
    this.scoreText.y = this.panel.y + this.panel.height / 2 - this.scoreText.height / 2;

    // финальный текст по центру
    this.finalText.x = appWidth / 2;
    this.finalText.y = appHeight / 2;
  }

  onDprChange(scaleDpr) {
    this.panel.scale.set(this.baseScale / scaleDpr);
    this.scoreText.scale.set(0.25 / scaleDpr);
    this.textMargin = 60 / scaleDpr;
    
    // Обновляем stroke с новым синтаксисом
    this.finalText.style.stroke = {
      width: 6 / scaleDpr,
      color: 0x000000
    };
    
    this.finalText.scale.set(0.25 / scaleDpr);
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
    this.finalText.visible = false;
  }

  scoreFinal() {
    this.finalText.text = `$${this.score}`;
    this.finalText.visible = true;
  }
}