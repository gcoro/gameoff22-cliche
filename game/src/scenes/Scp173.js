class Scp173 extends Phaser.Scene {
	constructor() {
		super("Scp173");
	}


	preload() {
		this.load.image('base_tiles', 'assets/scp173/tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/scp173/map-scp173.json')

		//player
		this.load.atlas('alien', 'assets/scp173/spritesheet_player.png', 'assets/scp173/spritesheet_player.json');
	}


	create() {
		this.cursors = this.input.keyboard.createCursorKeys()

		const map = this.make.tilemap({key: 'tilemap'})
		const tileset = map.addTilesetImage('standard_tiles', 'base_tiles', 16, 16)

		const backgroundLayer = map.createLayer('background', tileset, 0,-23400) //pixels offset
		const wallsLayer = map.createLayer('walls', tileset, 0,-23400) //pixels offset

		this.createPlayer()
	}


	update(){
		this.updatePlayer()
	}

	updatePlayer(){
		if (this.cursors.left.isDown){
			this.player.setVelocityX(-200);
			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown){
			this.player.setVelocityX(200);
			this.player.anims.play('right', true);
		} else if (this.cursors.down.isDown){
			this.player.setVelocityY(200);
			this.player.anims.play('down', true);
		} else if (this.cursors.up.isDown){
			this.player.setVelocityY(-200);
			this.player.anims.play('up', true);
		} else {
			this.player.setVelocityX(0)
			this.player.setVelocityY(0)
			this.player.anims.play('turn')
		}
	}

	createPlayer(){
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNames('alien', {
				start: 2, end: 2,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNames('alien', {
				start: 4, end: 4,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNames('alien', {
				start: 1, end: 1,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNames('alien', {
				start: 3, end: 3,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'turn',
			frames: this.anims.generateFrameNames('alien', {
				start: 3, end: 3,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.player = this.physics.add.sprite(110, 540, 'alien');
		this.player.setCollideWorldBounds(true)
	}
}