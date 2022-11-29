class CountdownController {
    constructor(scene) {
        this.scene = scene

        const timerLabel = this.scene.add.text(
            scene.cameras.main.worldView.width - 120,
            30,
            `00:00`,
            {
                fixedWidth: 120,
                fixedHeight: 40,
                fontSize: "32px",
                fill: "black",
                backgroundColor: "white",
                align: "center",
            }
        )
        timerLabel.setPadding(0, 6)
        timerLabel.setScrollFactor(0)
        timerLabel.setDepth(7)
        timerLabel.alpha = 0.4

        this.label = timerLabel

        this.eventEmitter = EventDispatcher.getInstance()
        this.eventEmitter.once(SCENE_EVENTS.GAME_OVER, () => {
            try {
                this.label.text = "00:00"
                this.stop()
            } catch (exc) {
                // hack to avoid to break it
            }
        })
    }

    start(duration) {
        this.duration = duration

        this.timerEvent = this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.label.text = "00:00"
                this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
            },
        })
    }

    stop() {
        if (this.timerEvent) {
            this.timerEvent.destroy()
            this.timerEvent = undefined
        }
    }

    update() {
        if (!this.timerEvent || this.duration <= 0) {
            return
        }

        const elapsed = this.timerEvent.getElapsed()
        const remaining = this.duration - elapsed
        const seconds = Math.floor(remaining / 1000)
        this.label.text = this.formatTime(seconds)
    }

    hide() {
        this.label.setActive(false).setVisible(false)
    }

    show() {
        this.label.setActive(true).setVisible(true)
    }

    formatTime(seconds) {
        // Minutes
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")
        // Seconds
        let partInSeconds = seconds % 60
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2, "0")
        // Returns formated time
        return `${minutes}:${partInSeconds}`
    }
}
