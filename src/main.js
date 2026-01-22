import { Application, Assets } from 'pixi.js'; 
import { manifest } from './objects/manifest.js';
import { Game } from './Scene/Game.js';
import { UiLayer } from './Hud/UiLayer.js';

(async () => {
  const DESIGN_W = 260;
  const DESIGN_H = 704;

  const app = new Application();

  await app.init({
    backgroundColor: 0xfce4d6,
    antialias: false,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true
  });

  globalThis.__PIXI_APP__ = app;

  document.body.appendChild(app.canvas);

  app.canvas.addEventListener('contextmenu', e => e.preventDefault());
  app.canvas.style.touchAction = 'none';

  // 1. Пробуем загрузить шрифт с обработкой ошибок
  let fontLoaded = false;
  try {
    const font = new FontFace('font', 'url(assets/fonts/font.ttf)');
    const loadedFont = await font.load();
    document.fonts.add(loadedFont);
    fontLoaded = true;
  } catch (error) {
    console.warn('Не удалось загрузить шрифт font.ttf:', error);
    console.log('Будет использован системный шрифт');
  }

  // 2. Ждем готовности шрифтов (даже если наш не загрузился)
  await document.fonts.ready;
  
  // 3. Загрузка ресурсов с обработкой ошибок
  try {
    await Assets.init({ manifest });
    await Assets.loadBundle('game');
  } catch (error) {
    console.error('Ошибка загрузки ресурсов игры:', error);
    
    // Если не удалось загрузить, пробуем загрузить критически важные ресурсы по отдельности
    const criticalAssets = manifest.bundles.find(b => b.name === 'game');
    if (criticalAssets) {
      for (const asset of criticalAssets.assets) {
        try {
          await Assets.load(asset.name);
        } catch (e) {
          console.warn(`Не удалось загрузить ${asset.name}:`, e);
        }
      }
    }
  }

  // 4. Создаем UI с fallback шрифтом
  const uiLayer = new UiLayer();
  
  // 5. Создаем сцену игры
  const scene = new Game(DESIGN_W, DESIGN_H, uiLayer);
  
  // 6. Добавляем на сцену
  app.stage.addChild(scene);
  app.stage.addChild(uiLayer);

  let lastDpr = 2;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    app.renderer.resolution = dpr;

    app.renderer.resize(window.innerWidth, window.innerHeight);

    if (dpr !== lastDpr) {
      const scaleDpr = 2 / dpr;
      uiLayer.onDprChange(dpr);

    }

    const w = app.renderer.width;
    const h = app.renderer.height;

    const scale = Math.min(w / DESIGN_W, h / DESIGN_H);

    scene.scale.set(scale);
    scene.x = (w - DESIGN_W * scale) / 2;
    scene.y = (h - DESIGN_H * scale) / 2;

    scene.resize(DESIGN_W, DESIGN_H, w, h);
    uiLayer.resize(w, h);
    
    // Обновляем UI о ресайзе (если нужно)
    if (uiLayer.onResize) {
      uiLayer.onResize(w, h);
    }
  }

  // 8. Настройка обработчиков событий
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  
  resize(); 

  let lastTime = 0;

  app.ticker.add((ticker) => {
    scene.update(ticker.deltaTime);
    
    // Обновляем UI слой если есть метод update
    if (uiLayer.update) {
      uiLayer.update(ticker.deltaTime);
    }
  });

  // 11. Обработка ошибок (опционально)
  window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
    
    // Можно показать сообщение пользователю
    if (event.error.message.includes('font')) {
      console.log('Игнорируем ошибку шрифта, игра продолжит работу');
    }
  });

  // 12. Для отладки
  console.log('Игра запущена. Шрифт загружен:', fontLoaded);

})().catch((error) => {
  console.error('Фатальная ошибка при запуске игры:', error);
  
  document.body.appendChild(errorDiv);
});