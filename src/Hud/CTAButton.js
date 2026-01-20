import { Sprite, Assets } from 'pixi.js'; 

export class Player extends Sprite {
  constructor() {
    super(PIXI.Texture.from('/assets/sprites/cta.png'));
    this.anchor.set(0.5);
    this.interactive = true;
    this.buttonMode = true;

    // клик
    this.on('pointerdown', () => {
      if (window.mraid) {
        mraid.open('https://store.link');
      } else if (window.dapi) {
        dapi.openStoreUrl();
      } else {
        window.open('https://store.link', '_blank');
      }
    });

    // позиция в дизайн-координатах
    this.x = 720 * 0.5;
    this.y = 1280 * 0.8;
  }
}
