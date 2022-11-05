import Phaser from "phaser";
import { create, preload /*, update*/ } from "./GameScenesService";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    // update: update,
  },
};

export function setup() {
  return new Promise((resolve, reject) => {
    try {
      // TODO: clan code
      const game = new Phaser.Game(config);
      return resolve(game);
    } catch (exc) {
      reject(exc);
    }
  });
}
