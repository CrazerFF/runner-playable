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
          alias: 'finish',
          src: 'assets/sprites/finish.png'
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
        },
        {
          alias: 'flash',
          src: 'assets/sprites/flash.png'
        }, 
        {
          alias: 'tape1',
          src: 'assets/sprites/tape1.png'
        }, 
        {
          alias: 'tape2',
          src: 'assets/sprites/tape2.png'
        },
        {
          alias: 'stick',
          src: 'assets/sprites/stick.png'
        },
        {
          alias: 'spark1',
          src: 'assets/sprites/spark1.png'
        },
        {
          alias: 'spark2',
          src: 'assets/sprites/spark2.png'
        },
        {
          alias: 'spark3',
          src: 'assets/sprites/spark3.png'
        },
        {
          alias: 'spark4',
          src: 'assets/sprites/spark4.png'
        },
        {
          alias: 'download',
          src: 'assets/sprites/download.webp'
        },
        {
          alias: 'fail',
          src: 'assets/sprites/fail.png'
        },
        
      ]
    }
  ]
};