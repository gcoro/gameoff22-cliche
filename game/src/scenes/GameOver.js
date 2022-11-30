
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

		// gameover
		const gameover = this.add.image(396, 301, "gameover");
		gameover.scaleX = 0.1932161208510199;
		gameover.scaleY = 0.19119029385330585;

		// scp5153
		const scp5153 = this.add.text(56, 519, "", {});
		scp5153.scaleX = 0.3760838598274091;
		scp5153.scaleY = 0.3716149444636929;
		scp5153.text = "> SCP-5153";
		scp5153.setStyle({ "fontFamily": "Audiowide", "fontSize": "100px" });

		// scp173
		const scp173 = this.add.text(56, 477, "", {});
		scp173.scaleX = 0.3840085700348167;
		scp173.scaleY = 0.36339845822816014;
		scp173.text = "> SCP-173";
		scp173.setStyle({ "fontFamily": "Audiowide", "fontSize": "100px" });

		// labelReadAbout
		const labelReadAbout = this.add.text(56, 441, "", {});
		labelReadAbout.scaleX = 0.3441871684140159;
		labelReadAbout.scaleY = 0.33239186084327976;
		labelReadAbout.text = "More info:";
		labelReadAbout.setStyle({ "fontFamily": "Audiowide", "fontSize": "100px" });

		// tRY_AGAIN
		const tRY_AGAIN = this.add.image(619, 423, "TRY_AGAIN");
		tRY_AGAIN.scaleX = 0.47737796937816135;
		tRY_AGAIN.scaleY = 0.48460807997325583;

		// scp5153 (components)
		const scp5153PushOnClick = new PushOnClick(scp5153);
		scp5153PushOnClick.sceneToStartKey = "url_5153";

		// scp173 (components)
		const scp173PushOnClick = new PushOnClick(scp173);
		scp173PushOnClick.sceneToStartKey = "url_173";

		// tRY_AGAIN (components)
		const tRY_AGAINPushOnClick = new PushOnClick(tRY_AGAIN);
		tRY_AGAINPushOnClick.sceneToStartKey = "Level";

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
		const totalScoreLabel = this.add.text(375, 215, "", {});
		totalScoreLabel.scaleX = 0.5;
		totalScoreLabel.scaleY = 0.41445688211003173;
		totalScoreLabel.text = data?.totalScore
		totalScoreLabel.setStyle({ "align": "center", "fontFamily": "Audiowide", "fontSize": "150px", "fontStyle": "bold" });

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
