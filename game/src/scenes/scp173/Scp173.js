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

        // enemy anim times
        this.ENEMY_KEEP_EYE_OPEN_MILLIS = 5 * 1000 // how long enemy keeps its eyes opened
        this.ENEMY_KEEP_EYE_CLOSE_MILLIS = 10 * 1000 // how long enemy keeps its eyes closed

        // local variables
        this.currentPoors = []
        this.container = {}
        this.currentScore = 0

        this.player = undefined
        this.enemy = undefined
        this.mapHeight = 1200
        this.mapWidth = 1800

        // we can have a class wrapping them extending Phaser.Physics.Arcade.Sprite
        this.player_alien_ally1 = undefined
        this.player_alien_ally2 = undefined
        this.exit_door = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
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
        this.enemy = new Enemy(this, this.mapWidth/2, this.mapHeight/2)

        this.createPlayerAllies()
        this.start()
        this.createCollidersAndBounds()
    }

    createBackgrounds() {
        this.map = this.make.tilemap({ key: "tilemap" })
        const tileset = this.map.addTilesetImage(
            "level_tileset",
            "base_tiles", 16, 16)
        this.container.backgroundLayer = this.map.createLayer("background_new", tileset, 0, 0)
        this.container.textureLayer = this.map.createLayer("background_texture_new", tileset, 0, 0)
        this.container.wallsLayer = this.map.createLayer("walls_new", tileset, 0, 0)
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
    
        //colliders
        this.physics.add.collider(this.player, this.container.wallsLayer)
        this.physics.add.collider(this.enemy, this.container.wallsLayer)
        this.physics.add.collider(this.player_alien_ally1, this.container.wallsLayer)
        this.physics.add.collider(this.player_alien_ally2, this.container.wallsLayer)
            
        // bounds
        this.cameras.main.setBounds(-100, 0, this.mapWidth, this.mapHeight)
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight) 
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08)
    }

    start() {
        setTimeout(() => this.enemy.anims.play("openEye"), 1000)
    }

    getContainerVisiblePosition() {
        return {
            top: this.cameras.main.worldView.y,
            left: (this.game.canvas.width - this.container.backgroundLayer.width) / 2,
        }
    }

    createPoors() {
        const { top: visibleMinH, left: visibleMinW } =
            this.getContainerVisiblePosition()
        const visibleMaxW = visibleMinW + this.container.backgroundLayer.width // this.map.widthInPixels - 32
        const visibleMaxH = visibleMinH + this.game.canvas.height // this.map.heightInPixels - 32

        for (let i = 0; i < this.NUM_POORS_PER_LOOP; i++) {
            const coords = Utils.generateRandomCoords(
                visibleMinW,
                visibleMaxW,
                visibleMinH + this.enemy.height,
                visibleMaxH
            )
            console.log("coords", coords)
            const loopImage = this.physics.add.image(coords.x, coords.y, "poor")
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

            //const sourceImage = this.physics.add.image(100, 100, 'throw_poor')
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
                        (player, image) => this.handlePoorOverlap(player, image)
                    )
                    this.physics.world.removeCollider(throwCollider)
                }
            )
        }
    }

    /**
     * handle player overlap poor
     * @param {*} player
     * @param {*} image
     */
    handlePoorOverlap(player, image) {
        if (this.cursors.space.isDown) {
            this.ckeckPoorToClean(player, image)
            this.currentScore += this.SCORES_OVERLAP_POOR
        }
    }

    /**
     * check if player is on a poor and eventually clean it if space is pressed
     */
    ckeckPoorToClean(player, image) {
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
        }
    }

    /**
     * get container position
     * @returns
     */
    getContainerPosition() {
        return {
            top: (game.canvas.height - this.container.backgroundLayer.height) / 2,
            left: (game.canvas.width - this.container.backgroundLayer.width) / 2,
        }
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
        this.updatePlayerAllies()
    }

    updatePlayerAllies() {
        this.player_alien_ally1.y = this.player.y-100;
        this.player_alien_ally1.x = this.player.x-50;
        
        this.player_alien_ally2.y = this.player.y+100;
        this.player_alien_ally2.x = this.player.x-50;
    }

    closeExitDoor() {
        //to call back if monster release something
        this.exit_door.anims.play("close")
    }

    openExitDoor() {
        //to call back when finish to clean around && monster eye's closed
        this.exit_door.anims.play("open")
    }

    createPlayerAllies() {
        this.player_alien_ally1 = new AlienAlly(this, 90, 200)
        this.player_alien_ally2 = new AlienAlly(this, 90, 250)

        this.player_alien_ally1.anims.play("idle")
        this.player_alien_ally2.anims.play("idle")
    }
}
