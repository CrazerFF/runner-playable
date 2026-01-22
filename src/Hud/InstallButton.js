import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class InstallButton extends Container {
  constructor() {
    super();

    this.baseWidth = 420;
    this.baseHeight = 110;
    this.minWidth = 180;
    this.minHeight = 64;

    this.bg = new Graphics();
    this.addChild(this.bg);

    // Создаем стиль для текста
    const textStyle = new TextStyle({
      fontFamily: 'font',
      fill: 0xffffff,
      fontWeight: '900',
      align: 'center',
      wordWrap: true,
      breakWords: true,
      stroke: { 
        width: 3, 
        color: 0x000000 
      },
    });

    // Создаем текст новым способом
    this.label = new Text({
      text: 'INSTALL AND EARN',
      style: textStyle,
    });
    this.label.anchor.set(0.5);
    this.addChild(this.label);

    // Делаем кнопку интерактивной
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.interactive = true;
    this.buttonMode = true;
    
    // Обработчик клика для открытия ссылки
    this.on('pointerdown', () => this.openStore());
    
    // Эффекты при наведении
    this.on('pointerover', () => {
      this.label.tint = 0xDDDDDD;
    });
    
    this.on('pointerout', () => {
      this.label.tint = 0xFFFFFF;
    });
    
    // Для плавной пульсации
    this.pulseTime = 0;
    this.pulseSpeed = 0.1;
    this.pulseScale = 0.05;
    this.baseScale = 1;
  }

  resize(appWidth, appHeight) {
    const maxWidth = appWidth * 0.85;

    let width = Math.min(this.baseWidth, maxWidth);
    let height = width * 0.26;

    // ⛔ стоп-ресайз
    width = Math.max(width, this.minWidth);
    height = Math.max(height, this.minHeight);

    this.draw(width, height);

    this.x = appWidth / 2;
    this.y = appHeight / 1.3;

    // ⚠️ текст считается ОТ КЛАМПА
    const fontSize = height * 0.42;

    this.label.style.fontSize = fontSize;
    this.label.style.wordWrapWidth = width * 0.8;

    this.label.style.stroke = {
      width: Math.max(2, fontSize * 0.12),
      color: 0x000000,
    };

    this.label.position.set(0, 0);
  }

  draw(w, h) {
    this.bg.clear();
    
    const radius = h * 0.2;
    const shadowOffset = h * 0.08;
    const borderWidth = Math.max(2, h * 0.04);
    const highlightHeight = h * 0.4;

    // ===== ТЕНЬ =====
    this.bg.roundRect(
      -w / 2,
      -h / 2 + shadowOffset,
      w,
      h,
      radius
    );
    this.bg.fill({ color: 0x000000, alpha: 0.25 });

    // ===== ОСНОВНАЯ ФОРМА =====
    this.bg.roundRect(-w / 2, -h / 2, w, h, radius);
    this.bg.fill({ color: 0xff3b3b });

    // ===== ВЕРХНИЙ БЛИК =====
    this.bg.roundRect(
      -w / 2 + borderWidth,
      -h / 2 + borderWidth,
      w - borderWidth * 2,
      highlightHeight,
      radius * 0.8
    );
    this.bg.fill({ color: 0xffffff, alpha: 0.15 });

    // ===== ОБВОДКА =====
    this.bg.roundRect(-w / 2, -h / 2, w, h, radius);
    this.bg.stroke({
      width: borderWidth,
      color: 0x8b1a1a,
      alignment: 0,
    });

    // ===== ВНУТРЕННЯЯ ОБВОДКА (для объема) =====
    this.bg.roundRect(
      -w / 2 + borderWidth,
      -h / 2 + borderWidth,
      w - borderWidth * 2,
      h - borderWidth * 2,
      radius * 0.8
    );
    this.bg.stroke({
      width: 1,
      color: 0xffffff,
      alpha: 0.3,
    });
  }

  // Метод для открытия магазина
  openStore() {
    const storeUrl = 'https://play.google.com/store/apps/details?id=com.justplay.app&hl=en&gl=US';
    
    console.log('Install button clicked, opening store:', storeUrl);
    
    // Проверяем окружение (MRAID/DAPI для рекламных сетей)
    if (window.mraid && mraid.open) {
      // Для рекламных сетей с MRAID
      mraid.open(storeUrl);
    } else if (window.dapi && dapi.openStoreUrl) {
      // Для рекламных сетей с DAPI
      dapi.openStoreUrl(null, { url: storeUrl });
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openAppStore) {
      // Для iOS WebView
      window.webkit.messageHandlers.openAppStore.postMessage(storeUrl);
    } else {
      // Для обычного браузера
      window.open(storeUrl, '_blank');
    }
    
    // Эффект нажатия
    this.scale.set(this.baseScale * (1 - 0.1) * 0.7);
    setTimeout(() => {
      this.scale.set(this.baseScale * 0.7);
    }, 100);
  }

  // Метод для плавной пульсации
  update(delta) {
    this.pulseTime += delta * this.pulseSpeed;
    const pulseFactor = Math.sin(this.pulseTime) * this.pulseScale;
    this.scale.set(this.baseScale * (1 + pulseFactor) * 0.7);
  }

  onDprChange(scaleDpr) {
    this.baseWidth = 420 / scaleDpr;
    this.baseHeight = 110 / scaleDpr;
  }
}