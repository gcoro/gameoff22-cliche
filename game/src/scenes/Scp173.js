class Scp173 extends Phaser.Scene {

	constructor() {
		super("Scp173");
		
	}


	preload() {
		this.load.image('base_tiles', 'assets/scp173/tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/scp173/map-scp173.json')

		//player
		this.load.atlas('sprite', 'assets/scp173/alien_sprites.png', 'assets/scp173/alien_sprites.json')
	}



	create() {
		const map = this.make.tilemap({key: 'tilemap'})
		const tileset = map.addTilesetImage('standard_tiles', 'base_tiles', 16, 16)

		const backgroundLayer = map.createLayer('background', tileset, 0,-23400); //pixels offset
		const wallsLayer = map.createLayer('walls', tileset, 0,-23400); //pixels offset
		
		const sprite = this.add.sprite(110, 560, 'sprite');
	}
}
