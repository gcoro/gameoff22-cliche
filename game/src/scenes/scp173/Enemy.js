const ENEMY_ANIMS = {
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
            key: ENEMY_ANIMS.OPEN_EYE,
            frames: [
                { key: "enemy", frame: "sprite24" },
                { key: "enemy", frame: "sprite18" },
                { key: "enemy", frame: "sprite12" },
                { key: "enemy", frame: "sprite32" },
                { key: "enemy", frame: "sprite6" },
            ],
            frameRate: 8,
        })

        this.anims.create({
            key: ENEMY_ANIMS.CLOSE_EYE,
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
        if (anim.key === ENEMY_ANIMS.OPEN_EYE) {
            this.anims.stop(ENEMY_ANIMS.OPEN_EYE)
            this.eventEmitter.emit(ENEMY_EVENTS.EYE_OPENED)

            this.setInteractive().on("pointerout", () => {
                console.log("enemy pointerout")
                if (this.anims.currentAnim.key === ENEMY_ANIMS.OPEN_EYE) {
                    this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                }
            })
        }
    }

    isPointerOverlapping() {
        const { worldX, worldY } = game.input.activePointer
        const { x, y, width, height } = this.body
        return Utils.areObjectOverlapArea(
            { x: worldX, y: worldY },
            { x, y, width, height }
        )
    }
}

const ENEMY_EVENTS = {
    EYE_OPENED: "ENEMY_EYE_OPENED",
}
