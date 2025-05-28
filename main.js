
// Game RPG 2D: Legends of Eldoria Demo (Level 1–10)
// Full JavaScript (Phaser.js) Code

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('chest', 'assets/chest.png');
        this.load.image('tileset', 'assets/tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
    }

    create() {
        this.map = this.make.tilemap({ key: 'map' });
        const tileset = this.map.addTilesetImage('tileset');
        this.map.createLayer('Ground', tileset);

        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.coins = 1000;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.levelIndex = 0;
        loadLevel(this, this.levelIndex);
    }

    update() {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-160);
        else if (this.cursors.right.isDown) this.player.setVelocityX(160);

        if (this.cursors.up.isDown) this.player.setVelocityY(-160);
        else if (this.cursors.down.isDown) this.player.setVelocityY(160);
    }
}

const levels = [
  { level: 1, enemyType: 'slime', enemyHP: 50, reward: 200000, chestItem: 'Wooden Sword' },
  { level: 2, enemyType: 'goblin', enemyHP: 80, reward: 200000, chestItem: 'Health Potion' },
  { level: 3, enemyType: 'skeleton', enemyHP: 120, reward: 200000, chestItem: 'Iron Armor' },
  { level: 4, enemyType: 'wolf', enemyHP: 150, reward: 200000, chestItem: 'Speed Boots' },
  { level: 5, enemyType: 'orc', enemyHP: 200, reward: 200000, chestItem: 'Power Ring' },
  { level: 6, enemyType: 'witch', enemyHP: 250, reward: 200000, chestItem: 'Magic Scroll' },
  { level: 7, enemyType: 'lava golem', enemyHP: 300, reward: 200000, chestItem: 'Fire Amulet' },
  { level: 8, enemyType: 'phantom', enemyHP: 350, reward: 200000, chestItem: 'Ghost Blade' },
  { level: 9, enemyType: 'dark knight', enemyHP: 400, reward: 200000, chestItem: 'Dragon Shield' },
  { level: 10, enemyType: 'demon lord', enemyHP: 1000, reward: 500000, chestItem: 'Legendary Sword' }
];

function loadLevel(scene, levelIndex) {
    const levelData = levels[levelIndex];
    scene.add.text(20, 20, `Level ${levelData.level}`, { font: '20px Arial', fill: '#fff' });

    scene.enemy = scene.physics.add.sprite(400, 300, 'enemy');
    scene.enemy.hp = levelData.enemyHP;

    scene.chest = scene.physics.add.staticSprite(600, 300, 'chest');

    scene.physics.add.overlap(scene.player, scene.chest, () => {
        scene.chest.disableBody(true, true);
        console.log(`Item ditemukan: ${levelData.chestItem}`);
    });

    scene.physics.add.collider(scene.player, scene.enemy, () => {
        scene.enemy.hp -= 10;
        if (scene.enemy.hp <= 0) {
            scene.enemy.destroy();
            scene.player.coins += levelData.reward;
            console.log(`Musuh dikalahkan! Koin +${levelData.reward}`);
            nextLevel(scene);
        }
    });
}

function nextLevel(scene) {
    scene.levelIndex++;
    if (scene.levelIndex < levels.length) {
        loadLevel(scene, scene.levelIndex);
    } else {
        scene.add.text(300, 250, 'Boss Final Kalah! Dunia Eldoria Diselamatkan!', { font: '24px Arial', fill: '#0f0' });
    }
}
