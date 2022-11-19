
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class PushOnClick extends UserComponent {

	constructor(gameObject) {
		super(gameObject);

		this.gameObject = gameObject;
		gameObject["__PushOnClick"] = this;

		/* START-USER-CTR-CODE */
		
		this.strings = this.scene.cache.json.get('strings');

		/* END-USER-CTR-CODE */
	}

	/** @returns {PushOnClick} */
	static getComponent(gameObject) {
		return gameObject["__PushOnClick"];
	}

	/** @type {Phaser.GameObjects.Image} */
	gameObject;
	/** @type {string} */
	sceneToStartKey = "";

	/* START-USER-CODE */
	
	// user strings
	strings = {};

	awake() {
		
		if(this.sceneToStartKey) {
			this.gameObject.setInteractive().on("pointerdown", () => {
				console.log('door clicked', this.sceneToStartKey)

				// todo switch scene
				// () => this.scene.start("scena"))
			});
		} else {
			this.gameObject.setInteractive().on("pointerdown", () => {
				// stops
				this.gameObject.anims.pause()
				this.gameObject.body.velocity.x = 0;
				// sets turn animation
				const animTurn = new StartAnimation(this.gameObject);
				animTurn.animationKey = "armor_turn_reverse";
				animTurn.gameObject.on("animationcomplete", () => {
					// sets idle animation
					const animIdle = new StartAnimation(this.gameObject);
					animIdle.animationKey = "armor_idle";

					setTimeout(() => {
						this.talk();
					},500);
				})
			});

			return;
		}

	}
	
	talk () {
		let lastIndex = 0;
		const discourse = [this.strings.alienIntro1, this.strings.alienIntro2, this.strings.alienIntro3];
		
		this.createSpeechBubble(discourse[lastIndex],null, null, 400, 50);
		lastIndex++;
		
		this.scene.input.on("pointerdown", () => { // tap anywhere in the scene
			
			// TODO make prev bubble disappear
			
			if(discourse[lastIndex]) {
				this.createSpeechBubble(discourse[lastIndex],null, null, 400, 50);
				lastIndex++;
			} else {
				// disappear bubble	
			}
		})

	}


	createSpeechBubble (quote, x, y, width, height,)
{
	// default position is on top of sprite
	if(!x) x = this.gameObject.body.position.x + this.gameObject.body.halfWidth;
	if(!y) y = this.gameObject.body.position.y - this.gameObject.body.halfHeight;
		
    var bubbleWidth = width;
    var bubbleHeight = height;
    var bubblePadding = 10;
    var arrowHeight = bubbleHeight / 4;

    var bubble = this.gameObject.scene.add.graphics({ x: x, y: y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(bubbleWidth / 7);
    var point1Y = bubbleHeight;
    var point2X = Math.floor((bubbleWidth / 7) * 2);
    var point2Y = bubbleHeight;
    var point3X = Math.floor(bubbleWidth / 7);
    var point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    var content = this.gameObject.scene.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

    var b = content.getBounds();

    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
