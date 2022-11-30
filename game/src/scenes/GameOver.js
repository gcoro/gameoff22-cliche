
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
		const labelReadAbout = this.add.text(56, 428, "", {});
		labelReadAbout.scaleX = 0.44077484023557145;
		labelReadAbout.scaleY = 0.4272955886621027;
		labelReadAbout.text = "More info:";
		labelReadAbout.setStyle({ "fontFamily": "Audiowide", "fontSize": "100px" });

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
		totalScoreLabel.scaleX = 0.8212460957415846;
		totalScoreLabel.scaleY = 0.632575333378406;
		totalScoreLabel.text = data?.totalScore;
		totalScoreLabel.setStyle({ "align": "center", "fontFamily": "Audiowide", "fontSize": "150px", "fontStyle": "bold" });

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
