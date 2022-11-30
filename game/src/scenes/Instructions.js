
// You can write more code here

/* START OF COMPILED CODE */

class Instructions extends Phaser.Scene {

	constructor() {
		super("Instructions");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// porte
		const porte = this.add.image(404, 305, "porte");
		porte.scaleX = 0.10330948278164731;
		porte.scaleY = 0.11025782874521506;

		// about
		const about = this.add.image(408, 294, "about");
		about.scaleX = 0.1945529608050578;
		about.scaleY = 0.19679084024642202;

		// sKIP
		const sKIP = this.add.image(745, 490, "SKIP");
		sKIP.scaleX = 0.5250938221939377;
		sKIP.scaleY = 0.4758199030761969;

		// sKIP (components)
		const sKIPPushOnClick = new PushOnClick(sKIP);
		sKIPPushOnClick.sceneToStartKey = "Menu";

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
