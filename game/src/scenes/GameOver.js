
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

		// scp173
		const scp173 = this.add.image(470, 520, "scp173");
		scp173.scaleX = 1.4;
		scp173.scaleY = 1.5;

		// scp5153
		const scp5153 = this.add.image(655, 520, "scp5153");
		scp5153.scaleX = 1.4;
		scp5153.scaleY = 1.5;

		// guapen (components)
		const guapenPushOnClick = new PushOnClick(guapen);
		guapenPushOnClick.sceneToStartKey = "Level";

		// scp173 (components)
		const scp173PushOnClick = new PushOnClick(scp173);
		scp173PushOnClick.sceneToStartKey = "url_173";

		// scp5153 (components)
		const scp5153PushOnClick = new PushOnClick(scp5153);
		scp5153PushOnClick.sceneToStartKey = "url_5153";

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
