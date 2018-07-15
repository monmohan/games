var StarCatchGame = /** @class */ (function () {
    function StarCatchGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    StarCatchGame.prototype.preload = function () {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.game.load.spritesheet('bomb', 'assets/bombs/002.png', 256, 256);
        this.game.load.spritesheet('explosion', 'assets/bombs/explosion.png', 64, 64);
    };
    StarCatchGame.prototype.create = function () {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A simple background for our game
        this.game.add.sprite(0, 0, 'sky');
        this.game.add.sprite(0, 0, 'star');
        //  The platforms group contains the ground and the 2 ledges we can jump on
        var platforms = this.game.add.group();
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        // Here we create the ground.
        var ground = platforms.create(0, this.game.world.height - 64, 'ground');
        //  Scale it to fit the width of the game (the original sprite is s in size)
        ground.scale.setTo(2, 2);
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
    };
    return StarCatchGame;
}());
window.onload = function () {
    var game = new StarCatchGame();
};
