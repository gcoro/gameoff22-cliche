
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class PushOnClick extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__PushOnClick"] = this;

		/* START-USER-CTR-CODE */

		/* END-USER-CTR-CODE */
	}

	/** @returns {PushOnClick} */
	static getComponent(gameObject) {
		return gameObject["__PushOnClick"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	/** @type {string} */
	sceneToStartKey = "";

	/* START-USER-CODE */

	awake() {
		if (this.sceneToStartKey) {
			this.gameObject.setInteractive().on("pointerdown", () => {
				if (this.scene.activeScp === this.sceneToStartKey) {
					console.log('start scene', this.sceneToStartKey)
					// todo switch scene
					// () => this.scene.start("scena"))
				} else {
					// do nothing
					console.log('scp not enabled')
				}
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
