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
          alias: 'enemy_json',
          src: 'assets/sprites/enemy.json'
        },
        {
          alias: 'money',
          src: 'assets/sprites/money.png'
        },
        {
          alias: 'card',
          src: 'assets/sprites/paypal2.webp'
        },
        {
          alias: 'score',
          src: 'assets/sprites/paypal.webp'
        },
         {
          alias: 'tree',
          src: 'assets/sprites/tree1.png'
        },
         {
          alias: 'tree2',
          src: 'assets/sprites/tree2.png'
        },
        {
          alias: 'pole',
          src: 'assets/sprites/pole.png'
        },
        {
          alias: 'cone',
          src: 'assets/sprites/cone.webp'
        },
        {
          alias: 'coneFlash',
          src: 'assets/sprites/coneFlash.webp'
        },
        {
          alias: 'playoff',
          src: 'assets/sprites/playoff.webp'
        },
        {
          alias: 'hand',
          src: 'assets/sprites/hand.png'
        }
        
      ]
    }
  ]
};