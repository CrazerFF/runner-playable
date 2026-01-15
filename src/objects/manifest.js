// src/objects/manifest.js
export const manifest = {
  bundles: [
    {
      name: 'game', // имя бандла для загрузки
      assets: [     // ОБЯЗАТЕЛЬНО массив объектов
        {
          alias: 'bg', // ключ для Assets.get('background')
          src: 'assets/sprites/bg.png' // путь от корня (public/)
        },
        {
          alias: 'player_json',
          src: 'assets/sprites/player.json'
        },
        {
          alias: 'player_texture',
          src: 'assets/sprites/player.png'
        },
        {
          alias: 'playoff',
          src: 'assets/sprites/playoff.webp'
        }
        // Добавьте другие ассеты здесь
      ]
    }
  ]
};