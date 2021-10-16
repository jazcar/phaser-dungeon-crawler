import Phaser from 'phaser';

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return newDirection;
};

export default class Skeleton extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private speed = 50;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play('skeleton-run');

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 1500,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();

    super.destroy();
  }

  private handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (go != this) {
      return;
    }
    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -this.speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, this.speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-this.speed, 0);
        this.scaleX = -1;
        this.body.offset.x = 13;
        break;
      case Direction.RIGHT:
        this.setVelocity(this.speed, 0);
        this.scaleX = 1;
        this.body.offset.x = 3;
        break;
    }
  }
}
