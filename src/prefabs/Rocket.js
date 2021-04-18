// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);                       // add object to existing scene
        this.isFiring = false;                          // track rocket's firing status
        this.moveSpeed = 2;                             // pixels per frame
        // | Normal Strumming
        
        this.strumSounds = scene.sound.add('sfx_strumSounds');
        let strumMarker =   { name: 'strum1', start: 1.1, duration: 6.9};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 1
        strumMarker =       { name: 'strum2', start: 8.2, duration: 6.8};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 2
        
        // | Strum when another strum is playing
        this.altStrum = scene.sound.add('sfx_strumSounds');
        strumMarker =       { name: 'strumA', start: 51.0, duration: 0.512};   // Alt Strum
        this.altStrum.addMarker(strumMarker);
    }

    update() {
        // --- KEY CONTROLS
        // | Left/Right Movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width -
            borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        // | Firing
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            // | Sound effects
            if (!this.strumSounds.isPlaying) {
                this.strumSounds.play('strum1');
            }
            else {
                this.altStrum.play('strumA');
            }
        }
        
        // --- MOVEMENT BASED ON STATE
        // | Upward movement
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // | Reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // --- HELPER METHODS
    // | Put the rocket back on the ground
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}