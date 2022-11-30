const MAP_LAYOUT = {
    small: {
        layout: "small_map.json",
        tilesW: 65,
        tilesH: 55,
    },
    medium: {
        layout: "medium_map.json",
        tilesW: 72,
        tilesH: 60,
    },
    large: {
        layout: "large_map.json",
        tilesW: 90,
        tilesH: 75,
    },
}

class Scp173 extends Phaser.Scene {
    constructor() {
        super("Scp173")
        this.currentLevel = 0

        // constants
        this.CELL_SIZE = 16
        this.NUM_POORS_PER_LOOP = 4
        this.SCORES_OVERLAP_POOR = 3
        this.OVERLAP_RANGE = 35
        this.WALL_THICKNESS = 3 * 16
        this.BOARD_GAP_TO_WORLD = 50
        this.SHOW_TEXT_TIMEOUT = 3000 //10000
        this.MAX_SCORE = 100
        // enemy anim times
        this.ENEMY_CREATE_POORS_MILLIS = 30 * 1000
        this.HOW_IT_WORKS_TEXT = [
            [
                `LEVEL ${this.currentLevel}`,
                "",
                "Collect all the rubbish the monster produces",
                "before the time is up or you will die.",
                "If you touch the monster you'll die too.",
                "When the red door opens, you can exit",
                "",
                "- ARROWS / WASD to move",
                "- SPACE BAR to collect items",
                "",
                "Click to start the game!",
            ],
            [
                `LEVEL ${this.currentLevel}`,
                "",
                "Collect all the rubbish the monster produces",
                "before the time is up or you will die.",
                "If you touch the monster you'll die too.",
                "",
                "- ARROWS / WASD to move",
                "- SPACE BAR to collect items",
                "- MOUSE POINTER to keep eye contact",
                "   with the monster:",
                "  you have to keep your mouse pointer ",
                "  OVER the monster after it opens its eyes",
                "- ESCAPE from the container",
                "   when the red door opens",
                "",
                "Click to start the game!",
            ],
        ]
        this.GAME_OVER_TEXT = ["You're so useless...."]
        this.WINNER_TEXT = ["Enclosure cleaned successfully"]
        // map layout configuration
        this.MAP_CONFIG = MAP_LAYOUT["small"]

        // local variables
        this.container = {}
        this.currentScore = 0
        this.player = undefined
        this.enemy = undefined
        this.mapHeight = +this.MAP_CONFIG.tilesH * 16 // tiles  * tile height
        this.mapWidth = +this.MAP_CONFIG.tilesW * 16 // tiles  * tile width
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
        this.GAME_STATUS = {
            LOADED: "loaded",
            STARTED: "started",
            FIGHTING: "fighting",
            ENDED: "ended",
        }
    }

    init() {
        this.TEXT_STYLE = {
            fixedHeight: this.game.config.height,
            fixedWidth: this.game.config.width,
            fontSize: 32,
            align: "center",
            font: "28px monospace",
            backgroundColor: "black",
            color: "white",
        }

        // we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
        this.player_alien_ally1 = undefined
        this.player_alien_ally2 = undefined
        this.exit_door = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.countdown = undefined
        this.createPoorsTimeout = undefined
        this.scp173bgMusic = undefined
        this.group = undefined
        this.eventEmitter = EventDispatcher.getInstance()
    }

    preload() {
        this.load.image("base_tiles", "assets/scp173/level_tileset.png")
        this.load.tilemapTiledJSON(
            "tilemap",
            `assets/scp173/${this.MAP_CONFIG.layout}`
        )
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
    }

    create() {
        this.status = this.GAME_STATUS.LOADED

        this.scp173bgMusic = this.sound.add("meteor_fight", { volume: 0.4 })
        if (musicActive) this.scp173bgMusic.play()

        this.createBackgrounds()
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createStartingText()
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
        this.enemy = new Enemy(
            this,
            this.mapWidth / 2,
            this.mapHeight / 2,
            this.currentLevel
        )
        this.scoreLabel = new ScoreLabel(
            this,
            this.cameras.main.worldView.width - 200,
            0,
            this.currentScore
        ).setVisible(false)

        this.missingEscrementsLabel = new MissingEscrements(this, 0, 0, 0)

        this.createPlayerAllies()
        this.createTimer()
        this.createCollidersAndBounds()
        this.group = this.physics.add.group()
        this.group.enableBody = true;
        this.physics.add.overlap(this.player, this.group, this.handlePoopOverlap, null, this);
   
        this.eventEmitter.on(ENEMY_EVENTS.EYE_OPENED, () => {
           this.createPoors()
        })

        this.eventEmitter.once(PLAYER_EVENTS.DIED, () => this.endGame(false))
        this.eventEmitter.once(PLAYER_EVENTS.WIN, () => this.win())
    }

    createTimer() {
        this.countdown = new CountdownController(this)
        this.countdown.label.setVisible(false)
    }

    playerDeath() {
        this.countdown.stop()
        this.player.die()
    }

    createResultText(resultData) {
        const content = resultData.gameOver
            ? this.GAME_OVER_TEXT
            : this.WINNER_TEXT

        const { x, y } = this.cameras.main.worldView

        this.startingText = this.add.text(x, y, content, this.TEXT_STYLE)
        this.startingText.setDepth(7)
        this.startingText.setPadding(0, this.game.config.height / 3)
        setTimeout(() => {
            this.scp173bgMusic?.stop()
            this.scene.start(Level.name, resultData)
        }, 3000)
    }

    createStartingText() {
        this.startingText = this.add.text(
            -this.WALL_THICKNESS,
            0,
            !this.currentLevel
                ? this.HOW_IT_WORKS_TEXT[0]
                : this.HOW_IT_WORKS_TEXT[1],
            this.TEXT_STYLE
        )
        this.startingText.setDepth(7)
        this.startingText.setPadding(0, this.game.config.height / 6)
        this.startingText.setInteractive().once("pointerdown", () => {
            this.startGame()
        })
    }

    startGame() {
        this.status = this.GAME_STATUS.STARTED
        this.startingText.destroy()
        //this.scoreLabel.setVisible(true)
        this.countdown.label.setVisible(true)
        this.countdown.start(this.gameDuration)
        if (this.currentLevel > 0) {
            this.input.setDefaultCursor(
                "url(assets/scp173/cursor/inactive.cur), auto"
            )
        }
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
                this.eventEmitter.emit(PLAYER_EVENTS.WIN)
            },
            null,
            this
        )

        const enemyCollider = this.physics.add.overlap(
            this.player,
            this.enemy,
            () => {
                enemyCollider.active = false
                this.eventEmitter.emit(
                    this.eventEmitter.emit(SCENE_EVENTS.GAME_OVER)
                )
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
        console.log("createPoors")
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

                const sourceImage = this.physics.add.sprite(
                    this.enemy.x,
                    this.enemy.y,
                    selecedObjectToThrow.name
                )
                sourceImage.setScale(selecedObjectToThrow.scale)

                sourceImage.setDepth(0)
                sourceImage.anims.play(selecedObjectToThrow.anim)

                const currObject = this.group.create(
                    coords.x, 
                    coords.y, 
                    selecedObjectToThrow.name
                );
                currObject.setVisible(false)
                currObject.setScale(selecedObjectToThrow.scale)
                this.physics.moveToObject(sourceImage, currObject, 200)

                const throwCollider = this.physics.add.overlap(
                    sourceImage,
                    currObject,
                    (source, dest) => {
                        source.body.stop()
                        currObject.setVisible(true)
                        source.destroy()
                        this.physics.world.removeCollider(throwCollider)
                    }
                )
            }
        }
        if (!this.missingEscrementsLabel.visible) {
            this.missingEscrementsLabel.setVisible(true)
        }
        this.missingEscrementsLabel.setData(this.group.getTotalUsed())

        if(this.currentLevel > 0){
            this.createPoorsTimeout = setTimeout(
                () => this.createPoors(),
                this.ENEMY_CREATE_POORS_MILLIS - 2 * this.currentLevel
            )
        }
    }

    handlePoopOverlap(player, poop) {
        if (this.cursors.space.isDown) {
            poop.disableBody(true, true)
            const music = this.sound.add('gushing-flesh')
            music.play()

            this.currentScore += this.SCORES_OVERLAP_POOR
            const currentScore = this.scoreLabel.getScore()
            if (currentScore + this.SCORES_OVERLAP_POOR < this.MAX_SCORE) {
                this.scoreLabel.add(this.SCORES_OVERLAP_POOR)
            } else this.scoreLabel.setScore(this.MAX_SCORE)
        }
        this.missingEscrementsLabel.setData(this.group.countActive(true))
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
        if (this.group.getTotalUsed() === 0) {
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
        this.currentLevel = 0
        this.playerDeath()
        console.log(
            "%c  GAME OVER!!  ",
            "background: #063970; color: #47d2a7; font-family:sans-serif; font-size: 40px; padding: 5px 10px"
        )
    }

    endGame(hasWin) {
        this.currentLevel++
        this.status = this.GAME_STATUS.LOADED
        this.missingEscrementsLabel.setVisible(false)
        if (this.createPoorsTimeout) {
            clearTimeout(this.createPoorsTimeout)
            this.createPoorsTimeout = undefined
        }
        if (this.openEyeTimeout) {
            clearTimeout(this.openEyeTimeout)
            this.openEyeTimeout = undefined
        }
        this.input.setDefaultCursor("default")

        let sound
        if (hasWin) {
            sound = this.sound.add("levelcomplete")
        } else {
            sound = this.sound.add("death-monster-sound")
        }
        sound.play()

        setTimeout(() => {
            this.createResultText({
                partialScore: hasWin
                    ? this.MAX_SCORE
                    : Math.min(this.scoreLabel.getScore(), this.MAX_SCORE - 80),
                gameOver: !hasWin,
            })
        }, 1000)
    }
}

const SCENE_EVENTS = {
    GAME_OVER: "GAME_OVER",
}
