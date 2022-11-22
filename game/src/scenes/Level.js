
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */

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

		// door0
		const door0 = this.add.image(208, 406, "door0");
		door0.scaleX = 2.0268395681818867;
		door0.scaleY = 2.094852315770696;

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
		armor_idle_1.body.setOffset(-150, 414);
		armor_idle_1.body.setSize(500, 3.6601282095296224, false);

		// collider
		this.physics.add.collider(armor_idle_1, floor);

		// door_blue (components)
		const door_bluePushOnClick = new PushOnClick(door_blue);
		door_bluePushOnClick.sceneToStartKey = "scp173";

		// door0 (components)
		const door0PushOnClick = new PushOnClick(door0);
		door0PushOnClick.sceneToStartKey = "scp5153";

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

	// user strings
	strings = {};

	// enabled scp ('scp173', 'scp5153' or null)
	activeScp = null

	// last bubble (contains reference to the objects)
	lastBubble = {
		bubble: null,
		text: null
	}

	create() {
		this.editorCreate();
		this.armor_idle_1
		this.armor_idle_1.body.onWorldBounds = true;
		this.physics.world.on('worldbounds', this.onWorldBounds, this)
		this.strings = this.cache.json.get('strings');

		setTimeout(() => {
			this.initAlienInteraction();
		}, 3000)
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
		animTurn.animationKey = "armor_turn_reverse";
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

	initAlienInteraction() {
		// stops
		this.armor_idle_1.anims.pause()
		this.armor_idle_1.body.velocity.x = 0;
		// sets turn animation
		const animTurn = new StartAnimation(this.armor_idle_1);
		animTurn.animationKey = "armor_turn_reverse";
		animTurn.gameObject.on("animationcomplete", () => {
			// sets idle animation
			const animIdle = new StartAnimation(this.armor_idle_1);
			animIdle.animationKey = "armor_idle";

			setTimeout(() => {
				this.talk();
			}, 500);
		});
	}

	talk() {
		const index = 0;
		const discourse = [
			this.strings.alienIntro1, this.strings.alienIntro2, this.strings.alienIntro3, this.strings.alienEnableMinigame];

		this.createSpeechBubble(discourse[index], null, null, 400, 50);

		this.input.once("pointerdown", () => { // tap anywhere in the scene
			this.nextLine(discourse, index + 1);
		})
	}

	nextLine(discourse, index) {
		this.lastBubble.bubble?.destroy()
		this.lastBubble.text?.destroy()

		if (discourse[index]) {
			if (discourse[index] === this.strings.alienEnableMinigame) {
				const scp = 'scp173'; // todo randomize scp
				this.activeScp = scp;
				discourse[index] = this.strings.alienEnableMinigame + scp;
			}

			this.createSpeechBubble(discourse[index], null, null, 400, 50);

			if (index + 1 !== discourse.length) { // not last element
				this.input.once("pointerdown", () => { // tap anywhere in the scene
					this.nextLine(discourse, index + 1);
				})
			} else { // destroy last bubble
				this.lastBubble.bubble?.destroy()
				this.lastBubble.text?.destroy()
			}
		}
	}

	createSpeechBubble(quote, x, y, width, height,) {
		// default position is on top of sprite
		if (!x) x = this.armor_idle_1.body.position.x + this.armor_idle_1.body.halfWidth;
		if (!y) y = this.armor_idle_1.body.position.y - this.armor_idle_1.body.halfHeight;

		var bubbleWidth = width;
		var bubbleHeight = height;
		var bubblePadding = 10;
		var arrowHeight = bubbleHeight / 4;

		var bubble = this.armor_idle_1.scene.add.graphics({ x: x, y: y });

		//  Bubble shadow
		bubble.fillStyle(0x222222, 0.5);
		bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

		//  Bubble color
		bubble.fillStyle(0xffffff, 1);

		//  Bubble outline line style
		bubble.lineStyle(4, 0x565656, 1);

		//  Bubble shape and outline
		bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
		bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

		//  Calculate arrow coordinates
		var point1X = Math.floor(bubbleWidth / 7);
		var point1Y = bubbleHeight;
		var point2X = Math.floor((bubbleWidth / 7) * 2);
		var point2Y = bubbleHeight;
		var point3X = Math.floor(bubbleWidth / 7);
		var point3Y = Math.floor(bubbleHeight + arrowHeight);

		//  Bubble arrow shadow
		bubble.lineStyle(4, 0x222222, 0.5);
		bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

		//  Bubble arrow fill
		bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
		bubble.lineStyle(2, 0x565656, 1);
		bubble.lineBetween(point2X, point2Y, point3X, point3Y);
		bubble.lineBetween(point1X, point1Y, point3X, point3Y);

		var content = this.armor_idle_1.scene.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
	
		var b = content.getBounds();

		content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

		this.lastBubble.bubble = bubble
		this.lastBubble.text = content

	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
