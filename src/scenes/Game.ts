import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createSkeletonAnims } from '~/anims/EnemyAnims';
import { createCharacterAnims } from '~/anims/CharacterAnims';
import '~/characters/Faune';
import Skeleton from '~/enemies/Skeleton';
import Faune from '~/characters/Faune';

import { sceneEvents } from '~/events/EventCenter';

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createSkeletonAnims(this.anims);
    createCharacterAnims(this.anims);

    this.scene.run('game-ui');

    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tileset');

    map.createLayer('Ground', tileset);

    this.faune = this.add.faune(128, 128, 'faune');

    const skeletons = this.physics.add.group({
      classType: Skeleton,
      createCallback: (go) => {
        const skelGo = go as Skeleton;
        skelGo.body.onCollide = true;
        skelGo.body.setSize(skelGo.width * 0.7, skelGo.height);
      },
    });

    skeletons.get(256, 128, 'skeleton');

    const wallsLayer = map.createLayer('Wall', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    //debugDraw(wallsLayer, this);

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(skeletons, wallsLayer);

    this.physics.add.collider(
      skeletons,
      this.faune,
      this.handlePlayerSkeletonCollision,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.faune, true);
  }

  private handlePlayerSkeletonCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const skeleton = obj2 as Skeleton;

    const dx = this.faune.x - skeleton.x;
    const dy = this.faune.y - skeleton.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.faune.health);
  }

  update(t: number, dt: number) {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
