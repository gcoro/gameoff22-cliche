class Container173 extends Phaser.Scene {
  /*
  local variables:
    this.player -> player
    this.map -> game tile map
    this.containerLayer -> container 

  */
  constructor() {
    super('Container173')
    this.cellSize = 16
  }

  preload() {
    this.load.image('base_tiles', 'assets/scp173/tiles.png')
    this.load.tilemapTiledJSON('tilemap', 'assets/scp173/container.json')

    //player
    this.load.atlas(
      'alien',
      'assets/scp173/spritesheet_player.png',
      'assets/scp173/spritesheet_player.json'
    )
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.createMap()

    // create aplyer and its animation
    this.createPlayer()

    // add collider
    this.physics.add.collider(this.player, this.containerLayer)
  }

  update() {
    this.updatePlayer()
  }

  updatePlayer() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200)
      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200)
      this.player.anims.play('right', true)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200)
      this.player.anims.play('down', true)
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200)
      this.player.anims.play('up', true)
    } else {
      this.player.setVelocityX(0)
      this.player.setVelocityY(0)
      this.player.anims.play('turn')
    }
  }

  createPlayer() {
    // create player animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNames('alien', {
        start: 2,
        end: 2,
        prefix: 'sprite',
      }),
      frameRate: 10,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNames('alien', {
        start: 4,
        end: 4,
        prefix: 'sprite',
      }),
      frameRate: 10,
    })

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNames('alien', {
        start: 1,
        end: 1,
        prefix: 'sprite',
      }),
      frameRate: 10,
    })

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNames('alien', {
        start: 3,
        end: 3,
        prefix: 'sprite',
      }),
      frameRate: 10,
    })

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNames('alien', {
        start: 3,
        end: 3,
        prefix: 'sprite',
      }),
      frameRate: 10,
    })
    this.player = this.physics.add.sprite(110, 540, 'alien')

    // set player position
    this.player.x = (game.canvas.width - this.containerLayer.width) / 2 + 2 * this.cellSize
    this.player.y =
      (game.canvas.height - this.containerLayer.height) / 2 +
      this.containerLayer.height -
      2 * this.cellSize
  }

  createMap() {
    // create map
    this.map = this.make.tilemap({ key: 'tilemap' })
    const tileset = this.map.addTilesetImage('container', 'base_tiles', 16, 16)

    // create container space and position it in the game board
    this.containerLayer = this.map.createLayer(
      'inside',
      tileset,
      (game.canvas.width - this.map.widthInPixels) / 2,
      (game.canvas.height - this.map.heightInPixels) / 2
    )
    // set collider object by its property
    this.containerLayer.setCollisionByProperty({ collides: true })
  }
}
