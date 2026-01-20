import { Container, Graphics, Text } from 'pixi.js';
import { HeartsDisplay } from './HeartsDisplay.js';
import { BottomPanel } from './BottomPanel.js';
import { ScorePanel } from './ScorePanel.js';



export class UiLayer extends Container {
  constructor() {
    super();

    this.heartsDisplay = new HeartsDisplay();
    this.addChild(this.heartsDisplay);
  
    this.bottomPanel = new BottomPanel();
    this.addChild(this.bottomPanel);

    this.scorePanel = new ScorePanel();
     this.addChild(this.scorePanel);
  }
  resize(w, h, scale) {
    this.bottomPanel.resize(w, h);
    this.scorePanel.resize(w, h, scale);

  }
}