import { Container, Sprite, Assets } from 'pixi.js';

export class CtaButton extends Container {
  constructor(scene, appWidth = 1280, appHeight = 720) { // по умолчанию можно указать размеры
    super();
    this.scene = scene;

    // Загружаем текстуру кнопки
    this.panel = new Sprite(Assets.get('download'));
    this.addChild(this.panel);

    // Базовые скейлы
    this.baseScale = 1.9;
    this.baseScaleVert = 3.5;

    // Начальный масштаб
    this.panel.scale.set(this.baseScale);

    // Эталонные размеры
    this.basePanelWidth = this.panel.width;
    this.basePanelHeight = this.panel.height;

    // Параметры пульсации
    this.pulseSpeed = 0.1;
    this.pulseScale = 0.06;
    this.pulseTime = 0;
    this.currentBaseScale = this.baseScale;

    // Интерактивность
    this.panel.interactive = true;
    this.panel.buttonMode = true;
    this.panel.cursor = 'pointer';
    this.panel.anchor.set(0.5);

    this.panel.on('pointerdown', () => this.openStore());
    this.panel.on('pointerover', () => (this.panel.tint = 0xcccccc));
    this.panel.on('pointerout', () => (this.panel.tint = 0xffffff));

    // Сразу делаем стартовый ресайз, чтобы кнопка была видна
    this.resize(appWidth, appHeight);
  }

  resize(appWidth, appHeight) {
    const scaleByWidth = appWidth / this.basePanelWidth;

    if (appWidth > appHeight) {
      this.currentBaseScale = this.baseScale * scaleByWidth * 0.15;
    } else {
      this.currentBaseScale = this.baseScaleVert * scaleByWidth * 0.15;
    }

    this.panel.scale.set(this.currentBaseScale);

    // Позиция — правый нижний угол
    const paddingRight = 300 * scaleByWidth;
    const paddingBottom = -30 * scaleByWidth;

    this.panel.x = appWidth - paddingRight;
    this.panel.y = appHeight - this.panel.height - paddingBottom;
  }

  update(delta) {
    this.pulseTime += delta * this.pulseSpeed;
    const pulseFactor = Math.sin(this.pulseTime) * this.pulseScale;
    const currentScale = this.currentBaseScale * (1 + pulseFactor);
    this.panel.scale.set(currentScale);
    if ( this.scene.installButton.visible) {
      this.panel.visible = false;
    }
  }

  openStore() {
    const storeUrl = 'https://play.google.com/store/apps/details?id=com.justplay.app&hl=en&gl=US';

    if (window.mraid?.open) {
      mraid.open(storeUrl);
    } 
    else if (window.dapi?.openStoreUrl) {
      dapi.openStoreUrl(null, { url: storeUrl });
    } 
    else if (window.webkit?.messageHandlers?.openAppStore) {
      window.webkit.messageHandlers.openAppStore.postMessage(storeUrl);
    } 
    else {
      window.open(storeUrl, '_blank');
    }
  }

  setPulseSpeed(speed) {
    this.pulseSpeed = speed;
  }

  setPulseScale(scale) {
    this.pulseScale = scale;
  }
}
