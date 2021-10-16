import Phaser from 'phaser';

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      faune(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;

  get health() {
    return this._health;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play('faune-idle-side');
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    const speed = 100;

    if (cursors.left?.isDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(-speed, 0);
      this.scaleX = -1;
      this.body.offset.x = 24;
    } else if (cursors.right?.isDown) {
      this.anims.play('faune-run-side', true);
      this.setVelocity(speed, 0);
      this.scaleX = 1;
      this.body.offset.x = 8;
    } else if (cursors.up?.isDown) {
      this.anims.play('faune-run-up', true);
      this.setVelocity(0, -speed);
    } else if (cursors.down?.isDown) {
      this.anims.play('faune-run-down', true);
      this.setVelocity(0, speed);
    } else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    this.setVelocity(dir.x, dir.y);

    this.setTint(0x0ff0000);
    this.healthState = HealthState.DAMAGE;

    --this._health;

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
    }
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xfffffff);
          this.damageTime = 0;
        }
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'faune',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Faune(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
  }
);
