import Phaser from "phaser"
import { PreloadText } from "../components/PreloadText"
// You can write more code here

/* START OF COMPILED CODE */

export class Preload extends Phaser.Scene {
    constructor() {
        super("Preload")

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    /** @returns {void} */
    editorPreload() {
        this.load.pack("asset-pack", "assets/asset-pack.json")

        // scp 5153
        this.load.pack(
            "asset-pack-explosion",
            "assets/explosions/asset-pack-explosion.json"
        )
        this.load.pack("comet-pck", "assets/comet/comet-pck.json")

        // scp 173
        this.load.image("base_tiles", "assets/scp173/level_tileset.png")

        this.load.image("poor", "assets/scp173/poor/splat.png")

        this.load.atlas(
            "skull",
            "assets/scp173/blood/blood.png",
            "assets/scp173/blood/blood.json"
        )

        //poops
        this.load.atlas(
            "throw_poor",
            "assets/scp173/poor/poops.png",
            "assets/scp173/poor/poops.json"
        )

        //player allies
        this.load.atlas(
            "alien_ally",
            "assets/scp173/alien_ally.png",
            "assets/scp173/alien_ally.json"
        )

        //player
        this.load.atlas(
            "alien",
            "assets/scp173/alien_repack.png",
            "assets/scp173/alien_repack.json"
        )

        //enemy
        this.load.atlas(
            "enemy",
            "assets/scp173/eye_monster/covid_spritesheet.png",
            "assets/scp173/eye_monster/covid_spritesheet.json"
        )

        //exit door
        this.load.atlas(
            "exit_door",
            "assets/scp173/door.png",
            "assets/scp173/door.json"
        )
    }

    /** @returns {void} */
    editorCreate() {
        // progress
        const progress = this.add.text(435, 351, "", {})
        progress.setOrigin(0.5, 0.5)
        progress.text = "0%"
        progress.setStyle({ fontSize: "30px" })

        // alien
        const alien = this.add.image(286, 345, "alien_preload")
        alien.scaleX = 0.23840287175498232
        alien.scaleY = 0.23265305872685693

        // progress (components)
        new PreloadText(progress)

        this.events.emit("scene-awake")
    }

    /* START-USER-CODE */

    // Write your code here

    preload() {
        this.editorCreate()
        this.editorPreload()

        //TODO: put back main scene
        this.load.on(Phaser.Loader.Events.COMPLETE, () =>
            this.scene.start("Menu")
        )
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
