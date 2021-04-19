class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, fast = false) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                       // add to existing scene
        this.scene = scene;
        this.points = pointValue;                       // store pointValue
        this.moveSpeed = fast ? game.settings.spaceshipSpeed * 1.2 : game.settings.spaceshipSpeed;  // pixels per frame
        this.isFast = fast;
        
        this.isHappy = false;
        this.isWaiting = true;
        this.happyDuration = 3.5 * 1000;
        this.waitDuration = 5 * 1000;
        //this.happyTimer;
        this.waitTimer = scene.time.delayedCall(this.waitDuration, () => { 
            this.isWaiting = false;
        }, null, this);
    }

    update() {
        if (!this.isHappy && (!this.isFast || (this.isFast && !this.isWaiting))) {
            // move spaceship left
            this.x -= this.moveSpeed;
            // wrap around from left edge to right edge
            if (this.x <= 0 - this.width)
                this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
        if (this.isFast) {
            this.isWaiting = true;
        }
            this.waitTimer = this.scene.time.delayedCall(5 * 1000, () => { // 5 second timer
                this.isWaiting = false;
            }, null, this);
    }

    makeHappy() {
        this.isHappy = true;
        this.emoji = this.scene.add.sprite(this.x - 30, this.y + 30, 'Emoji');
        this.happyTimer = this.scene.time.delayedCall(this.happyDuration, () => {
            this.isHappy = false;
            this.emoji.destroy();
            this.reset();
        }, null, this);
    }
}