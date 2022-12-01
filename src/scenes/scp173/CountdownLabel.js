import Phaser from "phaser"

export class CountdownLabel extends Phaser.GameObjects.Text {
    constructor(scene, x, y, templateString) {
        const style = {
            fixedWidth: 700,
            fixedHeight: 30,
            fontSize: "24px",
            fill: "white",
            backgroundColor: "black",
            align: "center",
        }
        super(scene, x, y, "", style)
        this.setPadding(0, 4)
        this.alpha = 0.6
        this.setDepth(8)
        this.setScrollFactor(0)
        this.templateString = templateString
        this.scene.add.existing(this)
    }

    setValue(data) {
        if (data > 0) {
            this.setVisible(true)
            this.setText(this.templateString.replace("%s", data))
        } else {
            this.setVisible(false)
            this.setText("")
        }
    }
}
