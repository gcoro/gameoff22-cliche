const formatScore = (score) => `Score: ${score}`

class ScoreLabel extends Phaser.GameObjects.Text
{
	constructor(scene, x, y, score)
	{
        const style = { 
            fixedWidth: 200, 
            fixedHeight: 40, 
            fontSize: '24px', 
            fill: 'white', 
            backgroundColor: 'black',
            align: 'center'
        }
		super(scene, x, y, formatScore(score), style)
        this.setPadding(0,8)
		this.score = score
        this.alpha = 0.6;
        this.scene.add.existing(this)
        this.setScrollFactor(0)
	}

	setScore(score) {
		this.score  = score
		this.updateScoreText()
	}

	add(points){
		this.setScore(this.score + points)
	}

	updateScoreText(){
		this.setText(formatScore(this.score))
	}
}