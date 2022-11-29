const ENEMY_ANIMS = {
    OPEN_EYE: "openEye",
    CLOSE_EYE: "closeEye",
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level) {
        super(scene, x, y, "enemy", "sprite24")
        this.level = level
        if (this.level > 0) {
            this.setInteractive({
                cursor: "url(assets/scp173/cursor/paternus_hit.cur), pointer",
            })
        }

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
        if (this.level > 0) {
            this.eventEmitter.once(PLAYER_EVENTS.WIN, () => {
                this.off("pointerout")
            })
        }
    }

    handleEnemyAnimationEnd(anim) {
        if (anim.key === ENEMY_ANIMS.OPEN_EYE) {
            this.anims.stop(ENEMY_ANIMS.OPEN_EYE)
            this.eventEmitter.emit(ENEMY_EVENTS.EYE_OPENED)
            if (this.level > 0) {
                this.setInteractive().on("pointerout", () => {
                    if (this.anims.currentAnim.key === ENEMY_ANIMS.OPEN_EYE) {
                        this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                    }
                })
                // need to check if pointer is on the enemy when the game starts, but we're kind and wait 1 sec before the player die
                setTimeout(() => {
                    if (!this.isPointerOverlapping()) {
                        this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                    }
                }, 1000)
            } else if(this.level === 0) { 
                this.anims.play(ENEMY_ANIMS.CLOSE_EYE)
            }
        } else if(anim.key === ENEMY_ANIMS.CLOSE_EYE && this.level === 0){
            setTimeout(() => {
                this.anims.play(ENEMY_ANIMS.OPEN_EYE)
            }, this.scene.ENEMY_CREATE_POORS_MILLIS)
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
