// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);                       // add object to existing scene
        this.isFiring = false;                          // track rocket's firing status
        this.moveSpeed = 2;                             // pixels per frame
        this.currStrum = 1;
        this.maxStrums = 3;

        // | Normal Strumming
        this.strumSounds = scene.sound.add('sfx_strumSounds');
        let strumMarker =   { name: 'strum1', start: 3.85, duration: 3.71};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 1
        strumMarker =       { name: 'strum2', start: 1.10, duration: 2.71};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 2
        strumMarker =       { name: 'strum3', start: 3.85, duration: 3.71};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 3
        strumMarker =       { name: 'strum4', start: 8.21, duration: 6.77};   
        this.strumSounds.addMarker(strumMarker);                            // Strum 4
        
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
            this.pickStrum();
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
    
    pickStrum(strumNumber) {
        // | Play the given strum
        if (strumNumber != undefined) {
            if (!this.strumSounds.isPlaying) {
                this.strumSounds.play('strum' + strumNumber);
            }
            else {
                this.altStrum.play('strumA');
            }
        }
        // | PLay the current strum if none given
        else {
            if (this.currStrum > this.maxStrums) {
                this.currStrum = 1;
            }
            
            if (!this.strumSounds.isPlaying) {
                this.strumSounds.play('strum' + this.currStrum);
                this.currStrum++;
            }
            else {
                this.altStrum.play('strumA');
            }
        }
    }
}