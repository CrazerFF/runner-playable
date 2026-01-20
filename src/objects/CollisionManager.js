import { Rectangle, Graphics } from 'pixi.js';

export class CollisionManager {
  static debugLayer = null;

  static enableDebug(stage) {
    if (!CollisionManager.debugLayer) {
      CollisionManager.debugLayer = new Graphics();
      stage.addChild(CollisionManager.debugLayer);
    }
  }

  static disableDebug() {
    if (CollisionManager.debugLayer) {
      CollisionManager.debugLayer.clear();
    }
  }

  static check(player, objects, onCollision) {
    if (!player) return;

    const scale = 0.5;

    // Игрок
    const playerBounds = player.getBounds
      ? player.getBounds()
      : { x: player.x, y: player.y, width: player.width, height: player.height };

    const playerRect = new Rectangle(
      playerBounds.x + playerBounds.width * (1 - scale) / 2,
      playerBounds.y + playerBounds.height * (1 - scale) / 2,
      playerBounds.width * scale,
      playerBounds.height * scale
    );

    // Дебаг-отрисовка игрока
    if (CollisionManager.debugLayer) {
      CollisionManager.debugLayer.clear();
      CollisionManager.debugLayer.lineStyle(2, 0xff0000, 0.5);
      CollisionManager.debugLayer.drawRect(
        playerRect.x,
        playerRect.y,
        playerRect.width,
        playerRect.height
      );
    }

    for (const obj of objects) {
      if (!obj) continue;

      // Если объект уже обработан — пропускаем
      if (obj._collisionHandled) continue;

      const objBounds = obj.getBounds
        ? obj.getBounds()
        : { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

      const objRect = new Rectangle(
        objBounds.x + objBounds.width * (1 - scale) / 2,
        objBounds.y + objBounds.height * (1 - scale) / 2,
        objBounds.width * scale,
        objBounds.height * scale
      );

      // Дебаг-отрисовка объекта
      if (CollisionManager.debugLayer) {
        CollisionManager.debugLayer.lineStyle(1, 0x00ff00, 0.5);
        CollisionManager.debugLayer.drawRect(
          objRect.x,
          objRect.y,
          objRect.width,
          objRect.height
        );
      }

      if (playerRect.intersects(objRect)) {
        obj._collisionHandled = true; // **ставим флаг**
        onCollision(obj);
      }
    }
  }

  // Можно вызвать, чтобы сбросить флаг (например, при ресете уровня)
  static resetCollision(obj) {
    if (obj) obj._collisionHandled = false;
  }
}
