class AlienAlly extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "alien_ally", "sprite1")
        
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("alien_ally", {
                start: 1,
                end: 5,
                prefix: "sprite",
            }),
            repeat: -1,
            frameRate: 6
        })

        this.setScale(1.3, 1.3)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
    }
}
