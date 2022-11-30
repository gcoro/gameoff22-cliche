
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
		this.add.image(399, 305, "background");

		// guapen
		const guapen = this.add.image(612, 236, "guapen");

		// scp5153
		const scp5153 = this.add.text(56, 519, "", {});
		scp5153.scaleX = 2.3;
		scp5153.scaleY = 2.2;
		scp5153.text = "> SCP-5153";
		scp5153.setStyle({ "fontFamily": "Audiowide" });

		// scp173
		const scp173 = this.add.text(56, 474, "", {});
		scp173.scaleX = 2.3;
		scp173.scaleY = 2.2;
		scp173.text = "> SCP-173";
		scp173.setStyle({ "fontFamily": "Audiowide" });

		// labelReadAbout
		const labelReadAbout = this.add.text(56, 426, "", {});
		labelReadAbout.scaleX = 2.3;
		labelReadAbout.scaleY = 2.2;
		labelReadAbout.text = "More info:";
		labelReadAbout.setStyle({ "fontFamily": "Audiowide" });

		// guapen (components)
		const guapenPushOnClick = new PushOnClick(guapen);
		guapenPushOnClick.sceneToStartKey = "Level";

		// scp5153 (components)
		const scp5153PushOnClick = new PushOnClick(scp5153);
		scp5153PushOnClick.sceneToStartKey = "url_5153";

		// scp173 (components)
		const scp173PushOnClick = new PushOnClick(scp173);
		scp173PushOnClick.sceneToStartKey = "url_173";

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();
		window.iteration = 0;
	}

	init(data) {
		console.log('totalScore', data?.totalScore)

		// totalScoreLabel
		const totalScoreLabel = this.add.text(292, 250, "", {});
		totalScoreLabel.scaleX = 8.05431924021206;
		totalScoreLabel.scaleY = 6.081476326303379;
		totalScoreLabel.text = data.totalScore
		totalScoreLabel.setStyle({ "align": "center", "fontFamily": "Audiowide", "fontStyle": "bold" });

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
