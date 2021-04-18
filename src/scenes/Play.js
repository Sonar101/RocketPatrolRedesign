class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload () {
        // --- LOAD IMAGES / TILE SPRITES
        // | Player sprite
        this.load.image('Player', './assets/Player.png');
        // | Note sprite
        this.load.image('Note', './assets/Note.png');
        // | Pedestrian sprites
        this.load.image('Ped1', './assets/Pedestrian1.png');
        this.load.image('Ped2', './assets/Pedestrian2.png');
        this.load.image('Ped3', './assets/Pedestrian3.png');
        // | Street sprite
        this.load.image('Street', './assets/Street.png');
        // | Cloud shadow sprite
        this.load.image('Clouds', './assets/CloudShadows.png');
        // | Light gradient sprite
        this.load.image('Gradient', './assets/LightGradient.png');
        // | Dollar Bill Scoreboard
        this.load.image('ScoreBoard', './assets/ScoreBoard.png');

        // --- LOAD SPRITESHEETS
        // | explosion
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        // --- NO LONGER NEEDED
        // this.load.image('starfield', './assets/starfield.png');
        // this.load.image('rocket', './assets/rocket.png');
    }
    
    create() {
        // --- PLACING VISUAL ASSETS
        this.street = this.add.tileSprite(0 , 0, config.width, config.height, 'Street').setOrigin(0, 0);
        // | Note (Rocket projectile)
        this.p1Note = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'Note').setOrigin(0.5, 0);
        // | Player
        this.p1Character = this.add.sprite(this.p1Note.x, this.p1Note.y + 5, 'Player').setOrigin(.5,.5);
        // | Pedestrians (x3)
        this.ped01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'Ped1', 0, 30).setOrigin(0, 0);
        this.ped02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'Ped2', 0, 20).setOrigin(0, 0);
        this.ped03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'Ped3', 0, 10).setOrigin(0,0);
        // | Cloud Shadows
        this.clouds = this.add.tileSprite(0 , 0, config.width, config.height, 'Clouds').setOrigin(0, 0);
        // | Light gradient
        this.gradient = this.add.tileSprite(0 , 0, config.width, config.height, 'Gradient').setOrigin(0, 0);
        // | Dollar Bill Scoreboard
        this.scoreBoard = this.add.sprite(borderUISize * 3.5, borderUISize * 2, 'ScoreBoard').setOrigin(.5,.5);
        
        // --- ANIMATION CONFIG
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // --- SETTIMG UP SOUNDS
        // | Ambience
        this.ambience = this.sound.add('sfx_ambience').setVolume(.5);
        

        // --- SETTING UP THE SCOREBOARD
        // | Initialize score
        this.p1Score = 200;
        this.scoreDrainRate = 1;
        this.scoreJustAdded = false;
        // | Displaying score
        let scoreConfig = {
            fontFamily: 'Impact',
            fontSize: '32px',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(this.scoreBoard.x + 2, this.scoreBoard.y - 5, '$' + this.p1Score, scoreConfig).setOrigin(.5,.5);

        // --- SETTING UP GAME-OVER TEXT
        // | Initialize score
        let gameOverConfig = {
            fontFamily: 'Impact',
            fontSize: '32px',
            backgroundColor: '#03fc13',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // --- GAME OVER FLAG
        this.gameOver = false;

        // --- GAME CLOCK
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', gameOverConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', gameOverConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // --- DEFINE KEYS
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(time, delta) {
        // --- 'RESTART' / 'RETURN TO MENU' KEY PROMPT CONTROLS 
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene');
        }

        // --- MANAGE MUSIC AND AMBIENCE
        if (!this.ambience.isPlaying) {
            this.ambience.play();
        }
        
        // --- CLOUD SPRITE TILE SCROLLING
        this.clouds.tilePositionX -= 1;
        
        // --- UPDATING INDIVIDUAL SPRITE OBJECTS 
        if (!this.gameOver) {
            // | player projectile and player character
            this.p1Note.update();   
            this.p1Character.x = this.p1Note.x;
            // || pedestrians (x3)
            this.ped01.update();
            this.ped02.update();
            this.ped03.update();
        }

        // --- COLLISION CHECKING
        if(this.checkCollision(this.p1Note, this.ped03)) {
            this.p1Note.reset();
            this.shipExplode(this.ped03);
        }
        if (this.checkCollision(this.p1Note, this.ped02)) {
            this.p1Note.reset();
            this.shipExplode(this.ped02);
        }
        if (this.checkCollision(this.p1Note, this.ped01)) {
            this.p1Note.reset();
            this.shipExplode(this.ped01);
        }

        // --- SCORE MANAGEMENT
        if (!this.scoreJustAdded) {
            this.p1Score -= (delta / 1000) * this.scoreDrainRate;
            this.updateScore(this.p1Score);
        }
        this.scoreJustAdded = false;
    }

    // --- HELPER METHODS
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();           // reset ship position
            ship.alpha = 1;         // make ship visisble again
            boom.destroy();         // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.updateScore(this.p1Score);
        this.scoreJustAdded = true;
    }

    updateScore(value) {
        this.scoreLeft.text = '$' + Math.round(value);
    }
}