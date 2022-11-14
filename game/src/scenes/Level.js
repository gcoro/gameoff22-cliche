
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// armor_idle_1
		/** @type {Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }} */
		const armor_idle_1 = this.add.sprite(168, 407, "armor_idle_1");
		armor_idle_1.scaleX = 0.3495787233586669;
		armor_idle_1.scaleY = 0.28154832380997097;
		this.physics.add.existing(armor_idle_1, false);
		armor_idle_1.body.velocity.x = 70;
		armor_idle_1.body.velocity.y = 70;
		armor_idle_1.body.bounce.x = 1;
		armor_idle_1.body.bounce.y = 1;
		armor_idle_1.body.collideWorldBounds = true;
		armor_idle_1.body.setOffset(-97, -2);
		armor_idle_1.body.setSize(407, 425, false);

		// checkered_floor_4327693_640
		/** @type {Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body }} */
		const checkered_floor_4327693_640 = this.add.image(410, 425, "checkered-floor-4327693_640");
		checkered_floor_4327693_640.scaleX = 1.2480388707092542;
		this.physics.add.existing(checkered_floor_4327693_640, false);
		checkered_floor_4327693_640.body.moves = false;
		checkered_floor_4327693_640.body.allowGravity = false;
		checkered_floor_4327693_640.body.setOffset(-115, 356);
		checkered_floor_4327693_640.body.setSize(1319.8097947499032, 360, false);

		// collider
		this.physics.add.collider(armor_idle_1, checkered_floor_4327693_640);

		// armor_idle_1 (components)
		const armor_idle_1StartAnimation = new StartAnimation(armor_idle_1);
		armor_idle_1StartAnimation.animationKey = "armor_walk";
		new PushOnClick(armor_idle_1);

		this.armor_idle_1 = armor_idle_1;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }} */
	armor_idle_1;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();
		this.armor_idle_1
		this.armor_idle_1.body.onWorldBounds = true;
		this.physics.world.on('worldbounds', this.onWorldBounds, this)
	}
	originalVelocity;
	isAnimatingTurn = false;
	onWorldBounds(body, up, down, left, right) {
		if (this.isAnimatingTurn)
		return;
		this.isAnimatingTurn = true;
		// stops
		this.armor_idle_1.anims.pause()
		this.originalVelocity = this.armor_idle_1.body.velocity.x || this.originalVelocity;
		this.armor_idle_1.body.velocity.x = 0;
		// sets turn animation
		const animTurn = new StartAnimation(this.armor_idle_1);
		animTurn.animationKey = "armor_turn_reverse" ;
		animTurn.gameObject.once("animationcomplete", () => {
			if (right) {
				this.armor_idle_1.flipX = true;
			}
			if (left) {
				this.armor_idle_1.flipX = false;
			}
			const animTurn2 = new StartAnimation(this.armor_idle_1);
			animTurn2.animationKey = "armor_turn";
			animTurn2.gameObject.once("animationcomplete", () => {
				this.armor_idle_1.anims.play("armor_walk")
				this.armor_idle_1.body.velocity.x = this.originalVelocity;
				this.isAnimatingTurn = false;
			})
		})

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
