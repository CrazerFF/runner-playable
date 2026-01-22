import { Container, Sprite, Assets } from 'pixi.js';

export class Tape extends Container {
  constructor(x, y) {
    super();

    // ===== КОЛЫШКИ =====
    this.stick1 = new Sprite(Assets.get('stick'));
    this.stick2 = new Sprite(Assets.get('stick'));

    this.stick1.anchor.set(0.5, 1);
    this.stick2.anchor.set(0.5, 1);

    // диагональное расположение
    this.stick1.x = 0;
    this.stick1.y = 140;

    this.stick2.x = 60;
    this.stick2.y = 190;
    this.stick2.zIndex = 1600;

    this.stick1.rotation = Math.PI / 2;
    this.stick2.rotation = Math.PI / 2;

    this.stick1.scale.set(0.6);
    this.stick2.scale.set(0.6);
    
    // ===== ЛЕНТА =====
    this.tape1 = new Sprite(Assets.get('tape1'));
    this.tape2 = new Sprite(Assets.get('tape2'));

    // точки разрыва
    this.tape1.anchor.set(0, 0.5);
    //this.tape1.rotation = Math.PI / 5.0;
    this.tape1.rotation = Math.PI / 2;
    this.tape2.anchor.set(1, 0.5);
   // this.tape2.rotation = Math.PI / 4;


    // центр между колышками
    this.tape1.x = 5;
    this.tape1.y = 110;
    this.tape1.scale.x = 1;
    this.tape1.scale.y= 0.6;
   

    this.tape2.x = 64;
    this.tape2.y = 158;
    this.tape2.scale.x = 1;
    this.tape2.scale.y= 0.6;

    this.tape1.rotation = Math.PI / 3.7;
    this.tape2.rotation = Math.PI / 5.9;

    this.addChild(
      this.stick1,
      this.stick2,
      this.tape1,
      this.tape2
    );

    this.x = x;
    this.y = y;

    // ===== СОСТОЯНИЕ =====
    this.torn = false;
    this.progress = 0;
  }

  // вызвать при финише
  tear() {
    if (this.torn) return;
    this.torn = true;
    this.progress = 0;
  }

  update(delta) {
    if (!this.torn) return;
    if (this.progress > 1.5) return;
    this.progress += delta * 0.03;

    const tearAngle = Math.PI / 6; // 30°

    // вращение кусков
    this.tape1.rotation += tearAngle * delta * 0.03;
    this.tape2.rotation -= tearAngle * delta * 0.06;

  }
}
