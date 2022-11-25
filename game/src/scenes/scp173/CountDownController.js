class CountdownController {
    constructor(scene, label) {
		this.scene = scene
		this.label = label
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
