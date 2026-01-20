import { Application, Assets } from 'pixi.js'; 
import { manifest } from './objects/manifest.js';
import { Game } from './Scene/Game.js';
import { UiLayer } from './Hud/UiLayer.js';

(async () => {
  const DESIGN_W = 260;
  const DESIGN_H = 704;

  const app = new Application();

  await app.init({
   // resizeTo: window,
    backgroundColor: 0xfce4d6,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true
  });

 // app.stage.roundPixels = true;

  globalThis.__PIXI_APP__ = app;

  document.body.appendChild(app.canvas);

  setInterval(() => {
  console.log('🖼 CANVAS CHECK');
  console.log('CSS size:', app.canvas.clientWidth, app.canvas.clientHeight);
  console.log('REAL size:', app.renderer.width, app.renderer.height);
  console.log('DPR:', window.devicePixelRatio);
}, 2000);


  app.canvas.addEventListener('contextmenu', e => e.preventDefault());
  app.canvas.style.touchAction = 'none';

  await Assets.init({ manifest });
  await Assets.loadBundle('game');
  
  const uiLayer = new UiLayer();
  const scene = new Game(DESIGN_W, DESIGN_H, uiLayer);
  app.stage.addChild(scene);
  app.stage.addChild(uiLayer);



  

// function resize() {
//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   app.renderer.resolution = dpr;
//   app.renderer.resize(window.innerWidth, window.innerHeight);

//   const w = app.renderer.width;
//   const h = app.renderer.height;

//   const scale = Math.min(w / DESIGN_W, h / DESIGN_H);

//   scene.scale.set(scale);
//   scene.x = (w - DESIGN_W * scale) / 2;
//   scene.y = (h - DESIGN_H * scale) / 2;

//   scene.resize(DESIGN_W, DESIGN_H, w, h);
//   uiLayer.resize(w, h);
// }

  // Слушаем изменение окна
  
  let resizeCount = 0;

function resize() {
  resizeCount++;

  const dpr = window.devicePixelRatio || 1;

  console.group(`🔁 RESIZE #${resizeCount}`);
  console.log('devicePixelRatio:', dpr);

  // ВАЖНО: логируем ДО resize
  console.log(
    'BEFORE renderer.resize:',
    'canvas size:',
    app.renderer.width,
    app.renderer.height,
    'css size:',
    app.canvas.style.width,
    app.canvas.style.height
  );

  // если у вас сейчас DPR в resize — оставьте, иначе закомментируйте
  app.renderer.resolution = dpr;

  app.renderer.resize(window.innerWidth, window.innerHeight);

  // ПОСЛЕ resize
  console.log(
    'AFTER renderer.resize:',
    'renderer.width:',
    app.renderer.width,
    'renderer.height:',
    app.renderer.height
  );

  const w = app.screen.width;
  const h = app.screen.height;

  const scale = Math.min(w / DESIGN_W, h / DESIGN_H);

  console.log('scene scale:', scale);

  scene.scale.set(scale);
  scene.x = (w - DESIGN_W * scale) / 2;
  scene.y = (h - DESIGN_H * scale) / 2;

  console.log('scene.position:', scene.x, scene.y);

  scene.resize(DESIGN_W, DESIGN_H, w, h);
  uiLayer.resize(w, h);

  console.groupEnd();
}


  window.addEventListener('resize', resize);
  resize(); // первый вызов

  app.ticker.add((time) => {
    scene.update(time);
  });
})();