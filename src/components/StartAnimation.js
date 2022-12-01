// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export class StartAnimation {
    constructor(gameObject) {
        this.gameObject = gameObject
        gameObject["__StartAnimation"] = this

        /* START-USER-CTR-CODE */

        // the 1st time the scene is updated, we play the animationKey
        this.gameObject.scene.events.once("update", () => {
            this.gameObject.play(this.animationKey)
        })
        /* END-USER-CTR-CODE */
    }

    /** @returns {StartAnimation} */
    static getComponent(gameObject) {
        return gameObject["__StartAnimation"]
    }

    /** @type {Phaser.GameObjects.Sprite} */
    gameObject
    /** @type {string} */
    animationKey = ""

    /* START-USER-CODE */

    // Write your code here.

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
