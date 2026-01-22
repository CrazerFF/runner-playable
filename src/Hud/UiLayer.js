import { Container, Graphics, Text } from 'pixi.js';
import { HeartsDisplay } from './HeartsDisplay.js';
import { BottomPanel } from './BottomPanel.js';
import { ScorePanel } from './ScorePanel.js';
import { CtaButton } from './CtaButton.js';
import { InstallButton } from './InstallButton.js';



export class UiLayer extends Container {
  constructor() {
    super();

    this.heartsDisplay = new HeartsDisplay();
    this.addChild(this.heartsDisplay);
  
    this.bottomPanel = new BottomPanel();
    this.addChild(this.bottomPanel);

    this.scorePanel = new ScorePanel();
    this.addChild(this.scorePanel);

    this.ctaButton = new CtaButton(this);
    this.addChild(this.ctaButton);

    this.installButton = new InstallButton();
    this.addChild(this.installButton);
    this.installButton.visible = false;
  }

  resize(w, h, scale) {
    this.bottomPanel.resize(w, h);
    this.ctaButton.resize(w, h);
    this.installButton.resize(w, h);
    this.scorePanel.resize(w, h, scale);
  }

  onDprChange(scaleDpr) {
    this.scorePanel.onDprChange(scaleDpr);
    this.heartsDisplay.onDprChange(scaleDpr);
    this.installButton.onDprChange(scaleDpr);
  };
}