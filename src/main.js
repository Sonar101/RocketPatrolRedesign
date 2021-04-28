let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 720,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyC, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

/* --- POINT BREAKDOWN
- | Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
- | Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
    To implement this, there exists a fast, backpack wearing NPC that spawns every 9 seconds
- | Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
    To implement this, the timer and scoring system were combined to represent
    the player character's savings, which decreases over time and ends the game at 0
*/
