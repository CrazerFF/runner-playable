export const manifest = {
  bundles: [
    {
      name: 'game', // имя бандла для загрузки
      assets: [     // ОБЯЗАТЕЛЬНО массив объектов
        {
          alias: 'bg', // ключ для Assets.get('background')
          src: 'assets/sprites/bg.webp' // путь от корня (public/)
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
          src: 'assets/sprites/money.webp'
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
          src: 'assets/sprites/tree1.webp'
        },
         {
          alias: 'tree2',
          src: 'assets/sprites/tree2.webp'
        },
        {
          alias: 'pole',
          src: 'assets/sprites/pole.webp'
        },
        {
          alias: 'finish',
          src: 'assets/sprites/finish.webp'
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
          src: 'assets/sprites/hand.webp'
        },
        {
          alias: 'flash',
          src: 'assets/sprites/flash.webp'
        }, 
        {
          alias: 'tape1',
          src: 'assets/sprites/tape1.webp'
        }, 
        {
          alias: 'tape2',
          src: 'assets/sprites/tape2.webp'
        },
        {
          alias: 'stick',
          src: 'assets/sprites/stick.webp'
        },
        {
          alias: 'spark1',
          src: 'assets/sprites/spark1.webp'
        },
        {
          alias: 'spark2',
          src: 'assets/sprites/spark2.webp'
        },
        {
          alias: 'spark3',
          src: 'assets/sprites/spark3.webp'
        },
        {
          alias: 'spark4',
          src: 'assets/sprites/spark4.webp'
        },
        {
          alias: 'download',
          src: 'assets/sprites/download.webp'
        },
        {
          alias: 'fail',
          src: 'assets/sprites/fail.webp'
        },
        {
          alias: 'kust1',
          src: 'assets/sprites/kust1.webp'
        },
         {
          alias: 'kust2',
          src: 'assets/sprites/kust2.webp'
        },
         {
          alias: 'kust3',
          src: 'assets/sprites/kust3.webp'
        },
        {
          alias: 'tape_curved',
          src: 'assets/sprites/other1.webp'
        },
        {
          alias: 'point',
          src: 'assets/sprites/point.webp'
        }
        
      ]
    }
  ]
};