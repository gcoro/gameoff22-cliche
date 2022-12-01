import Phaser from "phaser"

export class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super()
        this.instance = null
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new EventDispatcher()
        }
        return this.instance
    }
}
