import Phaser from 'phaser';
import { debugDraw } from '../utils/debug';
import { createSkeletonAnims } from '~/anims/EnemyAnims';
import { createCharacterAnims } from '~/anims/CharacterAnims';
import '~/characters/Faune';
import Skeleton from '~/enemies/Skeleton';
import Faune from '~/characters/Faune';
import { createChestAnims } from '~/anims/TreasureAnims';

import { sceneEvents } from '~/events/EventCenter';
import Chest from '~/items/Chest';

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private playerSkeletonCollider!: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;
  private skeletons!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createSkeletonAnims(this.anims);
    createCharacterAnims(this.anims);
    createChestAnims(this.anims);

    this.scene.run('game-ui');

    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tileset');

    map.createLayer('Ground', tileset);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.faune = this.add.faune(128, 128, 'faune');
    this.faune.setKnives(this.knives);

    this.skeletons = this.physics.add.group({
      classType: Skeleton,
      createCallback: (go) => {
        const skelGo = go as Skeleton;
        skelGo.body.onCollide = true;
        skelGo.body.setSize(skelGo.width * 0.7, skelGo.height);
      },
    });

    this.skeletons.get(256, 128, 'skeleton');

    const wallsLayer = map.createLayer('Wall', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    //debugDraw(wallsLayer, this);

    const chests = this.physics.add.staticGroup({ classType: Chest });
    const chestsLayer = map.getObjectLayer('Chests');
    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        'treasure'
      );
    });

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.skeletons, wallsLayer);
    this.physics.add.collider(
      this.faune,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );
    this.physics.add.collider(this.skeletons, chests);
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.skeletons,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    this.playerSkeletonCollider = this.physics.add.collider(
      this.skeletons,
      this.faune,
      this.handlePlayerSkeletonCollision,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.faune, true);
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const chest = obj2 as Chest;
    this.faune.setChest(chest);
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.skeletons.killAndHide(obj2);
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

    if (this.faune.health <= 0) {
      this.playerSkeletonCollider?.destroy();
    }
  }

  update(t: number, dt: number) {
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
