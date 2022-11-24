class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "alien", "sprite10")

        /*
        // alternative subscribe to scene update event
        const { events } = this.scene
        events.on("update", this.update, this)
        this.once(
            "destroy",
            function () {
                events.off("update", this.update, this)
            },
            this
        )
        */
        this.scene.anims.create({
            key: "right",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 5,
                end: 8,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.scene.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 1,
                end: 4,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.scene.anims.create({
            key: "down",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 1,
                end: 1,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.scene.anims.create({
            key: "up",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 9,
                end: 9,
                prefix: "sprite",
            }),
            frameRate: 10,
        })

        this.scene.anims.create({
            key: "turn",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 10,
                end: 10,
                prefix: "sprite",
            }),
            frameRate: 10
        })

        this.scene.anims.create({
            key: "death",
            frames: this.scene.anims.generateFrameNames("alien", {
                start: 11,
                end: 11,
                prefix: "sprite"
            }),
            frameRate: 10
        })

        //  You can either do this:
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setScale(0.6, 0.6)
        this.setCollideWorldBounds(true)
        this.setDepth(5) // above all the other objects
    }

    update() {
        if (this.scene.cursors.left.isDown) {
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

    die(){
        this.setVelocity(0);
        this.play("death")
        //this.scene.start("GameOver")
    }
}
