
// You can write more code here

/* START OF COMPILED CODE */

class GameOver extends Phaser.Scene {

	constructor() {
		super("GameOver");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// background
		this.add.image(442, 188, "background");

		// guapen
		const guapen = this.add.image(612, 236, "guapen");

		// guapen (components)
		const guapenPushOnClick = new PushOnClick(guapen);
		guapenPushOnClick.sceneToStartKey = "Level";

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	// score to show
	score

	create() {
		this.editorCreate();
	}

	init(data) {
		console.log('game over', data)

		this.score = data.totalScore

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
