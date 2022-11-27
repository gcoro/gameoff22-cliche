<<<<<<< HEAD

window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 800,
		height: 600,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: "arcade"
		}
	});
	
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Meteor", Meteor);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
	}
}
=======
let game

window.addEventListener("load", function () {
    game = new Phaser.Game({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
            },
        },
    })

    game.scene.add("Preload", Preload)
    game.scene.add("Level", Level)
    game.scene.add("Menu", Menu)
    game.scene.add("Scp173", Scp173)
    game.scene.add("AfterGameTransition", AfterGameTransition)
    game.scene.add("Boot", Boot, true)
})

class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/preload-asset-pack.json")
        this.load.json("strings", "assets/strings.json")

        this.load.on(Phaser.Loader.Events.COMPLETE, () =>
            this.scene.start("Preload")
        )
    }
}
>>>>>>> c6e02c0eb2aa39ff395f771bc134583589cb9cad
