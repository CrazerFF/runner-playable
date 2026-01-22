import { Container, AnimatedSprite, Assets, Graphics} from 'pixi.js';

export class Enemy extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    const sheet = Assets.get('enemy_json');
  
    this.animations = {
      walk: sheet.animations['walk'],
      run: sheet.animations['run']
    };

    this.sprite = new AnimatedSprite(this.animations.walk);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(-0.4, 0.4);
   
    this.sprite.animationSpeed = 0.6;
    this.sprite.loop = true;

    this.addChild(this.sprite);

    this.speed = 5;
    this.state = null;

    this.playWalk();
    //this.playRun();
  }

  playWalk() {
    this._play('walk', 0.7, true);
  }

  playRun() {
    this._play('run', 0.7, true);
  }

  _play(name, speed, loop) {
    const frames = this.animations[name];
    if (!frames || this.state === name) return;

    this.state = name;
    this.sprite.textures = frames;
    this.sprite.animationSpeed = speed;
    this.sprite.loop = loop;
    this.sprite.gotoAndPlay(0);
  }

  update(delta) {
    this.x -= this.speed * 1.2 * delta;
    if (this.scene.player.staying) {
      this.sprite.stop();
    } else if (this.x <= this.scene.DESIGN_W/3.5) {
      this.playRun();
      this.x -= this.speed * 1.5 * delta;
    }
  }
}
