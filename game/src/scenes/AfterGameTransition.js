class AfterGameTransition extends Phaser.Scene {
	constructor() {
		super("AfterGameTransition");
	}

	init() {}

	preload() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		const completedText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Game completed!',
			style: {
				font: '30px monospace',
				fill: '#ffffff'
			}
		});

		completedText.setOrigin(0.5, 0.5);

		const messageText = this.make.text({
			x: width / 2,
			y: height / 2,
			text: 'Now back to the main story...',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});

		messageText.setOrigin(0.5, 0.5);
	}

	create() {
		this.triggerTimer = this.time.addEvent({
            callback: this.backToMainScene,
            callbackScope: this,
            delay: 1000 * 5, // 1000 = 1 second -> 1 min
            loop: true
        });
    }

	backToMainScene(){
		this.scene.start('Preload');
	}

	update(){}
}