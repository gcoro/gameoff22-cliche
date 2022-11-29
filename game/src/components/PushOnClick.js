// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

class PushOnClick extends UserComponent {
    constructor(gameObject) {
        super(gameObject)

        this.gameObject = gameObject
        gameObject["__PushOnClick"] = this

        /* START-USER-CTR-CODE */

        /* END-USER-CTR-CODE */
    }

    /** @returns {PushOnClick} */
    static getComponent(gameObject) {
        return gameObject["__PushOnClick"]
    }

    /** @type {Phaser.GameObjects.Image} */
    gameObject
    /** @type {string} */
    sceneToStartKey = ""

    /* START-USER-CODE */

    awake() {
        if (this.sceneToStartKey) {
            this.gameObject.setInteractive().on("pointerdown", () => {
                console.log('clicked', this.sceneToStartKey)

                if (this.sceneToStartKey === 'url_173') {
                    open('https://scp-wiki.wikidot.com/scp-173')
                } else if (this.sceneToStartKey === 'url_5153') {
                    open('https://scp-wiki.wikidot.com/scp-5153')
                } else if (this.sceneToStartKey === 'Level') { // main scene
                    this.scene.scene.start(Level.name, { restart: true })
                } else { // minigames
                    if (this.scene.activeScp === this.sceneToStartKey) {
                        console.log("start scene", this.sceneToStartKey)

                        this.scene.activeScp = null
                        this.scene.bgMusic?.pause()

                        const doorOpening = this.scene.sound.add('door_open')
                        doorOpening.play()

                        setTimeout(() => { // timeout to give sound effect some time to play
                            this.scene.scene.start(this.sceneToStartKey)
                        }, 1000)
                    } else {
                        console.log("scp not enabled")

                        const doorLocked = this.scene.sound.add('door_locked')
                        doorLocked.play()
                    }
                }
            })
        }
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
