class ExitDoor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "exit_door", "sprite2")

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
  
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
    }
}
