import {
  TilingSprite,
  Assets,
  RenderTexture,
  Sprite,
  Container,
  Texture
} from 'pixi.js';

export class ScrollingBackground extends TilingSprite {
  constructor(textureAlias, viewWidth, viewHeight, speed = 2) {
    const sourceTexture = Assets.get(textureAlias);

    if (!sourceTexture) {
      console.error('Texture not found:', textureAlias);
      super({
        texture: Texture.EMPTY,
        width: viewWidth,
        height: viewHeight
      });
      return;
    }

    const texW = sourceTexture.width;
    const texH = sourceTexture.height;

    const renderTexture = RenderTexture.create({
      width: texW * 2,
      height: texH
    });

    const container = new Container();

    const normal = new Sprite(sourceTexture);
    normal.x = 0;

    const mirror = new Sprite(sourceTexture);
    mirror.scale.x = -1;
    mirror.x = texW * 2;

    container.addChild(normal, mirror);

    const app = globalThis.__PIXI_APP__;
    
    // 🔄 ИСПРАВЛЕННАЯ СТРОКА: новый синтаксис рендера
    app.renderer.render({
      container: container,
      target: renderTexture,
      clear: true
    });

    container.removeChildren();
    container.destroy();

    super({
      texture: renderTexture,
      width: viewWidth,
      height: viewHeight
    });

    this.speed = speed;
    this.tilePosition.set(0, 0);
  }

  update(delta) {
    this.tilePosition.x -= this.speed * delta;
  }
}