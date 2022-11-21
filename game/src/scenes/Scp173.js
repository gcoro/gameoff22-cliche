class Scp173 extends Phaser.Scene {
	constructor() {
		super("Scp173");
	}

	init() {
		// constants
		this.CELL_SIZE = 16
		this.NUM_POORS_PER_LOOP = 5
		this.SCORES_OVERLAP_POOR = 5
		this.OVERLAP_RANGE = 12

		// local variables
		this.currentPoors = []
		this.container = {}
		this.currentScore = 0

		this.player = undefined;
		this.enemy = undefined;
		this.tileSize = 16;
		this.mapHeight = 4800;
		this.mapWidth = 640;

		
		this.stars = undefined; //colliding obecjt that we do not have yet
		// we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
		this.player_alien_ally1 = undefined;
		this.player_alien_ally2 = undefined;
		this.exit_door = undefined;
		this.cursors = undefined;
		this.scoreLabel = undefined;
	}

	preload() {
		this.load.image('base_tiles', 'assets/scp173/level_tileset.png')
		this.load.tilemapTiledJSON('tilemap', 'assets/scp173/small_map.json')
		this.load.image('star', 'assets/scp173/star.png')
		this.load.image('poor', 'assets/scp173/poor/splat.png')
    
		//poops
		this.load.atlas(
		  'throw_poor',
		  'assets/scp173/poops.png',
		  'assets/scp173/poops.json'
		)

		//player allies
		this.load.atlas('alien_ally', 
			'assets/scp173/spritesheet_player_ally.png', 
			'assets/scp173/spritesheet_player.json'
		);

		//player
		this.load.atlas('alien', 
			'assets/scp173/alien_repack.png', 
			'assets/scp173/alien_repack.json'
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
		this.createTimers() //for monster

		// add collider
		this.anims.create({
				key: 'anim_throw_poor',
				frames: this.anims.generateFrameNames('throw_poor', {
					start: 1, end: 6,
					prefix: 'sprite'
				}),
				frameRate: 10,
			repeat: -1
		});
		this.currentScore = 0

		const map = this.make.tilemap({key: 'tilemap'})
		this.map = map
		const tileset = map.addTilesetImage('level_tileset', 'base_tiles', 16, 16)
		
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.physics.world.setBounds(this.mapWidth/8, 0, this.mapWidth, this.mapHeight);
		
		const backgroundLayer = map.createLayer('background_new', tileset, map.widthInPixels/8, 0); //pixels offset
		const wallsLayer = map.createLayer('walls_new', tileset, map.widthInPixels/8, 0); //pixels offset
		wallsLayer.setCollisionByProperty({ collides: true });

		this.make.text({
			x:8*this.mapWidth/8, 
			y: this.mapHeight/2,
			text: 'ur halfway thourgh it!',
			style: {
				font: '12px monospace',
				fill: '#ffffff'
			}
		});

		this.createPlayer()
		this.createEnemy(map)
		this.createPlayerAllies()
		this.createStars()
		this.createExitDoor() //to fix coords when we have the final tilemap background
		this.testCreatePoors()

		this.physics.add.overlap(this.player, this.exit_door, this.goToAfterGameTransitionScene, null, this)
		this.physics.add.collider(this.player, wallsLayer);
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08);
	}

	testCreatePoors() {
		setTimeout(() => this.createPoors(), 1000)
	}

	createPoors() {
		for (let i = 0; i < this.NUM_POORS_PER_LOOP; i++) {
		  const coords = this.generateRandomCoords()
		  const loopImage = this.physics.add.image(coords.x, coords.y, 'poor')
		  loopImage.setVisible(false)
		  loopImage.setDepth(1)
		  this.currentPoors.push({ image: loopImage, ...coords })
	
		  const sourceImage = this.physics.add.sprite(100, 100, 'throw_poor')
		  sourceImage.setScale(0.1, 0.)
		  
		  //const sourceImage = this.physics.add.image(100, 100, 'throw_poor')
		  sourceImage.setDepth(0)
		  sourceImage.anims.play('anim_throw_poor')
	
		  this.physics.moveToObject(sourceImage, loopImage, 200)
		  const throwCollider = this.physics.add.overlap(sourceImage, loopImage, (source, dest) => {
			source.body.stop()
			dest.setVisible(true)
			source.destroy()
			this.physics.add.overlap(this.player, loopImage, (player, image) =>
			  this.handlePoorOverlap(player, image)
			)
			this.physics.world.removeCollider(throwCollider)
		  })
		}
	}

	generateRandomCoords() {
		const min = 32
		const maxW = this.map.widthInPixels - 32
		const maxH = this.map.heightInPixels - 32
		return {
		  x: Math.floor(Math.random() * (maxW - min - 1) + min),
		  y: Math.floor(Math.random() * (maxH - min - 1) + min),
		}
	  }
	
	  /**
	   * handle player overlap poor
	   * @param {*} player
	   * @param {*} image
	   */
	  handlePoorOverlap(player, image) {
		if (this.cursors.space.isDown) {
		  this.ckeckPoorToClean(player, image)
		  this.currentScore += this.SCORES_OVERLAP_POOR
		}
	  }
	
	  /**
	   * check if player is on a poor and eventually clean it if space is pressed
	   */
	  ckeckPoorToClean(player, image) {
		const posPlayerX = player.x
		const posPlayerY = player.y
		let selIdx = -1
		const selPoor = this.currentPoors.find((p, idx) => {
		  const res = this.areObjectsOverlapping(p, { x: posPlayerX, y: posPlayerY })
		  if (res) selIdx = idx
		  return res
		})
		if (selPoor) {
		  selPoor.image.destroy()
		  this.currentPoors.splice(selIdx, 1)
		}
	  }
	
	  /**
	   * get container position
	   * @returns
	   */
	  getContainerPosition() {
		return {
		  top: (game.canvas.height - this.container.layer.height) / 2,
		  left: (game.canvas.width - this.container.layer.width) / 2,
		}
	  }
	
	  /**
	   * check if 2 objects are overlapping
	   * @param {*} obj1
	   * @param {*} obj2
	   * @returns
	   */
	  areObjectsOverlapping(obj1, obj2) {
		return (
		  Math.abs(obj1.x - obj2.x) < this.OVERLAP_RANGE &&
		  Math.abs(obj1.y - obj2.y) < this.OVERLAP_RANGE
		)
	}

    collectStar(player, star){
		star.disableBody(true, true)

		if(this.stars.countActive() === 0){ //everything is cleaned up
			console.log("this.stars.countActive is zero")
			this.openExitDoor()
		}
        // TODO: update score label
	}

	createStars()
	{
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 5,
			setXY: { x: this.mapWidth/8, y: 3500, stepX: 10 }
		})
		
		this.stars.children.iterate((c) => {
            let child = /** @type {Phaser.Physics.Arcade.Sprite} */ (c)
			child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4))
		})

		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
	}

	createTimers(){
		this.triggerTimer = this.time.addEvent({
            callback: this.startBounce,
            callbackScope: this,
            delay: 1000 * 5, // 1000 = 1 second -> 1 min
            loop: true
        });
		this.triggerTimer = this.time.addEvent({
            callback: this.eyeClose,
            callbackScope: this,
            delay: 1000 * 10, // 1000 = 1 second -> 1 min
            loop: true
        });
	}

	goToAfterGameTransitionScene() {
		if(this.exit_door.anims.currentAnim && this.exit_door.anims.currentAnim.key === 'open'){// check door is open
			this.scene.start('AfterGameTransition');
		}
	}

	eyeClose() {
		this.enemy.anims.play('stop');
    }

	startBounce() {
		this.enemy.anims.play('bounce');
    }

	update(){
		this.updatePlayer()
		this.updateEnemy()
		this.updatePlayerAllies()
	}

	updateEnemy(){
		if(this.cameras.main.worldView.y>1){
			this.enemy.setY(this.enemy.y+70-this.getRelativePositionToCanvas(this.enemy));
		}
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

		this.exit_door = this.physics.add.sprite(8*this.mapWidth/8, 50, 'exit_door');
		this.exit_door.setScale(1.4, 1.4)
	}

	closeExitDoor() { //to call back if monster release something
		this.exit_door.anims.play('close')
	}

	openExitDoor() { //to call back when finish to clean around && monster eye's closed
		this.exit_door.anims.play('open')
	}

	createPlayerAllies(){
		//TODO: remove static pixels coords
		this.player_alien_ally2 = this.physics.add.sprite(2*this.mapWidth/8, this.mapHeight-50, 'alien_ally');
		this.player_alien_ally1 = this.physics.add.sprite(8*this.mapWidth/8, this.mapHeight-50, 'alien_ally');

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
			key: 'right',
			frames: this.anims.generateFrameNames('alien', {
				start: 5, end: 8,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNames('alien', {
				start: 1, end: 4,
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
				start: 9, end: 9,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.anims.create({
			key: 'turn',
			frames: this.anims.generateFrameNames('alien', {
				start: 10, end: 10,
				prefix: 'sprite'
			}),
			frameRate: 10
		});

		this.player = this.physics.add.sprite(5*this.mapWidth/8, this.mapHeight-60, 'alien');
		this.player.setScale(0.6, 0.6)
		this.player.setCollideWorldBounds(true)
		this.player.setDepth(5) // above all the other objects
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

		this.enemy = this.physics.add.sprite(5*this.mapWidth/8, map.heightInPixels-500, 'enemy')
		this.enemy.setCollideWorldBounds(true)
		this.enemy.setScale(0.6, 0.6)

		this.enemy.fixedToCamera = true;

		this.enemy.anims.play('bounce');
	}

	getRelativePositionToCanvas(gameObject) {
		return (gameObject.y -  this.cameras.main.worldView.y) *  this.cameras.main.zoom
	}
}