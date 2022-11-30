
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

		// menu
		const menu = this.add.image(403, 303, "menu");
		menu.scaleX = 0.6247507816474632;
		menu.scaleY = 0.620708002526914;

		// sTART
		const sTART = this.add.image(528, 282, "START");
		sTART.scaleX = 0.430575587907373;
		sTART.scaleY = 0.44385729973978577;

		// iNSTRUCTIONS
		const iNSTRUCTIONS = this.add.image(583, 377, "INSTRUCTIONS");
		iNSTRUCTIONS.scaleX = 0.42816716827252266;
		iNSTRUCTIONS.scaleY = 0.4809246572773558;

		// sTART (components)
		const sTARTPushOnClick = new PushOnClick(sTART);
		sTARTPushOnClick.sceneToStartKey = "Level";

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
