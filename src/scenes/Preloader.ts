import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }
  preload() {
    this.load.image('tileset', 'tiles/dungeon_tileset.png');
    this.load.tilemapTiledJSON('dungeon', 'dungeon02.json');

    this.load.atlas('faune', 'characters/faune.png', 'characters/faune.json');
    this.load.atlas(
      'skeleton',
      'characters/skeleton.png',
      'characters/skeleton.json'
    );

    this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png');
    this.load.image('ui-heart-half', 'ui/ui_heart_half.png');
    this.load.image('ui-heart-full', 'ui/ui_heart_full.png');

    this.load.image('knife', 'weapons/weapon_knife.png');
  }
  create() {
    this.scene.start('game');
  }
}
