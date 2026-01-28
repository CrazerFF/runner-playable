import { Container, Graphics, Text, TextStyle } from "pixi.js";

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
      fontFamily: "font",
      fill: 0xffffff,
      fontWeight: "900",
      align: "center",
      wordWrap: true,
      breakWords: true,
      stroke: {
        width: 3,
        color: 0x000000,
      },
    });

    // Создаем текст новым способом
    this.label = new Text({
      text: "INSTALL AND EARN",
      style: textStyle,
    });
    this.label.anchor.set(0.5);
    this.addChild(this.label);

    // Делаем кнопку интерактивной
    this.eventMode = "static";
    this.cursor = "pointer";
    this.interactive = true;
    this.buttonMode = true;

    // Обработчик клика для открытия ссылки
    this.on("pointerdown", () => this.openStore());

    // Эффекты при наведении
    this.on("pointerover", () => {
      this.label.tint = 0xdddddd;
    });

    this.on("pointerout", () => {
      this.label.tint = 0xffffff;
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
    this.y = appHeight / 1.2;

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
    this.bg.roundRect(-w / 2, -h / 2 + shadowOffset, w, h, radius);
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
      radius * 0.8,
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
      radius * 0.8,
    );
    this.bg.stroke({
      width: 1,
      color: 0xffffff,
      alpha: 0.3,
    });
  }



  onDprChange(scaleDpr) {
    this.baseWidth = 420 / scaleDpr;
    this.baseHeight = 110 / scaleDpr;
  }
}
