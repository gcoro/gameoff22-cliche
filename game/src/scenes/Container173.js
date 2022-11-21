class Container173 extends Phaser.Scene {
  /*
  local variables:
    this.player -> player
    this.map -> game tile map
    this.tileset -> tileset
    this.container = {
        layer -> container layer
        position: container coords
    }
  */
  constructor() {
    super('Container173')
    // constants
    this.CELL_SIZE = 16
    this.NUM_POORS_PER_LOOP = 5
    this.SCORES_OVERLAP_POOR = 5
    this.OVERLAP_RANGE = 12

    // local variables
    this.currentPoors = []
    this.container = {}
    this.currentScore = 0
  }

  preload() {
    this.load.image('poor', 'assets/scp173/poor/splat.png')
    /*
    this.load.atlas(
      'throw_poor',
      'assets/scp173/poor/throw_poor_sprites.png',
      'assets/scp173/poor/throw_poor_sprites.json'
    )

    this.anims.create({
      key: 'anim_throw_poor',
      frames: this.anims.generateFrameNames('throw_poor', {
        start: 0,
        end: 6,
        prefix: 'sprite',
      }),
      frameRate: 8,
    })*/
    this.load.image('throw_poor', 'assets/scp173/poor/throw_poor.png')
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
    this.currentScore = 0
    this.createMap()

    // create aplyer and its animation
    this.createPlayer()

    // add collider
    this.physics.add.collider(this.player, this.container.layer)
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
    const { top: contTop, left: contLeft } = this.getContainerPosition()
    this.player.x = contLeft + 2 * this.CELL_SIZE
    this.player.y = contTop + this.container.layer.height - 2 * this.CELL_SIZE
    this.player.setDepth(5) // above all the other objects
  }

  createMap() {
    // create map
    this.map = this.make.tilemap({ key: 'tilemap' })
    this.tileset = this.map.addTilesetImage('container', 'base_tiles', 16, 16)

    // create container space and position it in the game board
    this.container.layer = this.map.createLayer(
      'inside',
      this.tileset,
      (game.canvas.width - this.map.widthInPixels) / 2,
      (game.canvas.height - this.map.heightInPixels) / 2
    )
    this.container.position = this.getContainerPosition()
    // set collider object by its property
    this.container.layer.setCollisionByProperty({ collides: true })

    this.testCreatePoors()
  }

  testCreatePoors() {
    setTimeout(() => this.createPoors(), 1000)
  }

  /**
   * create as many poors as this.numPoorPerLoop
   */
  createPoors() {
    for (let i = 0; i < this.NUM_POORS_PER_LOOP; i++) {
      const coords = this.generateRandomCoords()
      const loopImage = this.physics.add.image(coords.x, coords.y, 'poor')
      loopImage.setVisible(false)
      loopImage.setDepth(1)
      this.currentPoors.push({ image: loopImage, ...coords })

      //const sourceImage = this.physics.add.sprite(100, 100, 'throw_poor')
      const sourceImage = this.physics.add.image(100, 100, 'throw_poor')
      sourceImage.setDepth(0)
      //sourceImage.anims.play('anim_throw_poor')

      this.physics.moveToObject(sourceImage, loopImage, 200)
      const throwCollider = this.physics.add.overlap(sourceImage, loopImage, (source, dest) => {
        source.body.stop()
        dest.setVisible(true)
        source.destroy()
        this.physics.add.overlap(this.player, loopImage, (player, image) =>
          this.handlePoorOverlap(player, image)
        )
        this.physics.world.removeCollider(throwCollider)
      })
    }
  }

  /**
   * generate coords to put new poor on the game
   * @returns
   */
  generateRandomCoords() {
    const min = 32
    const maxW = this.map.widthInPixels - 32
    const maxH = this.map.heightInPixels - 32
    return {
      x: Math.floor(Math.random() * (maxW - min - 1) + min) + this.container.position.left,
      y: Math.floor(Math.random() * (maxH - min - 1) + min) + this.container.position.top,
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
      const res = this.areObjectsOverlapping(p, { x: posPlayerX, y: posPlayerY })
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

  /**
   * check if 2 objects are overlapping
   * @param {*} obj1
   * @param {*} obj2
   * @returns
   */
  areObjectsOverlapping(obj1, obj2) {
    return (
      Math.abs(obj1.x - obj2.x) < this.OVERLAP_RANGE &&
      Math.abs(obj1.y - obj2.y) < this.OVERLAP_RANGE
    )
  }
}
