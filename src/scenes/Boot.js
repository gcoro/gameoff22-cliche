import Phaser from "phaser"

export class Boot extends Phaser.Scene {
    preload() {
        this.load.pack("pack", "assets/preload-asset-pack.json")
        this.load.json("strings", "assets/strings.json")

        this.load.on(Phaser.Loader.Events.COMPLETE, () =>
            this.scene.start("Preload")
        )
    }
}
