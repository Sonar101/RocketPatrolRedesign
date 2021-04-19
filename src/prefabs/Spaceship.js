class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, fast = false) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                       // add to existing scene
        this.scene = scene;
        this.points = pointValue;                       // store pointValue
        this.moveSpeed = fast ? game.settings.spaceshipSpeed * 1.2 : game.settings.spaceshipSpeed;  // pixels per frame
        
        this.isFast = fast;
        this.waiting = true;
        this.waitTimer = scene.time.delayedCall(5 * 1000, () => { // 5 second timer
            this.waiting = false;
        }, null, this);
    }

    update() {
        if (!this.isFast || (this.isFast && !this.waiting)) {
            // move spaceship left
            this.x -= this.moveSpeed;
            // wrap around from left edge to right edge
            if (this.x <= 0 - this.width)
                this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
        if (this.isFast)
            this.waiting = true;
            this.waitTimer = this.scene.time.delayedCall(5 * 1000, () => { // 5 second timer
                this.waiting = false;
            }, null, this);
    }
}