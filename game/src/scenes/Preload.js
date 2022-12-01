
// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
		this.load.pack("asset-pack-explosion", "assets/explosions/asset-pack-explosion.json");
		this.load.pack("comet-pck", "assets/comet/comet-pck.json");
	}

	/** @returns {void} */
	editorCreate() {

		// progress
		const progress = this.add.text(435, 351, "", {});
		progress.setOrigin(0.5, 0.5);
		progress.text = "0%";
		progress.setStyle({ "fontSize": "30px" });

		// alien
		const alien = this.add.image(286, 345, "alien_preload");
		alien.scaleX = 0.23840287175498232;
		alien.scaleY = 0.23265305872685693;

		// progress (components)
		new PreloadText(progress);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	preload() {

		this.editorCreate();
		this.editorPreload();

		//TODO: put back main scene
		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Menu"));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
