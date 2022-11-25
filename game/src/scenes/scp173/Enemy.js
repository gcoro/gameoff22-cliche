const ANIMS = {
    OPEN_EYE: "openEye",
    CLOSE_EYE: "closeEye",
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "enemy", "sprite24")
        this.setInteractive({
            cursor: "url(assets/scp173/cursor/paternus_hit.cur), pointer",
        })

        this.anims.create({
            key: ANIMS.OPEN_EYE,
            frames: [
                { key: "enemy", frame: "sprite24" },
                { key: "enemy", frame: "sprite18" },
                { key: "enemy", frame: "sprite12" },
                { key: "enemy", frame: "sprite32" },
                { key: "enemy", frame: "sprite6" },
            ],
            frameRate: 8
        })

        this.anims.create({
            key: ANIMS.CLOSE_EYE,
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
        this.setDepth(6)
        
        this.eventEmitter = EventDispatcher.getInstance()
    }

    handleEnemyAnimationEnd(anim) {
        if (anim.key === ANIMS.OPEN_EYE) {
            this.anims.stop(ANIMS.OPEN_EYE)
            this.eventEmitter.emit("ENEMY_EYE_OPENED")

            this.setInteractive().on("pointerout", () => {
                if (this.anims.currentAnim.key === ANIMS.OPEN_EYE) {
                    this.eventEmitter.emit("GAME_OVER")
                }
            })
        }
    }
}
