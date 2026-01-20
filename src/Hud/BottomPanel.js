import { Container, Sprite, Assets } from 'pixi.js';

export class BottomPanel extends Container {
  constructor() {
    super();

    // фон панели
    this.panel = new Sprite(Assets.get('playoff'));
    this.addChild(this.panel);

    // базовые скейлы
    this.baseScale = 1.9;
    this.baseScaleVert = 3.5;

    this.panel.scale.set(this.baseScale);

    // эталонная ширина
    this.basePanelWidth = this.panel.width;
  }

  resize(appWidth, appHeight) {
    const scaleByWidth = appWidth / this.basePanelWidth;

    if (appWidth > appHeight) {
      this.panel.scale.set(this.baseScale * scaleByWidth);
    } else {
      this.panel.scale.set(this.baseScaleVert * scaleByWidth);
    }

    // позиция — снизу
    this.panel.x = 0;
    this.panel.y = appHeight - this.panel.height;
  }
}
