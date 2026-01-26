import {
  Container,
  Sprite,
  Assets,
  Mesh,
  RopeGeometry,
  Point,
} from 'pixi.js';

export class Tape extends Container {
  constructor(x, y) {
    super();

    // ===== КОЛЫШКИ =====
    this.stick1 = new Sprite(Assets.get('stick'));
    this.stick2 = new Sprite(Assets.get('stick'));

    this.stick1.anchor.set(0.5, 1);
    this.stick2.anchor.set(0.5, 1);

    this.stick1.x = 0;
    this.stick1.y = 140;

    this.stick2.x = 60;
    this.stick2.y = 190;

    this.stick1.rotation = Math.PI / 2;
    this.stick2.rotation = Math.PI / 2;

    this.stick1.scale.set(0.6);
    this.stick2.scale.set(0.6);

    // ===== ПРЯМАЯ ЛЕНТА (ДО ФИНИША) =====
    this.tape1 = new Sprite(Assets.get('tape1'));
    this.tape2 = new Sprite(Assets.get('tape2'));

    this.tape1.anchor.set(0, 0.5);
    this.tape2.anchor.set(1, 0.5);

    this.tape1.x = 5;
    this.tape1.y = 110;

    this.tape2.x = 64;
    this.tape2.y = 158;

    this.tape1.scale.set(1, 0.6);
    this.tape2.scale.set(1, 0.6);

    this.tape1.rotation = Math.PI / 3.7;
    this.tape2.rotation = Math.PI / 5.9;

    this.addChild(this.stick1, this.stick2, this.tape1, this.tape2);

    this.x = x;
    this.y = y;

    // ===== СОСТОЯНИЕ =====
    this.torn = false;

    this.leftPoints = [];
    this.leftVel = [];
    this.leftMesh = null;
    this.leftGeometry = null;

    this.rightPoints = [];
    this.rightVel = [];
    this.rightMesh = null;
    this.rightGeometry = null;
  }

  // ===== РАЗРЫВ =====
  tear() {
    if (this.torn) return;
    this.torn = true;

    // Убираем прямые тейпы
    this.removeChild(this.tape1, this.tape2);

    const segments = 8;
    const midX = (this.stick1.x + this.stick2.x) / 2;
    const midY = (this.stick1.y + this.stick2.y) / 2 - 30;

    // ===== ЛЕВАЯ ЛЕНТА =====
    this.leftPoints = [];
    this.leftVel = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      this.leftPoints.push(
        new Point(
          this.stick1.x + (midX - this.stick1.x) * t,
          this.stick1.y - 30 + (midY - (this.stick1.y - 30)) * t
        )
      );
      this.leftVel.push({ x: 0, y: 0 });
    }

    this.leftGeometry = new RopeGeometry({
      points: this.leftPoints,
      textureScale: 0.4,
    });

    this.leftMesh = new Mesh({
      geometry: this.leftGeometry,
      texture: Assets.get('tape1'),
    });
    this.leftMesh.scale.x = 0.2;

    // ===== ПРАВАЯ ЛЕНТА =====
    this.rightPoints = [];
    this.rightVel = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      this.rightPoints.push(
        new Point(
          this.stick2.x + (midX - this.stick2.x) * t,
          this.stick2.y - 30 + (midY - (this.stick2.y - 30)) * t
        )
      );
      this.rightVel.push({ x: 0, y: 0 });
    }

    this.rightGeometry = new RopeGeometry({
      points: this.rightPoints,
      textureScale: 0.4,
    });

    this.rightMesh = new Mesh({
      geometry: this.rightGeometry,
      texture: Assets.get('tape2'),
    });
     this.rightMesh.scale.x = 0.2;
     this.rightMesh.x += 40;


    this.addChild(this.leftMesh, this.rightMesh);
  }

  // ===== ОБНОВЛЕНИЕ =====
  updateRope(points, velocities, fixedX, fixedY, delta) {
    const gravity = 0.30 * delta;
    const friction = 0.98;

    for (let i = 1; i < points.length; i++) {
      velocities[i].y += gravity;
      velocities[i].x *= friction;
      velocities[i].y *= friction;

      points[i].x += velocities[i].x;
      points[i].y += velocities[i].y;
    }

    points[0].x = fixedX;
    points[0].y = fixedY;
  }

  update(delta) {
    if (!this.torn) return;

    this.updateRope(
      this.leftPoints,
      this.leftVel,
      this.stick1.x,
      this.stick1.y - 30,
      delta
    );

    this.updateRope(
      this.rightPoints,
      this.rightVel,
      this.stick2.x,
      this.stick2.y - 30,
      delta
    );

    if (this.leftGeometry) this.leftGeometry.update();
    if (this.rightGeometry) this.rightGeometry.update();
  }
}
