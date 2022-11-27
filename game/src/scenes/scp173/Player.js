class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "alien", "sprite10")
        this.isAlive = true

        this.anims.create({
            key: "right",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 5,
                end: 8,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 1,
                end: 4,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "down",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 1,
                end: 2,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "up",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 9,
                end: 10,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "turn",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 10,
                end: 10,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.anims.create({
            key: "death",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 10,
                end: 14,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        //  You can either do this:
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setScale(0.6, 0.6)
        this.setCollideWorldBounds(true)
        this.setDepth(5) // above all the other objects

        this.eventEmitter = EventDispatcher.getInstance()

        this.on("animationcomplete", (anim) => {
            if (anim.key === "death") {
                this.anims.stop("death")
                this.setFrame("sprite14")
            }
        })
    }

    update() {
        if (!this.isAlive) {
            return
        } else if (this.scene.cursors.left.isDown) {
            this.setVelocityX(-200)
            this.anims.play("left", true)
        } else if (this.scene.cursors.right.isDown) {
            this.setVelocityX(200)
            this.anims.play("right", true)
        } else if (this.scene.cursors.down.isDown) {
            this.setVelocityY(200)
            this.anims.play("down", true)
        } else if (this.scene.cursors.up.isDown) {
            this.setVelocityY(-200)
            this.anims.play("up", true)
        } else {
            this.setVelocityX(0)
            this.setVelocityY(0)
            this.anims.play("turn")
        }
    }

    die() {
        this.isAlive = false
        this.setVelocityX(0)
        this.setVelocityY(0)
        this.anims.play("death")
    }
}
