class CountdownController {
    constructor(scene) {
        this.scene = scene

        const timerLabel = this.scene.add.text(
            this.scene.mapWidth / 2 - 75,
            30, 
            `00:00`, 
            { 
                fixedWidth: 120, 
                fixedHeight: 40, 
                fontSize: '32px', 
                fill: 'black', 
                backgroundColor: 'white',
                align: 'center'
            })
        timerLabel.setPadding(0,6)
        timerLabel.setScrollFactor(0)
        timerLabel.setDepth(7)
        timerLabel.alpha = 0.4

        this.label = timerLabel
    }

	start(callback, duration)
	{
		this.stop()

		this.finishedCallback = callback
		this.duration = duration

		this.timerEvent = this.scene.time.addEvent({
			delay: duration,
			callback: () => {
				this.label.text = '00:00'
				this.stop()
				
				if (callback){
					callback()
				}
			}
		})
	}

	stop(){
		if (this.timerEvent){
			this.timerEvent.destroy()
			this.timerEvent = undefined
		}
	}

	update(){
		if (!this.timerEvent || this.duration <= 0){
			return
		}

		const elapsed = this.timerEvent.getElapsed()
		const remaining = this.duration - elapsed
		const seconds = Math.floor(remaining / 1000)
		this.label.text = this.formatTime(seconds)
	}

    formatTime(seconds){
        // Minutes
        const minutes = Math.floor(seconds/60).toString().padStart(2,'0');
        // Seconds
        let partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }
}
