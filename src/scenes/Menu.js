class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // --- LOAD IMAGES
        this.load.image('menu1', './assets/Menu1.png');
        this.load.image('menu2', './assets/Menu2.png');
        this.load.image('menu3', './assets/Menu3.png');
        // --- LOAD AUDIO FOR ALL SCENES
        this.load.audio('sfx_ambience', './assets/AmbienceBoost.wav');
        this.load.audio('sfx_strumSounds', './assets/StrumSounds.wav');
    }

    create() {
        // --- DISPLAYING MENU
        this.frame = this.add.image(0,0,'menu1').setOrigin(0,0);
        this.nextFrameNum = 2;
        // --- MENU AUDIO
        // || background ambience
        this.ambience = this.sound.add('sfx_ambience').setVolume(0.4);
        this.ambience.setLoop(true);
        // || Button sounds
        this.menuStrumSounds = this.sound.add('sfx_strumSounds');
        let strumMarker =   { name: 'strum1', start: 3.9, duration: 3.88};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 1
        strumMarker =   { name: 'strum2', start: 16.69, duration: 3.93};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 2
        strumMarker =   { name: 'strum3', start: 73.83, duration: 4.48};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 3

        // --- DEFINE KEYS
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        // --- KEY PROMPT CONTROLS
        if (this.nextFrameNum <= 3) {
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.pickMenuFrame();
            }
        }
        else {
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                // | Easy mode
                game.settings = {
                    spaceshipSpeed: 3,
                    initialScore: 50,
                    initialDrainRate: 1, 
                    drainRateMax: 15
                }
                this.menuStrumSounds.play('strum3');
                this.ambience.stop();
                this.scene.start('playScene');
            }
            if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                // | Hard mode
                game.settings = {
                    spaceshipSpeed: 4,
                    initialScore: 150,
                    initialDrainRate: 8,
                    drainRateMax: 20 
                }
                this.menuStrumSounds.play('strum3');
                this.ambience.stop();
                this.scene.start('playScene');
            }
        }
    }

    pickMenuFrame() {
        if (this.nextFrameNum <= 3) {
            if (this.nextFrameNum == 2) {
                this.menuStrumSounds.play('strum1');
            }
            else if (this.nextFrameNum == 3) {
                this.menuStrumSounds.play('strum2');
                this.ambience.play();
            }
            this.frame.setTexture('menu' + this.nextFrameNum);
            this.nextFrameNum++;
        }
    }
}