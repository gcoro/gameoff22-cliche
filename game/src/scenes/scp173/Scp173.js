class Scp173 extends Phaser.Scene {
    constructor() {
        super("Scp173")
    }

    init() {
        // constants
        this.CELL_SIZE = 16
        this.NUM_POORS_PER_LOOP = 5
        this.SCORES_OVERLAP_POOR = 3
        this.OVERLAP_RANGE = 12
        this.WALL_THICKNESS = 3 * 16
        this.BOARD_GAP_TO_WORLD = 50
        this.SHOW_TEXT_TIMEOUT = 3000 //10000
        this.MAX_SCORE = 100

        // enemy anim times
        this.ENEMY_CREATE_POORS_MILLIS = 20 * 1000

        // local variables
        this.currentPoors = []
        this.container = {}
        this.currentScore = 0
        this.player = undefined
        this.enemy = undefined
        this.mapHeight = 1200
        this.mapWidth = 16 * 90
        this.gameDuration = 180000
        this.stuffToThrow = [
            {
                name: "skull",
                anim: "anim_throw_skull",
                scale: 1,
            },
            {
                name: "throw_poor",
                anim: "anim_throw_poor",
                scale: 0.2,
            },
        ]
        this.playRounds = 0
        // we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
        this.player_alien_ally1 = undefined
        this.player_alien_ally2 = undefined
        this.exit_door = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.countdown = undefined
        this.createPoorsTimeout = undefined
        this.eventEmitter = EventDispatcher.getInstance()
        this.GAME_STATUS = {
            LOADED: "loaded",
            STARTED: "started",
            FIGHTING: "fighting",
            ENDED: "ended",
        }
    }

    scp173bgMusic

    preload() {
        this.load.image("base_tiles", "assets/scp173/level_tileset.png")
        this.load.tilemapTiledJSON("tilemap", "assets/scp173/small_map.json")
        this.load.image("poor", "assets/scp173/poor/splat.png")

        this.load.atlas(
            "skull",
            "assets/scp173/blood/blood.png",
            "assets/scp173/blood/blood.json"
        )

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

        // TEST SENE EVENTS
        this.events.once("shutdown", () =>
            console.log("scene scp 173 shutdown")
        )
    }

    create() {
        this.status = this.GAME_STATUS.LOADED
        console.log("scene scp173 create")

        this.scp173bgMusic = this.sound.add("meteor_fight", { volume: 0.4 })
        if (musicActive) this.scp173bgMusic.play()

        this.createBackgrounds()
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createStartingText()
        this.createBackgrounds()
        this.input.setPollAlways()

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

        this.anims.create({
            key: "anim_throw_skull",
            frames: this.anims.generateFrameNames("skull", {
                start: 3,
                end: 3,
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
        ).setVisible(false)

        this.createPlayerAllies()
        this.createTimer()
        this.createCollidersAndBounds()

        this.eventEmitter.on(ENEMY_EVENTS.EYE_OPENED, () => {
            if (Utils.areObjectsOverlapping) this.createPoors()
        })

        this.eventEmitter.once(PLAYER_EVENTS.PLAYER_DIED, () =>
            this.endGame(false)
        )
    }

    createTimer() {
        this.countdown = new CountdownController(this)
        this.countdown.label.setVisible(false)
    }

    playerDeath(reason) {
        this.countdown.stop()
        this.player.die()
    }

    createStartingText() {
        const content = [
            "Collect all the dirt the monster produces",
            "before the time is up or you will die.",
            "If you touch the monster you'll die too.",
            "",
            "- ARROWS/WASD to move",
            "- SPACE BAR to collect items",
            "- MOUSE POINTER to watch the monster",
            "while his eye is open",
            "",
            "Click to start the game!",
        ]

        this.startingText = this.add.text(-this.WALL_THICKNESS, 0, content, {
            fixedHeight: this.game.config.height,
            fixedWidth: this.game.config.width,
            fontSize: 32,
            align: "center",
            font: "28px monospace",
            backgroundColor: "black",
            color: "white",
        })
        this.startingText.setDepth(7)
        this.startingText.setPadding(0, this.game.config.height / 3)
        this.startingText.setInteractive().once("pointerdown", () => {
            this.startGame()
        })
    }

    startGame() {
        this.status = this.GAME_STATUS.STARTED
        this.startingText.destroy()
        this.scoreLabel.setVisible(true)
        this.countdown.label.setVisible(true)
        this.countdown.start(this.gameDuration)
        this.input.setDefaultCursor(
            "url(assets/scp173/cursor/inactive.cur), auto"
        )
        this.eventEmitter.once(SCENE_EVENTS.GAME_OVER, () => this.gameOver())
        this.openEyeTimeout = setTimeout(
            () => this.enemy.anims.play(ENEMY_ANIMS.OPEN_EYE),
            10000
        )
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
        const doorCollider = this.physics.add.overlap(
            this.player,
            this.exit_door,
            () => {
                doorCollider.active = false
                this.win()
            },
            null,
            this
        )

        const enemyCollider = this.physics.add.overlap(
            this.player,
            this.enemy,
            () => {
                enemyCollider.active = false
                this.playerDeath()
            },
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

    createPoors() {
        // hack to avoid createPoors not finished when player dies
        if (
            this.status !== this.GAME_STATUS.STARTED &&
            this.status !== this.GAME_STATUS.FIGHTING
        )
            return

        if (this.status === this.GAME_STATUS.STARTED) {
            this.status = this.GAME_STATUS.FIGHTING
        }
        const visibleMaxW =
            this.BOARD_GAP_TO_WORLD +
            this.container.backgroundLayer.width -
            2 * this.WALL_THICKNESS
        const visibleMaxH =
            this.container.backgroundLayer.height - 2 * this.WALL_THICKNESS

        let countPoors = 0

        while (
            countPoors < this.NUM_POORS_PER_LOOP &&
            this.status === this.GAME_STATUS.FIGHTING
        ) {
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
                const selecedObjectToThrow = Utils.generateRandomEnemyObject(
                    this.stuffToThrow
                )
                const loopImage = this.physics.add.image(
                    coords.x,
                    coords.y,
                    selecedObjectToThrow.name
                )
                loopImage.setVisible(false)
                loopImage.setDepth(1)
                loopImage.setScale(selecedObjectToThrow.scale)
                this.currentPoors.push({ image: loopImage, ...coords })

                const sourceImage = this.physics.add.sprite(
                    this.enemy.x,
                    this.enemy.y,
                    selecedObjectToThrow.name
                )
                sourceImage.setScale(selecedObjectToThrow.scale)

                sourceImage.setDepth(0)
                sourceImage.anims.play(selecedObjectToThrow.anim)

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

        this.createPoorsTimeout = setTimeout(
            () => this.createPoors(),
            this.ENEMY_CREATE_POORS_MILLIS - 2 * this.playRounds
        )
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

    win() {
        if (
            this.exit_door.anims.currentAnim &&
            this.exit_door.anims.currentAnim.key === "open"
        ) {
            this.endGame(true)
        }
    }

    update() {
        if (
            this.status === this.GAME_STATUS.STARTED ||
            this.status === this.GAME_STATUS.FIGHTING
        ) {
            this.player.update()
            this.countdown.update()
            this.movePlayerAllies()
        }
        if (this.status === this.GAME_STATUS.FIGHTING) {
            this.checkExitDoor()
            this.checkPointerPosition()
        }
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
        this.status = this.GAME_STATUS.LOADED
        this.playerDeath()
        console.log(
            "%c  GAME OVER!!  ",
            "background: #063970; color: #47d2a7; font-family:sans-serif; font-size: 40px; padding: 5px 10px"
        )
    }

    endGame(hasWin) {
        this.playRounds++
        this.status = this.GAME_STATUS.LOADED
        if (this.createPoorsTimeout) {
            console.log("cleartimeout openEyeTimeout", this.createPoorsTimeout)
            clearTimeout(this.createPoorsTimeout)
            this.createPoorsTimeout = undefined
        }
        if (this.openEyeTimeout) {
            console.log("cleartimeout openEyeTimeout", this.openEyeTimeout)
            clearTimeout(this.openEyeTimeout)
            this.openEyeTimeout = undefined
        }
        this.input.setDefaultCursor("default")

        let score = this.scoreLabel.getScore()
        if (!hasWin && score > this.MAX_SCORE) {
            score = this.MAX_SCORE - 80
        }

        let sound
        if (hasWin) {
            sound = this.sound.add("levelcomplete")
        } else {
            sound = this.sound.add("death-monster-sound")
        }
        sound.play()

        setTimeout(() => {
            this.scp173bgMusic?.stop()

            this.scene.start(Level.name, {
                partialScore: hasWin ? this.MAX_SCORE : score,
                gameOver: !hasWin,
            })
        }, 1000)
    }
}

const SCENE_EVENTS = {
    GAME_OVER: "GAME_OVER",
}
