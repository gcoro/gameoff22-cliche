let game
window.addEventListener('load', function () {
  game = new Phaser.Game({
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    backgroundColor: '#242424',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
    },
  })

  game.scene.add('Preload', Preload)
  game.scene.add('Level', Level)
  game.scene.add('Scp173', Scp173)
  game.scene.add('Container173', Container173)
  game.scene.add('Boot', Boot, true)
})

class Boot extends Phaser.Scene {
  preload() {
    this.load.pack('pack', 'assets/preload-asset-pack.json')

    //TODO: put back main scene
    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start('Scp173'))
  }
}
