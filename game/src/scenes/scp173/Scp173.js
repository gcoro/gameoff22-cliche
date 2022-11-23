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
        this.tileSize = 16
        this.mapHeight = 1200
        this.mapWidth = 1800

        this.stars = undefined //colliding obecjt that we do not have yet
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
        this.load.image("star", "assets/scp173/star.png")
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
            "assets/scp173/spritesheet_player_ally.png",
            "assets/scp173/spritesheet_player.json"
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
        this.currentScore = 0

        const map = this.make.tilemap({ key: "tilemap" })
        this.map = map
        const tileset = map.addTilesetImage(
            "level_tileset",
            "base_tiles",
            16,
            16
        )

        this.cameras.main.setBounds(
            0,
            0,
            this.mapWidth + 800,
            this.mapHeight + 100
        )
        this.physics.world.setBounds(
            0,
            0,
            this.mapWidth + 800,
            this.mapHeight + 100
        )

        this.container.layer = map.createLayer(
            "background_new",
            tileset,
            this.mapWidth / 2,
            0
        )
        this.container.layer = map.createLayer(
            "background_texture_new",
            tileset,
            this.mapWidth / 2,
            0
        ) //pixels offset
        this.wallsLayer = map.createLayer(
            "walls_new",
            tileset,
            this.mapWidth / 2,
            0
        ) //pixels offset

        this.wallsLayer.setCollisionByProperty({ collides: true })

        this.make.text({
            x: (8 * this.mapWidth) / 8,
            y: this.mapHeight / 2,
            text: "ur halfway thourgh it!",
            style: {
                font: "12px monospace",
                fill: "#ffffff",
            },
        })

        this.createPlayer()
        this.createEnemy(map)
        this.enemy.setInteractive({
            cursor: "url(assets/scp173/precisesharp.cur), pointer",
        })
        this.createPlayerAllies()
        this.createStars()
        this.createExitDoor() //to fix coords when we have the final tilemap background
        // this.testCreatePoors()
        this.start()

        this.physics.add.overlap(
            this.player,
            this.exit_door,
            this.goToAfterGameTransitionScene,
            null,
            this
        )
        this.physics.add.collider(this.player, this.wallsLayer)
        this.physics.add.collider(this.enemy, this.wallsLayer)
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08)
    }

    start() {
        setTimeout(() => this.enemy.anims.play("openEye"), 1000)
    }
    /**
     * get container position
     * @returns
     */
    getContainerVisiblePosition() {
        return {
            top: this.cameras.main.worldView.y,
            left: (this.game.canvas.width - this.container.layer.width) / 2,
        }
    }

    createPoors() {
        const { top: visibleMinH, left: visibleMinW } =
            this.getContainerVisiblePosition()
        const visibleMaxW = visibleMinW + this.container.layer.width // this.map.widthInPixels - 32
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
            top: (game.canvas.height - this.container.layer.height) / 2,
            left: (game.canvas.width - this.container.layer.width) / 2,
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true)

        if (this.stars.countActive() === 0) {
            //everything is cleaned up
            console.log("this.stars.countActive is zero")
            this.openExitDoor()
        }
        // TODO: update score label
    }

    createStars() {
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 5,
            setXY: { x: this.mapWidth / 8, y: 3500, stepX: 10 },
        })

        this.stars.children.iterate((c) => {
            let child = /** @type {Phaser.Physics.Arcade.Sprite} */ (c)
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4))
        })

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.collectStar,
            null,
            this
        )
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

    eyeClose() {
        console.log("eyeClose")
        this.enemy.anims.play("stop")
    }

    startBounce() {
        console.log("startBounce")
        this.enemy.anims.play("bounce")
        this.createPoors()
    }

    update() {
        this.player.update()
        this.updateEnemy()
        this.updatePlayerAllies()
    }

    updateEnemy() {
        if (this.cameras.main.worldView.y > 1) {
            // this.enemy.setY(...)
            this.enemy.y =
                this.enemy.y + 70 - this.getRelativePositionToCanvas(this.enemy)
        }
    }

    updatePlayerAllies() {
        this.player_alien_ally1.setY(
            this.player_alien_ally1.y +
                450 -
                this.getRelativePositionToCanvas(this.player_alien_ally1)
        )
        this.player_alien_ally2.setY(
            this.player_alien_ally2.y +
                450 -
                this.getRelativePositionToCanvas(this.player_alien_ally2)
        )
    }

    createExitDoor() {
        this.anims.create({
            key: "open",
            frames: this.anims.generateFrameNames("exit_door", {
                start: 1,
                end: 1,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "close",
            frames: this.anims.generateFrameNames("exit_door", {
                start: 2,
                end: 2,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.exit_door = this.physics.add.sprite(
            915,
            80,
            "exit_door",
            "sprite2"
        )
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
        //TODO: remove static pixels coords
        this.player_alien_ally2 = this.physics.add.sprite(
            (2 * this.mapWidth) / 8,
            this.mapHeight - 50,
            "alien_ally"
        )
        this.player_alien_ally1 = this.physics.add.sprite(
            (8 * this.mapWidth) / 8,
            this.mapHeight - 50,
            "alien_ally"
        )

        this.anims.create({
            key: "ally_stopped",
            frames: this.anims.generateFrameNames("alien_ally", {
                start: 3,
                end: 3,
                prefix: "sprite",
            }),
            frameRate: 10,
        })
        this.player_alien_ally1.anims.play("ally_stopped")
        this.player_alien_ally2.anims.play("ally_stopped")
    }

    createPlayer() {
        this.player = new Player(
            this,
            (5 * this.mapWidth) / 8,
            this.mapHeight - 60,
            "alien"
        )
    }

    createEnemy(map) {
        // TODO  need to fix the order of the sprites

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

        console.log(this.mapWidth / 2)
        this.enemy = this.physics.add.sprite(1100, this.mapHeight / 2, "enemy")
        this.enemy.setFrame("sprite24")
        this.enemy.setCollideWorldBounds(true)
        this.enemy.setScale(0.6, 0.6)

        this.enemy.fixedToCamera = true

        this.enemy.on("animationcomplete", (anim) =>
            this.handleEnemyAnimationEnd(anim)
        )
    }

    handleEnemyAnimationEnd(anim) {
        if (anim.key === "openEye") {
            // open eye finished
            this.enemy.anims.remove("openEye")
            this.createPoors()
            setTimeout(() => {
                this.enemy.anims.play("closeEye")
                this.enemy.body.reset(this.enemy.x, this.enemy.y)
            }, this.ENEMY_KEEP_EYE_OPEN_MILLIS)
        } else if (anim.key === "closeEye") {
            // close eye finished
            this.enemy.setFrame("sprite24")
            this.enemy.anims.remove("closeEye")
            setTimeout(() => {
                this.enemy.anims.play("openEye")
                const posX = this.getRandomXPosition()
                this.physics.moveTo(this.enemy, posX, this.enemy.y)
            }, this.ENEMY_KEEP_EYE_CLOSE_MILLIS)
        }
    }

    getRandomXPosition() {
        const positions = [100, 600]
        return positions[Math.floor(Math.random() * positions.length)]
    }

    getRelativePositionToCanvas(gameObject) {
        return (
            (gameObject.y - this.cameras.main.worldView.y) *
            this.cameras.main.zoom
        )
    }
}
