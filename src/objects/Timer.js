import { Container, Text, TextStyle } from "pixi.js";

export class Timer extends Container {
  constructor(x, y, totalTime = 60) {
    super();

    this.x = x;
    this.y = y;
    this.totalTime = totalTime;
    this.currentTime = totalTime;
    this.isRunning = true;

    // Тот же стиль, что и у TextPopup
    const textStyle = new TextStyle({
      fontFamily: "font",
      fill: "#ffffff",
      fontSize: 45 * 4, // Аналогичный масштаб
      fontWeight: "700",
      align: "center",
      stroke: {
        color: 0x000000,
        width: 6 * 4,
      },
    });

    this.timerText = new Text({
      text: this.formatTime(this.currentTime),
      style: textStyle,
    });

    this.timerText.anchor.set(0.5);
    this.timerText.roundPixels = true;
    this.timerText.scale.set(0.25);
    this.addChild(this.timerText);

    this.roundPixels = true;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  update(delta) {
    if (!this.isRunning) return;

    // Уменьшаем время (delta примерно 1 при 60 FPS)
    this.currentTime -= delta / 60;

    if (this.currentTime <= 0) {
      this.currentTime = 0;
      this.isRunning = false;
      this.onTimeEnd();
    }

    this.timerText.text = this.formatTime(this.currentTime);
  }

  onTimeEnd() {
    // Плавное исчезновение
    this.alpha = 1;
    const fadeOut = () => {
      this.alpha -= 0.02;
      if (this.alpha > 0) {
        requestAnimationFrame(fadeOut);
      } else {
        this.destroy({ children: true });
      }
    };
    fadeOut();
  }
}
