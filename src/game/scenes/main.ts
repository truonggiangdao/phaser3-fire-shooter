import Phaser from 'phaser';
import { bombSound, shootSound, entrySound, collectSound } from '../assets/audio';
import { sky, ground, fireball, dude, star, bomb } from '../assets/images';
import { SceneSound } from './sceneSound';
import { createWelcomeDiv } from './welcome';

export class MainScene extends Phaser.Scene {
  bg: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  stars: Phaser.Physics.Arcade.Group;
  bombs: Phaser.Physics.Arcade.Group;
  bombsList: Array<any> = [];
  fireballs: Phaser.Physics.Arcade.Group;
  fires: Array<any> = [];
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  score: number = 0;
  life: number = 2;
  scoreText: Phaser.GameObjects.Text;
  lifeText: Phaser.GameObjects.Text;
  sceneSounds: SceneSound = {
    entry: null, // for start game
    collect: null, // for fire touch star
    shoot: null, // for fire
    bomb: null // for bomb touch player
  };

  shootTimer = null;

  preload() {
    this.load.image(sky.name, sky.src);
    this.load.image(ground.name, ground.src);
    this.load.image(fireball.name, fireball.src);
    this.load.image(star.name, star.src);
    this.load.image(bomb.name, bomb.src);
    this.load.spritesheet(dude.name, dude.src, { frameWidth: dude.frame.width, frameHeight: dude.frame.height });

    this.load.audio(entrySound.name, entrySound.src);
    this.load.audio(collectSound.name, collectSound.src);
    this.load.audio(shootSound.name, shootSound.src);
    this.load.audio(bombSound.name, bombSound.src);
  }

  initPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, ground.name).setScale(2).refreshBody();
    this.platforms.create(400, (-1 * ground.height - star.height), ground.name).setScale(2).refreshBody();

    return this.platforms;
  }

  initPlayer() {
    this.player = this.physics.add.sprite(100, 450, dude.name);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(dude.name, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: dude.name, frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(dude.name, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    return this.player;
  }

  initStars() {
    this.stars = this.physics.add.group();
    for (let index = 0; index < 5; index++) {
      const x = Phaser.Math.FloatBetween(10, 790);
      const y = Phaser.Math.FloatBetween(200, 400);
      const cStar = this.physics.add.image(x, y, star.name).setOrigin(0);
      this.stars.add(cStar);
    }

    return this.stars;
  }

  initFireballs() {
    this.fireballs = this.physics.add.group();
    for (let index = 0; index < 20; index++) {
      const x = -100;
      const y = -100;
      const fire = this.physics.add.image(x, y, fireball.name).setScale(0.5);
      fire.removeFromDisplayList();
      fire.removeFromUpdateList();
      this.fireballs.add(fire);
      this.fires.push(fire);
    }

    return this.fireballs;
  }

  initCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  initSound() {
    this.sceneSounds.entry = this.sound.add(entrySound.name);
    this.sceneSounds.collect = this.sound.add(collectSound.name);
    this.sceneSounds.shoot = this.sound.add(shootSound.name);
    this.sceneSounds.bomb = this.sound.add(bombSound.name);
  }

  getBombPosition() {
    return {
      x: Phaser.Math.FloatBetween(10, 790),
      y: Phaser.Math.FloatBetween(10, 100)
    }
  }

  initBombs() {
    this.bombs = this.physics.add.group();
    for (let index = 0; index < 10; index++) {
      const { x, y } = this.getBombPosition();
      const cBomb = this.physics.add.image(x, y, bomb.name).setOrigin(0);
      this.bombs.add(cBomb);
      this.bombsList.push({
        velocityY: Phaser.Math.FloatBetween(100, 300),
        obj: cBomb
      });
    }

    return this.bombs;
  }

  shootFireBall() {
    const playerPosition = this.player.getTopCenter();
    const fire: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = this.fires.splice(0, 1)[0];
    fire.enableBody(true, playerPosition.x, playerPosition.y, true, true);
    fire.addToDisplayList();
    fire.addToUpdateList();
    this.sceneSounds.shoot.play();
  }

  repositionBomb(platforms: any, obj: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    const { x, y } = this.getBombPosition();
    obj.body.x = x;
    obj.body.y = y;
  }

  playerTouchBomb(player: any, theBomb: any) {
    this.sceneSounds.bomb.play();
    player.setTint(0xff0000);
    setTimeout(() => {
      if (this.life > 0) {
        player.setTint(0xffffff);
      }
    }, 1000);
    player.anims.play('turn');
    this.repositionBomb(null, theBomb);
    this.life -= 1;
    this.lifeText.setText('Life: ' + this.life);
    if (this.life <= 0) {
      setTimeout(() => {
        this.scene.pause();
        document.getElementById('result').classList.add('lose');
        document.getElementById('result').innerHTML = 'LOSER';
      }, 200);
    }
  }

  repositionStar(platforms: any, obj: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    obj.body.x = Phaser.Math.FloatBetween(50, 750);
    obj.body.y = Phaser.Math.FloatBetween(200, 400);
  }

  repositionFireball(platforms: any, obj: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    obj.body.x = -100;
    obj.body.y = -100;
    obj.removeFromDisplayList();
    obj.removeFromUpdateList();
    this.fires.push(obj);
  }

  updateScore(score: number) {
    this.scoreText.setText('Score: ' + score);
    if (score >= 10) {
      setTimeout(() => {
        this.scene.pause();
        document.getElementById('result').classList.add('win');
        document.getElementById('result').innerHTML = 'WINNER';
      }, 1000);
    }
  }

  collectScore(obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.repositionStar(null, obj1);
    this.repositionFireball(null, obj2);
    this.score += 1;
    this.updateScore(this.score);
    this.sceneSounds.collect.play();
  }

  handlePlayerMovements(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (this.cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    }
    else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (this.cursors.up.isDown && player.body.touching.down) {
      if (!this.shootTimer) {
        this.shootFireBall();
        this.shootTimer = setInterval(this.shootFireBall.bind(this), 500);
      }
    }
    if (this.cursors.up.isUp) {
      if (this.shootTimer) {
        clearInterval(this.shootTimer);
        this.shootTimer = null;
      }
    }
  }

  create() {
    this.initSound();

    this.bg = this.add.image(0, 0, sky.name).setOrigin(0, 0);

    const platforms = this.initPlatforms();

    const bombs = this.initBombs();

    const player = this.initPlayer();

    const stars = this.initStars();
    const fireballs = this.initFireballs();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(platforms, stars, this.repositionStar, null, this);
    this.physics.add.collider(platforms, fireballs, this.repositionFireball, null, this);
    this.physics.add.collider(platforms, bombs, this.repositionBomb, null, this);
    this.physics.add.collider(player, bombs, this.playerTouchBomb, null, this);
    this.physics.add.overlap(stars, fireballs, this.collectScore, null, this);

    this.initCursor();

    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '16px', color: '#000' });
    this.lifeText = this.add.text(150, 16, 'Life: ' + + this.life, { fontSize: '16px', color: 'red' });

    this.scene.pause();
    const div = createWelcomeDiv();
    div.addEventListener('click', () => {
      this.sceneSounds.entry.play();
      div.classList.add('hide');
      this.scene.resume();
    });
  }

  update() {
    this.handlePlayerMovements(this.player);
    this.stars.setVelocityY(-50);
    this.fireballs.setVelocityY(-200);
    // this.bombs.setVelocityY(100);
    this.bombsList.forEach(bombData => {
      (bombData.obj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setVelocityY(bombData.velocityY);
    });
  }
}
