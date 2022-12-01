import Phaser from "phaser"

export class MissingEscrements extends Phaser.GameObjects.Text {
    constructor(scene, x, y, score) {
        const style = {
            fixedWidth: 500,
            fixedHeight: 30,
            fontSize: "24px",
            fill: "white",
            backgroundColor: "black",
            align: "center",
        }
        super(scene, x, y, "", style)
        this.setPadding(0, 4)
        this.score = score
        this.alpha = 0.6
        this.setDepth(8)
        this.setScrollFactor(0)
        this.setVisible(false)

        this.scene.add.existing(this)
    }

    formatData(data) {
        return `Still ${data} feces and blood to clean`
    }

    setData(data) {
        if (data === 0) this.style.fixedWidth = 400
        else this.style.fixedWidth = 500
        this.setText(
            data === 0 ? "Run to the door to exit" : this.formatData(data)
        )
        if (data === 0) {
            const music = this.scene.sound.add("win_sound")
            music.play()
        }
    }
}
