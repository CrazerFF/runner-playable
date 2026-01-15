import { Application, Assets } from 'pixi.js'; 
import { manifest } from './objects/manifest.js';
import { Game } from './Scene/Game.js';
import { UiLayer } from './Ui/UiLayer.js';

(async () => {
  const DESIGN_W = 260;
  const DESIGN_H = 704;

  const app = new Application();

  await app.init({
  //  resizeTo: window,
    backgroundColor: 0xfce4d6,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true
  });

 // app.stage.roundPixels = true;

  globalThis.__PIXI_APP__ = app;

  document.body.appendChild(app.canvas);


  app.canvas.addEventListener('contextmenu', e => e.preventDefault());
  app.canvas.style.touchAction = 'none';

  await Assets.init({ manifest });
  await Assets.loadBundle('game');
  
  const scene = new Game(DESIGN_W, DESIGN_H);
  app.stage.addChild(scene);

  const uiLayer = new UiLayer();
  app.stage.addChild(uiLayer);

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  app.renderer.resolution = dpr;
  app.renderer.resize(window.innerWidth, window.innerHeight);

  const w = app.renderer.width;
  const h = app.renderer.height;

  const scale = Math.min(w / DESIGN_W, h / DESIGN_H);

  scene.scale.set(scale);
  scene.x = (w - DESIGN_W * scale) / 2;
  scene.y = (h - DESIGN_H * scale) / 2;

  scene.resize(DESIGN_W, DESIGN_H, w, h);
  uiLayer.resize(w, h);
}

  // Слушаем изменение окна
  window.addEventListener('resize', resize);
  resize(); // первый вызов

  app.ticker.add((time) => {
    scene.update(time);
  });
})();