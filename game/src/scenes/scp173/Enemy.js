class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "enemy", "sprite24")

        this.anims.create({
            key: "openEye",
            frames: [
                { key: "enemy", frame: "sprite24" },
                { key: "enemy", frame: "sprite18" },
                { key: "enemy", frame: "sprite12" },
                { key: "enemy", frame: "sprite32" },
                { key: "enemy", frame: "sprite6" },
            ],
            frameRate: 8,
            repeat:-1
        })

        this.anims.create({
            key: "closeEye",
            frames: [
                { key: "enemy", frame: "sprite6" },
                { key: "enemy", frame: "sprite32" },
                { key: "enemy", frame: "sprite12" },
                { key: "enemy", frame: "sprite18" },
                { key: "enemy", frame: "sprite24" },
            ],
            frameRate: 8,
        })

        this.on("animationcomplete", (anim) =>
            this.handleEnemyAnimationEnd(anim)
        )
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.eventEmitter = EventDispatcher.getInstance()
    }

    handleEnemyAnimationEnd(anim) {
        if (anim.key === "openEye") {
            // open eye finished
            this.anims.stop("openEye")
            this.eventEmitter.emit("ENEMY_EYE_OPENED")
            setTimeout(() => {
                this.anims.play("closeEye")
            }, this.scene.ENEMY_KEEP_EYE_OPEN_MILLIS)
        } else if (anim.key === "closeEye") {
            // close eye finished
            this.setFrame("sprite24")
            this.anims.stop("closeEye")
            setTimeout(() => {
                this.anims.play("openEye")
            }, this.scene.ENEMY_KEEP_EYE_CLOSE_MILLIS)
        }
    }
}
