class SampleScene extends Phaser.Scene {
    constructor() {
        super("SampleScene")

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

        this.mapHeight = 1200
        this.mapWidth = 16 * 90
        this.gameDuration = 18000

        this.eventEmitter = EventDispatcher.getInstance()
    }

    init() {
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

        // local variables
        this.currentPoors = []
        this.container = {}
        this.currentScore = 0
        this.gameHasStarted = false
        this.player = undefined
        this.enemy = undefined

        // we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
        this.player_alien_ally1 = undefined
        this.player_alien_ally2 = undefined
        this.exit_door = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.countdown = undefined
        this.createPoorsTimeout = undefined

        // TEST SCENE EVENTS
        this.events.once("destroy", () => console.log("scene scp 173 destroy"))
        this.events.once("pause", () => console.log("scene scp 173 pause"))
        this.events.once("resume", () => console.log("scene scp 173 resume"))
        this.events.once("shutdown", () =>
            console.log("scene scp 173 shutdown")
        )
        this.events.once("wake", () => console.log("scene scp 173 wake"))
    }

    preload() {
        console.log("preload methos scene")
    }

    create() {
        console.log("scene scp173 create")
        this.createBackgrounds()
        this.cursors = this.input.keyboard.createCursorKeys()
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
        this.createCollidersAndBounds()

        this.eventEmitter.on(ENEMY_EVENTS.EYE_OPENED, () => {
            this.gameHasStarted = true
            this.createPoors()
        })
        this.toggleCharactersVisibility(false)

        setTimeout(() => {
            console.log("START GAME!!")
            this.start()
        }, 2000)

        setTimeout(() => {
            this.scene.start("Level")
        }, 4000)
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

    createTimer() {
        this.countdown = new CountdownController(this)
    }
}
