class Scp173 extends Phaser.Scene {
    constructor() {
        super("Scp173")
    }

    init() {
        // constants
        this.CELL_SIZE = 16
        this.NUM_POORS_PER_LOOP = 5
        this.SCORES_OVERLAP_POOR = 5
        this.OVERLAP_RANGE = 12
        this.WALL_THICKNESS = 3 * 16
        this.BOARD_GAP_TO_WORLD = 50

        // enemy anim times
        // this.ENEMY_KEEP_EYE_OPEN_MILLIS = 5 * 1000 // how long enemy keeps its eyes opened
        // this.ENEMY_KEEP_EYE_CLOSE_MILLIS = 10 * 1000 // how long enemy keeps its eyes closed
        this.ENEMY_CREATE_POORS_MILLIS = 15 * 1000
        // local variables
        this.currentPoors = []
        this.container = {}
        this.currentScore = 0
        this.gameHasStarted = false
        this.player = undefined
        this.enemy = undefined
        this.mapHeight = 1200
        this.mapWidth = 16 * 90
        this.gameDuration = 18000

        // we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
        this.player_alien_ally1 = undefined
        this.player_alien_ally2 = undefined
        this.exit_door = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.countdown = undefined
        this.eventEmitter = EventDispatcher.getInstance()
    }

    preload() {
        this.load.image("base_tiles", "assets/scp173/level_tileset.png")
        this.load.tilemapTiledJSON("tilemap", "assets/scp173/small_map.json")
        this.load.image("poor", "assets/scp173/poor/splat.png")

        //poops
        this.load.atlas(
            "throw_poor",
            "assets/scp173/poor/poops.png",
            "assets/scp173/poor/poops.json"
        )

        //player allies
        this.load.atlas(
            "alien_ally",
            "assets/scp173/alien_ally.png",
            "assets/scp173/alien_ally.json"
        )

        //player
        this.load.atlas(
            "alien",
            "assets/scp173/alien_repack.png",
            "assets/scp173/alien_repack.json"
        )

        //enemy
        this.load.atlas(
            "enemy",
            "assets/scp173/eye_monster/covid_spritesheet.png",
            "assets/scp173/eye_monster/covid_spritesheet.json"
        )

        //exit door
        this.load.atlas(
            "exit_door",
            "assets/scp173/door.png",
            "assets/scp173/door.json"
        )
    }

    create() {
        this.createBackgrounds()
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.setPollAlways()
        this.input.setDefaultCursor(
            "url(assets/scp173/cursor/inactive.cur), auto"
        )

        // add collider
        this.anims.create({
            key: "anim_throw_poor",
            frames: this.anims.generateFrameNames("throw_poor", {
                start: 1,
                end: 6,
                prefix: "sprite",
            }),
            frameRate: 10,
            repeat: -1,
        })

        this.player = new Player(this, 100, 250)
        this.exit_door = new ExitDoor(this, 15, 80)
        this.enemy = new Enemy(this, this.mapWidth / 2, this.mapHeight / 2)
        this.scoreLabel = new ScoreLabel(
            this,
            this.mapWidth / 2 - 2.2 * this.BOARD_GAP_TO_WORLD,
            0,
            this.currentScore
        )

        this.createPlayerAllies()
        this.createTimer()
        this.start()
        this.createCollidersAndBounds()

        this.eventEmitter.on(ENEMY_EVENTS.EYE_OPENED, () => {
            this.gameHasStarted = true
            this.createPoors()
        })
        this.eventEmitter.once(SCENE_EVENTS.GAME_OVER, () => this.gameOver())
    }

    createTimer() {
        this.countdown = new CountdownController(this)
        this.countdown.start(this.gameDuration)
    }

    playerDeath(reason) {
        this.countdown.stop()
        this.player.die()
        this.add
            .text(
                this.player.x,
                this.player.y,
                reason === "timer" ? `Time's up!` : "Game Over!!",
                {
                    fontSize: 48,
                }
            )
            .setDepth(7)
        // to game over scene
        setTimeout(() => this.scene.start("AfterGameTransition"), 5000)
    }

    createBackgrounds() {
        this.map = this.make.tilemap({ key: "tilemap" })
        const tileset = this.map.addTilesetImage(
            "level_tileset",
            "base_tiles",
            16,
            16
        )
        this.container.backgroundLayer = this.map.createLayer(
            "background_new",
            tileset,
            0,
            0
        )
        this.container.textureLayer = this.map.createLayer(
            "background_texture_new",
            tileset,
            0,
            0
        )
        this.container.wallsLayer = this.map.createLayer(
            "walls_new",
            tileset,
            0,
            0
        )
        this.container.wallsLayer.setCollisionByProperty({ collides: true })
    }

    createCollidersAndBounds() {
        this.physics.add.overlap(
            this.player,
            this.exit_door,
            this.goToAfterGameTransitionScene,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.enemy,
            this.playerDeath,
            null,
            this
        )

        //colliders
        this.physics.add.collider(this.player, this.container.wallsLayer)
        this.physics.add.collider(this.enemy, this.container.wallsLayer)
        this.physics.add.collider(
            this.player_alien_ally1,
            this.container.wallsLayer
        )

        // bounds
        this.cameras.main.setBounds(
            -this.BOARD_GAP_TO_WORLD,
            0,
            this.mapWidth + 2 * this.BOARD_GAP_TO_WORLD,
            this.mapHeight
        )
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight)
        this.player_alien_ally1.setCollideWorldBounds(true)
        this.player_alien_ally2.setCollideWorldBounds(true)

        this.cameras.main.startFollow(this.player, false, 0.08, 0.08)
    }

    start() {
        setTimeout(() => this.enemy.anims.play(ENEMY_ANIMS.OPEN_EYE), 5000)
    }

    createPoors() {
        const visibleMaxW =
            this.BOARD_GAP_TO_WORLD +
            this.container.backgroundLayer.width -
            2 * this.WALL_THICKNESS
        const visibleMaxH =
            this.container.backgroundLayer.height - 2 * this.WALL_THICKNESS

        let countPoors = 0

        while (countPoors < this.NUM_POORS_PER_LOOP) {
            const coords = Utils.generateRandomCoords(
                this.BOARD_GAP_TO_WORLD + 32, // 32 is because we need to overlap with the alien character
                visibleMaxW - 32,
                this.WALL_THICKNESS + 32,
                visibleMaxH - 32
            )

            if (
                !Utils.areObjectsOverlapping(
                    this.enemy,
                    coords,
                    Math.max(this.enemy.width, this.enemy.width)
                )
            ) {
                countPoors++
                const loopImage = this.physics.add.image(
                    coords.x,
                    coords.y,
                    "poor"
                )
                loopImage.setVisible(false)
                loopImage.setDepth(1)
                loopImage.setScale(0.2)
                this.currentPoors.push({ image: loopImage, ...coords })

                const sourceImage = this.physics.add.sprite(
                    this.enemy.x,
                    this.enemy.y,
                    "throw_poor"
                )
                sourceImage.setScale(0.2)

                sourceImage.setDepth(0)
                sourceImage.anims.play("anim_throw_poor")

                this.physics.moveToObject(sourceImage, loopImage, 200)
                const throwCollider = this.physics.add.overlap(
                    sourceImage,
                    loopImage,
                    (source, dest) => {
                        source.body.stop()
                        dest.setVisible(true)
                        source.destroy()
                        this.physics.add.overlap(
                            this.player,
                            loopImage,
                            (player, image) =>
                                this.handlePoorOverlap(player, image)
                        )
                        this.physics.world.removeCollider(throwCollider)
                    }
                )
            }
        }
        setTimeout(() => this.createPoors(), this.ENEMY_CREATE_POORS_MILLIS)
    }

    /**
     * handle player overlap poor
     * @param {*} player
     * @param {*} image
     */
    handlePoorOverlap(player, image) {
        if (this.cursors.space.isDown && this.checkPoorToClean(player, image)) {
            this.currentScore += this.SCORES_OVERLAP_POOR
            this.scoreLabel.add(this.SCORES_OVERLAP_POOR)
        }
    }

    /**
     * check if player is on a poor and eventually clean it
     */
    checkPoorToClean(player) {
        const posPlayerX = player.x
        const posPlayerY = player.y
        let selIdx = -1
        const selPoor = this.currentPoors.find((p, idx) => {
            const res = Utils.areObjectsOverlapping(
                p,
                {
                    x: posPlayerX,
                    y: posPlayerY,
                },
                this.OVERLAP_RANGE
            )
            if (res) selIdx = idx
            return res
        })
        if (selPoor) {
            selPoor.image.destroy()
            this.currentPoors.splice(selIdx, 1)
            return true
        } else return false
    }

    goToAfterGameTransitionScene() {
        if (
            this.exit_door.anims.currentAnim &&
            this.exit_door.anims.currentAnim.key === "open"
        ) {
            // check door is open
            this.scene.start("AfterGameTransition")
        }
    }

    update() {
        this.player.update()
        this.countdown.update()
        this.checkExitDoor()
        this.movePlayerAllies()
        this.checkPointerPosition()
    }

    checkPointerPosition() {
        if (
            !this.enemy.isPointerOverlapping() &&
            this.gameHasStarted &&
            this.player.isAlive
        ) {
            this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
        }
    }

    checkExitDoor() {
        if (this.currentPoors.length === 0 && this.gameHasStarted) {
            // play animation
            this.exit_door.anims.play("open")
        } else {
            this.exit_door.anims.play("close")
        }
    }

    movePlayerAllies() {
        if (this.boundsAreValidX()) {
            this.player_alien_ally1.x = this.player.x - 50
            this.player_alien_ally2.x = this.player.x - 50
        }
        if (this.boundsAreValidY()) {
            this.player_alien_ally1.y = this.player.y - 100
            this.player_alien_ally2.y = this.player.y + 100
        }
    }

    boundsAreValidX() {
        return (
            this.player.x - 50 > this.WALL_THICKNESS &&
            this.player.x + 50 + 50 < this.WALL_THICKNESS + this.mapWidth
        )
    }

    boundsAreValidY() {
        return (
            this.player.y - 100 > this.WALL_THICKNESS &&
            this.player.y + 100 + 100 < this.WALL_THICKNESS + this.mapHeight
        )
    }

    createPlayerAllies() {
        this.player_alien_ally1 = new AlienAlly(this, 90, 200)
        this.player_alien_ally2 = new AlienAlly(this, 90, 250)

        this.player_alien_ally1.anims.play("idle")
        this.player_alien_ally2.anims.play("idle")
    }

    gameOver() {
        this.playerDeath()
        console.log(
            "%c  GAME OVER!!  ",
            "background: #063970; color: #47d2a7; font-family:sans-serif; font-size: 40px; padding: 5px 10px"
        )
    }
}

const SCENE_EVENTS = {
    GAME_OVER: "GAME_OVER",
}