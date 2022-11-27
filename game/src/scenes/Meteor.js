
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

	explode() {
		this.speed = 0;
		this.rotation = 0;
		this.rotationVal = 0;
		this.scale = 0.5;
		this.y = this.y +30;
		this.anims.play("explosion")
		this.once('animationcomplete', function () {
			this.die()
		}, this);
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

		this.load.pack("asset-pack-explosion", "assets/explosions/asset-pack-explosion.json");
		this.load.pack("asset-pack", "assets/asset-pack.json");
		this.load.pack("comet-pck", "assets/comet/comet-pck.json");
	}

	/** @returns {void} */
	editorCreate() {

		// ground
		const ground = this.add.tilemap("ground");
		ground.addTilesetImage("Ground", "Green moss and rocky walls");
		ground.addTilesetImage("Fantascienza", "level_tileset");

		// background
		const background = this.add.image(402, 296, "background");
		background.scaleX = 1.0355335402542793;
		background.scaleY = 1.0606516381679638;

		// rectangle_3
		const rectangle_3 = this.add.rectangle(382, 593, 128, 128);
		rectangle_3.scaleX = 9.940350319351483;
		rectangle_3.scaleY = 0.8373843093799873;
		rectangle_3.isFilled = true;
		rectangle_3.fillColor = 3085824;

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
		const player = this.physics.add.sprite(439, 487, "ship", 0);
		player.scaleX = 1.5;
		player.scaleY = 1.5;
		player.body.setSize(66, 66, false);

		// Date
		const date = this.add.text(30, 42, "", {});
		date.text = "New text";

		// life
		const life = this.add.text(655, 34, "", {});
		life.text = "Vita";

		// lifeLabel
		const lifeLabel = this.add.text(496, 34, "", {});
		lifeLabel.text = "SCP-2000 Charge:";

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

		this.rectangle_1 = rectangle_1;
		this.arcadesprite_1 = arcadesprite_1;
		this.player = player;
		this.date = date;
		this.life = life;
		this.rectangle_2 = rectangle_2;
		this.text_1 = text_1;
		this.ground = ground;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }} */
	rectangle_1;
	/** @type {Phaser.Physics.Arcade.Sprite} */
	arcadesprite_1;
	/** @type {Phaser.Physics.Arcade.Sprite} */
	player;
	/** @type {Phaser.GameObjects.Text} */
	date;
	/** @type {Phaser.GameObjects.Text} */
	life;
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
    speed = 300;
	dashSpeed = 1000;
	slowSpeed = 300;
    cursors = undefined;
    enemies = undefined;
    enemySpeed = 60;
    lasers = undefined;
    lastFired = 0;
    spaceBar = undefined;

	showEndScreen(message) {
		this.arcadesprite_1.destroy();
		this.rectangle_2.visible = true;
		this.text_1.visible = true;
		if (message)
		this.text_1.text = message;
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		this.text_1.x = screenCenterX;
		this.text_1.y = screenCenterY;
		this.text_1.setOrigin(0.5)
		this.enemies.setActive(false).setVisible(false);
		this.player.setActive(false).setVisible(false);
		this.lasers.setActive(false).setVisible(false);
		setTimeout(() => {
			this.scene.start(Level.name, {gameOver: false, partialScore: 123}); // fixme
		},3000)
	}

	onMeteorCollision(){
		this.showEndScreen("[Data Lost]")
	}

	create() {
		const actualDate = this.dates[this.getRandomInt(0,this.dates.length)];
		this.editorCreate();
		this.life.text = "0%";
		const iteration = sessionStorage.getItem("iteration")||0;
		this.speed = this.speed + 20*iteration;
		const cometVelocity = (10);
		this.enemySpeed = this.enemySpeed + 20*iteration;
		sessionStorage.setItem("iteration",+iteration + 1)
		this.date.text = actualDate;
		this.arcadesprite_1.body.velocity.y = cometVelocity;
		this.arcadesprite_1.body.maxSpeed = cometVelocity;
		this.player = this.createPlayer();
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		// i think theres a way to add callbacks somewhere
		// this.D.addCallbacks(this, null, null, ()=>{console.log('hey')});
		// this.cursors.shift.onDown(() => {
		//   this.speed = this.dashSpeed;
		//   console.log(this.speed)
		//   setTimeout( () => {this.speed = this.slowSpeed}, 100);
		// });
		this.enemies = this.physics.add.group({
			classType: FallingObject,
			maxSize: 100,
			runChildUpdate: true
		  });
		  const delay = 500 - 50*iteration;
		  this.time.addEvent({
			delay: delay > 0 ? delay : 10,
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

		  this.physics.add.overlap(
			this.rectangle_1,
			this.enemies,
			this.decreaseEnergy,
			null,
			this
		  );

		  const accumulation =  2000 - iteration*100

		  const computeEnergy =  ()  => {
			if (this.rectangle_2.visible)
			return;
			this.life.text = (+this.life.text + 5)+"%";
			if (this.life.text > 100)
			this.win()
		  }

		  this.time.addEvent({
			delay: accumulation > 200 ? accumulation:  200,
			callback: computeEnergy,
			callbackScope: this,
			loop: true
		  });
	}

	win() {
		this.showEndScreen("You have been able to charge SCP-2000 In time, humanity is saved")
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
		if (this.cursors.left.isDown || this.A.isDown) {
		  this.player.setVelocityX(this.speed * -1);
		  this.player.anims.play("left", true);
		  this.player.setFlipX(false);
		} else if (this.cursors.right.isDown || this.D.isDown) {
		  this.player.setVelocityX(this.speed);
		  this.player.anims.play("right", true);
		  this.player.setFlipX(true);
		} else {
		  this.player.setVelocityX(0);
		  this.player.anims.play("turn");
		}

		if ((this.shoot || this.spaceBar.isDown) && time > this.lastFired) {
		  const laser = this.lasers.get(0, 0, "laser");

		  if (laser && !this.rectangle_2.visible) {
			laser.fire(this.player.x, this.player.y);
			this.lastFired = time + 150;
		  }
		}
	  }

	  handleDash(){
	  // check if the shift key is held down
	  if (this.cursors.shift.isDown) {
	  this.speed = this.dashSpeed;
	  // setTimeout( () => {this.speed = this.slowSpeed}, 100);
		} else if (this.cursors.shift.isUp) {
			this.speed = this.slowSpeed;
		}
	  }

	  generateEnemy() {
		const config = {
			speed: this.enemySpeed,
			rotation: 0.01
		  };

		  // @ts-ignore
		  const enemy = this.enemies.get(0, 0, "animated_asteroid", config);
		  const enemyWidth = enemy?.displayWidth;
		  const positionX = Phaser.Math.Between(
			enemyWidth,
			this.scale.width - enemyWidth
		  );

		  if (enemy) {
			enemy.spawn(positionX);
		  }
	  }

	  spawnEnemy() {
		this.generateEnemy()
	  }

	  hitEnemy(laser, enemy) {
		laser.erase();
		enemy.explode();

		console.log("bang!")
	  }

	update(time) {
		this.handleDash();
		this.movePlayer(this.player, time);
	  }

	  decreaseLife(player, enemy) {
		enemy.explode();
		const life = +this.life.text.replace("%","")
		if (life > 0)
			this.life.text = (life - 5)+"%";
	  }

	  decreaseEnergy(player, enemy) {
		enemy.explode();
		const life = +this.life.text.replace("%","")
		if (life > 0)
		this.life.text = (life - 5)+"%";
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
