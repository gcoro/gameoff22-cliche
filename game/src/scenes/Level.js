
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

		// background_scifi_interior
		const background_scifi_interior = this.add.image(392, 236, "background_scifi_interior");
		background_scifi_interior.scaleX = 3.961963856772153;
		background_scifi_interior.scaleY = 4.659316663023215;

		// door_blue
		const door_blue = this.add.image(616, 406, "door_blue");
		door_blue.scaleX = 2.0268395681818867;
		door_blue.scaleY = 2.094852315770696;

		// back_structures
		const back_structures = this.add.image(451, 262, "back-structures");
		back_structures.scaleX = 2.490125549146286;
		back_structures.scaleY = 3.1615983195492015;

		// floor
		/** @type {Phaser.GameObjects.Image & { body: Phaser.Physics.Arcade.Body }} */
		const floor = this.add.image(399, 527, "pavement_full");
		floor.scaleX = 1.2962686223732702;
		this.physics.add.existing(floor, false);
		floor.body.moves = false;
		floor.body.allowGravity = false;
		floor.body.setOffset(0, 17);
		floor.body.setSize(726, 141, false);

		// armor_idle_1
		/** @type {Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body }} */
		const armor_idle_1 = this.add.sprite(168, 379, "armor_idle_1");
		armor_idle_1.scaleX = 0.3495787233586669;
		armor_idle_1.scaleY = 0.28154832380997097;
		this.physics.add.existing(armor_idle_1, false);
		armor_idle_1.body.velocity.x = 70;
		armor_idle_1.body.velocity.y = 70;
		armor_idle_1.body.bounce.x = 1;
		armor_idle_1.body.bounce.y = 1;
		armor_idle_1.body.collideWorldBounds = true;
		armor_idle_1.body.setOffset(-77, 0);
		armor_idle_1.body.setSize(366, 427, false);

		// collider
		this.physics.add.collider(armor_idle_1, floor);

		// door_blue (components)
		const door_bluePushOnClick = new PushOnClick(door_blue);
		door_bluePushOnClick.sceneToStartKey = "scp173";

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
