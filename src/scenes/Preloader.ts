import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }
  preload() {
    this.load.image('tileset', 'tiles/dungeon_tileset.png');
    this.load.tilemapTiledJSON('dungeon', 'dungeon02.json')

    this.load.atlas('faune', 'characters/faune.png', 'characters/faune.json')
    this.load.atlas('skeleton', 'characters/skeleton.png', 'characters/skeleton.json')
  }
  create() {
    this.scene.start('game')
  }
}