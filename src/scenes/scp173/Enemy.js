import Phaser from "phaser"
import { EventDispatcher } from "../scp173/EventDispatcher"
import { PLAYER_EVENTS } from "./Player"
import { SCENE_EVENTS } from "./Scp173"
import { Utils } from "./Utils"

export const ENEMY_ANIMS = {
    OPEN_EYE: "openEye",
    CLOSE_EYE: "closeEye",
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
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

        this.GAME_OVER_DEBOUNCE = 500
        this.gameOverDebounceTimeout = undefined

        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.setDepth(6)
        this.setCircle(115, -5, 15)

        this.eventEmitter = EventDispatcher.getInstance()
        if (this.level > 0) {
            this.eventEmitter.once(PLAYER_EVENTS.WIN, () => {
                this.off("pointerout")
                this.off("pointerover")
            })
        }
    }

    handleEnemyAnimationEnd(anim) {
        if (anim.key === ENEMY_ANIMS.OPEN_EYE) {
            this.anims.stop(ENEMY_ANIMS.OPEN_EYE)
            this.eventEmitter.emit(ENEMY_EVENTS.EYE_OPENED)
            if (this.level > 0) {
                this.setInteractive().on("pointerover", () => {
                    if (this.gameOverDebounceTimeout) {
                        clearTimeout(this.gameOverDebounceTimeout)
                        this.gameOverDebounceTimeout = undefined
                    }
                })
                this.setInteractive().on("pointerout", () => {
                    if (this.anims.currentAnim.key === ENEMY_ANIMS.OPEN_EYE) {
                        if (this.gameOverDebounceTimeout) {
                            clearTimeout(this.gameOverDebounceTimeout)
                            this.gameOverDebounceTimeout = undefined
                        }
                        this.gameOverDebounceTimeout = setTimeout(() => {
                            this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                        }, this.GAME_OVER_DEBOUNCE)
                    }
                })
                // need to check if pointer is on the enemy when the game starts, but we're kind and wait 1 sec before the player die
                setTimeout(() => {
                    if (!this.isPointerOverlapping()) {
                        this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                    }
                }, 1000)
            } else if (this.level === 0) {
                this.anims.play(ENEMY_ANIMS.CLOSE_EYE)
            }
        } else if (anim.key === ENEMY_ANIMS.CLOSE_EYE && this.level === 0) {
            this.scene.createPoorsTimeout = setTimeout(() => {
                this.anims.play(ENEMY_ANIMS.OPEN_EYE)
            }, this.scene.ENEMY_CREATE_POORS_MILLIS)
        }
    }

    isPointerOverlapping() {
        const { worldX, worldY } = window.game.input.activePointer
        const { x, y, width, height } = this.body
        return Utils.areObjectOverlapArea(
            { x: worldX, y: worldY },
            { x, y, width, height }
        )
    }
}

export const ENEMY_EVENTS = {
    EYE_OPENED: "ENEMY_EYE_OPENED",
}
