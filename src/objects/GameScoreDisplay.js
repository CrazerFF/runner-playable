import { Container, Text, TextStyle } from 'pixi.js';

export class GameScoreDisplay extends Container {
  constructor(scorePanel) {
    super();

    this.scorePanel = scorePanel;

    // стиль текста с корректным stroke (новый синтаксис)
    const style = new TextStyle({
      fontFamily: 'font',
      fontSize: 64 * 4,
      fill: 0xffffff,
      stroke: { // Исправлено: новый синтаксис для stroke
        width: 6 * 4,
        color: 0x000000
      },
      align: 'center',
      fontWeight: '700',
    });

    // создаем текст через НОВЫЙ синтаксис
    this.scoreText = new Text({ 
      text: `$${this.scorePanel.score}`, 
      style: style 
    });
    this.scoreText.anchor.set(0.5);
    this.scoreText.scale.set(0.25);
    this.addChild(this.scoreText);
  }

  // обновление текста
  update() {
    this.scoreText.text = `$${this.scorePanel.score}`;
  }

  // центрируем по канвасу
  resize(appWidth, appHeight) {
    this.scoreText.x = appWidth / 2 ;
    this.scoreText.y = appHeight / 2;
  }
}