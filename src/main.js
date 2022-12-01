import Phaser from "phaser"

import { Boot } from "./scenes/Boot"
import { Preload } from "./scenes/Preload"
import { Menu } from "./scenes/Menu"
import { Level } from "./scenes/Level"
import { Meteor } from "./scenes/Meteor"
import { Scp173 } from "./scenes/scp173/Scp173"
import { GameOver } from "./scenes/GameOver"
import { Instructions } from "./scenes/Instructions"
// switch off bg music
window.musicActive = true

window.addEventListener("load", function () {
    window.game = new Phaser.Game({
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
                debug: false,
            },
        },
        scene: [
            Boot,
            Preload,
            Menu,
            Level,
            Meteor,
            Scp173,
            GameOver,
            Instructions,
        ],
    })

    window.game.scene.start("Boot")

    /*window.game.scene.add("Boot", Boot, true)
    window.game.scene.add("Preload", Preload)
    window.game.scene.add("Level", Level)
    /*
    window.game.scene.add("Meteor", Meteor)
    window.game.scene.add("Menu", Menu)
    window.game.scene.add("Scp173", Scp173)
    window.game.scene.add("GameOver", GameOver)
    window.game.scene.add("Instructions", Instructions)
    
    */
})
