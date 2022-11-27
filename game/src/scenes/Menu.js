
// You can write more code here

/* START OF COMPILED CODE */

class Menu extends Phaser.Scene {

	constructor() {
		super("Menu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// background_scifi_interior
		this.add.image(465, 145, "background_scifi_interior");

		// guapen
		const guapen = this.add.image(567, 326, "guapen");

		// guapen (components)
		const guapenPushOnClick = new PushOnClick(guapen);
		guapenPushOnClick.sceneToStartKey = "Level";

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
