
// You can write more code here
class FallingObject extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, config){
        super(scene, x, y, texture)
        this.scene = scene
        this.speed = config.speed
        this.rotationVal = config.rotation
    }

    spawn(x){
        const positionY = Phaser.Math.Between(-50, -70)
        this.setPosition(x, positionY)
        this.setActive(true)
        this.setVisible(true)
    }

    die(){
        this.destroy()
    }

    update(time){
        this.setVelocityY(this.speed)
        this.rotation += this.rotationVal
        const gameHeight = this.scene.scale.height

        if(this.y > gameHeight + 5){
            this.die()
        }
    }
}


class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.setScale(2)
        this.speed = 200
    }

    fire(x, y){
        this.setPosition(x, y-50)
        this.setActive(true)
        this.setVisible(true)
    }

    erase(){
        this.destroy()
    }

    update(time){
        this.setVelocityY(this.speed * -1)
        if(this.y < -10){
            this.erase()
        }
    }
}

/* START OF COMPILED CODE */

class Meteor extends Phaser.Scene {

	constructor() {
		super("Meteor");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	preload() {

		this.load.pack("comet-pck", "assets/comet/comet-pck.json");
		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// ground
		const ground = this.add.tilemap("ground");
		ground.addTilesetImage("Ground", "Green moss and rocky walls");
		ground.addTilesetImage("Fantascienza", "level_tileset");

		// livello_tile_1
		const livello_tile_1 = ground.createLayer("Livello tile 1", ["Ground","Fantascienza"], -98, 201);
		livello_tile_1.scaleX = 0.5878711017473454;
		livello_tile_1.scaleY = 0.6351244842608338;

		// rectangle_1
		/** @type {Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }} */
		const rectangle_1 = this.add.rectangle(489, 612, 128, 128);
		rectangle_1.scaleX = 9.550075246954478;
		rectangle_1.scaleY = 0.8404655959892912;
		rectangle_1.visible = false;
		this.physics.add.existing(rectangle_1, false);
		rectangle_1.body.moves = false;
		rectangle_1.body.allowGravity = false;
		rectangle_1.body.allowDrag = false;
		rectangle_1.body.allowRotation = false;
		rectangle_1.body.setOffset(0, -5);
		rectangle_1.body.setSize(128, 128, false);
		rectangle_1.isFilled = true;

		// arcadesprite_1
		const arcadesprite_1 = this.physics.add.sprite(432, -254, "img_0");
		arcadesprite_1.scaleX = 3.453177619787111;
		arcadesprite_1.scaleY = 3.872053011718694;
		arcadesprite_1.angle = 90;
		arcadesprite_1.body.velocity.y = 1;
		arcadesprite_1.body.maxSpeed = 1;
		arcadesprite_1.body.gravity.y = 1;
		arcadesprite_1.body.setOffset(71, 139);
		arcadesprite_1.body.setSize(35, 44, false);

		// player
		const player = this.physics.add.sprite(439, 494, "ship", 0);
		player.body.setSize(66, 66, false);

		// Date
		const date = this.add.text(30, 42, "", {});
		date.text = "New text";

		// rectangle_2
		const rectangle_2 = this.add.rectangle(372, 297, 128, 128);
		rectangle_2.scaleX = 6.755764178494033;
		rectangle_2.scaleY = 4.941475499349193;
		rectangle_2.visible = false;
		rectangle_2.isFilled = true;
		rectangle_2.fillColor = 0;
		rectangle_2.strokeColor = 0;

		// text_1
		const text_1 = this.add.text(375, 308, "", {});
		text_1.visible = false;
		text_1.text = "Game Over?";

		// collider
		this.physics.add.collider(arcadesprite_1, rectangle_1, this.onMeteorCollision, undefined, this);

		// arcadesprite_1 (components)
		const arcadesprite_1StartAnimation = new StartAnimation(arcadesprite_1);
		arcadesprite_1StartAnimation.animationKey = "comet";

		this.arcadesprite_1 = arcadesprite_1;
		this.player = player;
		this.date = date;
		this.rectangle_2 = rectangle_2;
		this.text_1 = text_1;
		this.ground = ground;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Physics.Arcade.Sprite} */
	arcadesprite_1;
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player;
	/** @type {Phaser.GameObjects.Text} */
	date;
	/** @type {Phaser.GameObjects.Rectangle} */
	rectangle_2;
	/** @type {Phaser.GameObjects.Text} */
	text_1;
	/** @type {Phaser.Tilemaps.Tilemap} */
	ground;

	/* START-USER-CODE */
	// Write your code here

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
	  }

	dates = ["30 June 1908, Tunguska River, Russia", "9 April 1941, Chelyabinsk, USSR", "12 February 1947, Sikhote-Alin Mountains, USSR", "25 September 2002,Bodaybo, Russia", "7 February 2009,Tyumen Oblast, Russia", "15 February 2013,Chelyabinsk, Russia", "15 December 2017,Kamchatka, Russia", "18 December 2018,Kamchatka, Russia", "25 February 2020,Lake Baikal, Russia" ]

    shoot = false;
    speed = 100;
    cursors = undefined;
    enemies = undefined;
    enemySpeed = 60;
    lasers = undefined;
    lastFired = 0;
    spaceBar = undefined;

	onMeteorCollision(){
	console.log("BOOM!")
	this.arcadesprite_1.destroy();
	this.rectangle_2.visible = true;
	this.text_1.visible = true;
	}

	create() {
		const actualDate = this.dates[this.getRandomInt(0,this.dates.length)];
		this.editorCreate();
		const iteration = sessionStorage.getItem("iteration")||0;
		const cometVelocity = ((+iteration)*5 + 10);
		console.log(cometVelocity)
		sessionStorage.setItem("iteration",+iteration + 1)
		this.date.text = actualDate;
		this.arcadesprite_1.body.velocity.y = cometVelocity;
		this.arcadesprite_1.body.maxSpeed = cometVelocity;
		this.player = this.createPlayer();
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(
		  Phaser.Input.Keyboard.KeyCodes.SPACE
		);
		this.enemies = this.physics.add.group({
			classType: FallingObject,
			maxSize: 10,
			runChildUpdate: true
		  });
		  this.time.addEvent({
			delay: 2000,
			// delay : Phaser.Math.Between(2000, 8000),
			callback: this.spawnEnemy,
			callbackScope: this,
			loop: true
		  });

		  this.lasers = this.physics.add.group({
			classType: Laser,
			maxSize: 10,
			runChildUpdate: true
		  });

		  this.physics.add.overlap(
			this.lasers,
			this.enemies,
			this.hitEnemy,
			undefined,
			this
		  );
		  this.physics.add.overlap(
			this.player,
			this.enemies,
			this.decreaseLife,
			null,
			this
		  );
	}

	createPlayer() {
		const player = this.player;
		player.setCollideWorldBounds(true);

		this.anims.create({
		  key: "turn",
		  frames: [{ key: "ship", frame: 0 }]
		});

		this.anims.create({
		  key: "left",
		  frames: this.anims.generateFrameNumbers("ship", {
			start: 1,
			end: 2
		  }),
		  frameRate: 10
		});

		this.anims.create({
		  key: "right",
		  frames: this.anims.generateFrameNumbers("ship", {
			start: 1,
			end: 2
		  }),
		  frameRate: 10
		});

		return player;
	  }

	  movePlayer(player, time) {
		if (this.cursors.left.isDown) {
		  this.player.setVelocityX(this.speed * -1);
		  this.player.anims.play("left", true);
		  this.player.setFlipX(false);
		} else if (this.cursors.right.isDown) {
		  this.player.setVelocityX(this.speed);
		  this.player.anims.play("right", true);
		  this.player.setFlipX(true);
		} else {
		  this.player.setVelocityX(0);
		  this.player.anims.play("turn");
		}

		if ((this.shoot || this.spaceBar.isDown) && time > this.lastFired) {
		  const laser = this.lasers.get(0, 0, "laser");

		  if (laser) {
			laser.fire(this.player.x, this.player.y);
			this.lastFired = time + 150;
		  }
		}
	  }

	  spawnEnemy() {
		const config = {
		  speed: this.enemySpeed,
		  rotation: 0.01
		};

		// @ts-ignore
		const enemy = this.enemies.get(0, 0, "animated_asteroid", config);
		const enemyWidth = enemy.displayWidth;
		const positionX = Phaser.Math.Between(
		  enemyWidth,
		  this.scale.width - enemyWidth
		);

		if (enemy) {
		  enemy.spawn(positionX);
		}
	  }

	  hitEnemy(laser, enemy) {
		laser.erase();
		enemy.die();

		console.log("bang!")
	  }

	update(time) {	
		this.movePlayer(this.player, time);
	  }

	  decreaseLife(player, enemy) {
		enemy.die();

		console.log("colpito!")
	  }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
