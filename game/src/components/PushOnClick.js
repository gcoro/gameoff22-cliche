
// You can write more code here

/* START OF COMPILED CODE */

class PushOnClick extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__PushOnClick"] = this;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {PushOnClick} */
	static getComponent(gameObject) {
		return gameObject["__PushOnClick"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;

	/* START-USER-CODE */

	awake() {

		this.gameObject.setInteractive().on("pointerdown", () => {
			// stops
			this.gameObject.anims.pause()
            this.gameObject.body.velocity.x = 0;
			// sets turn animation
			const animTurn = new StartAnimation(this.gameObject);
			animTurn.animationKey = "armor_turn_reverse";
			animTurn.gameObject.on("animationcomplete", () => {
				// sets idle animation
				const animIdle = new StartAnimation(this.gameObject);
				animIdle.animationKey = "armor_idle";
			})
		
			// todo inizia a parlare
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
