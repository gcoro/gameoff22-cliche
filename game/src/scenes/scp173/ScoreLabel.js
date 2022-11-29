const formatScore = (score) => `Score: ${score}`

class ScoreLabel extends Phaser.GameObjects.Text {
    constructor(scene, x, y, score) {
        const style = {
            fixedWidth: 200,
            fixedHeight: 30,
            fontSize: "24px",
            fill: "white",
            backgroundColor: "black",
            align: "center",
        }
        super(scene, x, y, formatScore(score), style)
        this.setPadding(0, 4)
        this.score = score
        this.alpha = 0.6
        this.setDepth(8)
        this.setScrollFactor(0)

        this.scene.add.existing(this)
    }

    setScore(score) {
        this.score = score
        this.updateScoreText()
    }

    add(points) {
        this.setScore(this.score + points)
    }

    updateScoreText() {
        this.setText(formatScore(this.score))
    }

    getScore() {
        return this.score
    }
}
