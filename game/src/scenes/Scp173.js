class Scp173 extends Phaser.Scene {

	constructor() {
		super("Scp173");
	}

	preload() {
		this.load.image('base_tiles', 'assets/tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/map-scp173.json')
	}



	create() {
		const map = this.make.tilemap({key: 'tilemap'})
		const tileset = map.addTilesetImage('standard_tiles', 'base_tiles', 16, 16)

		//TODO: should not start from 0,0 because we're seeing the top of the map not the bottom
		const backgroundLayer = map.createLayer('background', tileset, 0,0);
		const wallsLayer = map.createLayer('walls', tileset, 0,0);
	}
}
