import { Application, Assets } from 'pixi.js';
import { manifest } from './objects/manifest.js';
import { Game } from './Scene/Game.js';
import { UiLayer } from './Hud/UiLayer.js';

(async () => {
  const DESIGN_W = 260;
  const DESIGN_H = 704;

  const app = new Application();

  // ===== 1. ИНИЦИАЛИЗАЦИЯ — ЧЁРНЫЙ ЭКРАН =====
  await app.init({
    backgroundColor: 0x000000, // ← ЧЁРНЫЙ ДО ПОЛНОЙ ЗАГРУЗКИ
    antialias: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true
  });

  globalThis.__PIXI_APP__ = app;

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#000';

  document.body.appendChild(app.canvas);

  app.canvas.addEventListener('contextmenu', e => e.preventDefault());
  app.canvas.style.touchAction = 'none';

  // ===== 2. ЗАГРУЗКА ШРИФТА =====
  let fontLoaded = false;

  try {
    const font = new FontFace('font', 'url(assets/fonts/font.ttf)');
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    fontLoaded = true;
  } catch (e) {
    console.warn('Шрифт не загрузился, используем системный');
  }

  await document.fonts.ready;

  // ===== 3. ЗАГРУЗКА РЕСУРСОВ =====
  try {
    await Assets.init({ manifest });
    await Assets.loadBundle('game');
  } catch (error) {
    console.error('Ошибка загрузки ресурсов:', error);

    // fallback: пробуем загрузить по одному
    const bundle = manifest.bundles.find(b => b.name === 'game');
    if (bundle) {
      for (const asset of bundle.assets) {
        try {
          await Assets.load(asset.name);
        } catch (e) {
          console.warn(`Не удалось загрузить ${asset.name}`);
        }
      }
    }
  }

  // ===== 4. ТОЛЬКО ТЕПЕРЬ СОЗДАЁМ СЦЕНУ =====
  const uiLayer = new UiLayer();
  const scene = new Game(DESIGN_W, DESIGN_H, uiLayer);

  // меняем фон на игровой
  app.renderer.background.color = 0xfce4d6;

  app.stage.addChild(scene);
  app.stage.addChild(uiLayer);

  // ===== 5. RESIZE =====
  let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    app.renderer.resolution = dpr;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    if (dpr !== lastDpr) {
      uiLayer.onDprChange?.(dpr);
      lastDpr = dpr;
    }

    const w = app.renderer.width;
    const h = app.renderer.height;

    const scale = Math.min(w / DESIGN_W, h / DESIGN_H);

    scene.scale.set(scale);
    scene.x = (w - DESIGN_W * scale) / 2;
    scene.y = (h - DESIGN_H * scale) / 2;

    scene.resize?.(DESIGN_W, DESIGN_H, w, h);
    uiLayer.resize?.(w, h);
    uiLayer.onResize?.(w, h);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);

  resize();

  // ===== 6. ЗАПУСК ИГРЫ =====
  app.ticker.add((ticker) => {
    scene.update(ticker.deltaTime);
    uiLayer.update?.(ticker.deltaTime);
  });

  console.log('Игра запущена. Шрифт:', fontLoaded);

})().catch((error) => {
  console.error('Фатальная ошибка при запуске:', error);
});
