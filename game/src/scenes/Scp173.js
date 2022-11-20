class Scp173 extends Phaser.Scene {
	constructor() {
		super("Scp173");
	}


	preload() {
		this.load.image('base_tiles', 'assets/scp173/tiles.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/scp173/map-scp173.json')

		//player allies
		this.load.atlas('alien_ally', 
			'assets/scp173/spritesheet_player_ally.png', 
			'assets/scp173/spritesheet_player.json'
		);

		//player
		this.load.atlas('alien', 
			'assets/scp173/spritesheet_player.png', 
			'assets/scp173/spritesheet_player.json'
		);

		//enemy
		this.load.atlas('enemy', 
			'assets/scp173/eye_monster/covid_spritesheet.png', 
			'assets/scp173/eye_monster/covid_spritesheet.json'
		);


		//exit door
		this.load.atlas('exit_door', 
			'assets/scp173/exit_door.png', 
			'assets/scp173/exit_door.json'
		);
	}

	create() {
		this.cursors = this.input.keyboard.createCursorKeys()
		this.triggerTimer = this.time.addEvent({
            callback: this.eyeClose,
            callbackScope: this,
            delay: 1000 * 5, // 1000 = 1 second -> 1 min
            loop: true
        });
		this.triggerTimer = this.time.addEvent({
            callback: this.startBounce,
            callbackScope: this,
            delay: 1000 * 10, // 1000 = 1 second -> 1 min
            loop: true
        });

		const map = this.make.tilemap({key: 'tilemap'})
		const tileset = map.addTilesetImage('standard_tiles', 'base_tiles', 16, 16)

        this.cameras.main.setBounds(0, 0, 800, 24000);
        this.physics.world.setBounds(0, 0, 800, 24000);
		
		const backgroundLayer = map.createLayer('background', tileset, 0, 0); //pixels offset
		//const wallsLayer = map.createLayer('walls', tileset, 0, -map.heightInPixels+700) //pixels offset

		this.createPlayer()
		this.createEnemy(map)
		this.createPlayerAllies()
		this.createExitDoor() //to fix coords when we have the final tilemap background
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08);
	}


	eyeClose() {
        console.log('enemy eyeClose');
		this.enemy.anims.play('stop');
    }

	startBounce() {
        console.log('enemy bounce ');
		this.enemy.anims.play('bounce');
    }

	update(){
		this.updatePlayer()
		this.updateEnemy()
		this.updatePlayerAllies()
	}

	updateEnemy(){
		this.enemy.setY(this.enemy.y+70-this.getRelativePositionToCanvas(this.enemy));
	}

	updatePlayerAllies(){
		this.player_alien_ally1.setY(this.player_alien_ally1.y+450-this.getRelativePositionToCanvas(this.player_alien_ally1));
		this.player_alien_ally2.setY(this.player_alien_ally2.y+450-this.getRelativePositionToCanvas(this.player_alien_ally2));
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

	createExitDoor(){
		this.anims.create({
			key: 'open',
			frames: this.anims.generateFrameNames('exit_door', {
				start: 1, end: 6,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'close',
			frames: this.anims.generateFrameNames('exit_door', {
				start: 6, end: 10,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.exit_door = this.physics.add.sprite(650, 23550, 'exit_door');
	}

	closeExitDoor() { //to call back if monster release something
		this.exit_door.anims.play('close')
	}

	openExitDoor() { //to call back when finish to clean around && monster eye's closed
		this.exit_door.anims.play('open')
	}

	createPlayerAllies(){
		//TODO: remove static pixels coords
		this.player_alien_ally2 = this.physics.add.sprite(450, 23850, 'alien_ally');
		this.player_alien_ally1 = this.physics.add.sprite(50, 23850, 'alien_ally');

		this.anims.create({
			key: 'ally_stopped',
			frames: this.anims.generateFrameNames('alien_ally', {
				start: 3, end: 3,
				prefix: 'sprite'
			}),
			frameRate: 10
		});
		this.player_alien_ally1.anims.play('ally_stopped')
		this.player_alien_ally2.anims.play('ally_stopped')
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

		this.player = this.physics.add.sprite(0, 24000, 'alien');
		this.player.setCollideWorldBounds(true)
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

	createEnemy(map){
		// TODO  need to fix the order of the sprites
		this.anims.create({
			key: 'bounce',
			frames: this.anims.generateFrameNames('enemy', {
				start: 1, end: 11,
				prefix: 'sprite'
			}),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'stop',
			frames: this.anims.generateFrameNames('enemy', {
				start: 24, end: 24,
				prefix: 'sprite'
			}),
			frameRate: 8,
			repeat: -1
		});

		this.enemy = this.physics.add.sprite(map.widthInPixels/2, map.heightInPixels-500, 'enemy')
		this.enemy.setScale(0.5, 0.5)
		this.enemy.setCollideWorldBounds(true)
		this.enemy.fixedToCamera = true;
		this.enemy.anims.play('bounce');
	}

	getRelativePositionToCanvas(gameObject) {
		return (gameObject.y -  this.cameras.main.worldView.y) *  this.cameras.main.zoom
	}
}