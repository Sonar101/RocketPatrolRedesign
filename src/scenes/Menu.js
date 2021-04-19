class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // --- LOAD AUDIO FOR ALL SCENES
        this.load.audio('sfx_ambience', './assets/AmbienceBoost.wav');
        this.load.audio('sfx_strumSounds', './assets/StrumSounds.wav');
        // --- NO LONGER NEEDED LOADS
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');
    }

    create() {
        // --- MENU CONFIGURATION
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // --- DISPLAYING MENU
        // | Top Line
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        // | Middle Line
        this.add.text(game.config.width/2, game.config.height/2, 'Use ← → arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        // | Bottom Line
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for novice or → for Expert', menuConfig).setOrigin(0.5);

        // --- AUDIO FOR BUTTON PROMPTS
        this.menuStrumSounds = this.sound.add('sfx_strumSounds');
        let strumMarker =   { name: 'strum1', start: 3.85, duration: 3.71};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 1
        strumMarker =   { name: 'strum2', start: 3.85, duration: 3.71};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 2
        strumMarker =   { name: 'strum3', start: 73.83, duration: 4.48};   
        this.menuStrumSounds.addMarker(strumMarker);                            // Strum 3

        // --- DEFINE KEYS
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        // --- KEY PROMPT CONTROLS
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // | Easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 5000
            }
            this.menuStrumSounds.play('strum3');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // | Hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}