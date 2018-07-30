let playerController, player;
let candyController;

let platforms, ground;
let pteros, raptors;
var gameOver;


var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update
});

let Surrounding = require('./scripts/Surrounding.js')
let CandyController = require('./scripts/CandyController.js')
let PteroController = require('./scripts/PteroController.js')
let PlayerController = require('./scripts/PlayerController.js')

let BombController = require('./scripts/BombController.js')
let bombController;


function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bomb', 'assets/bombs/002.png', 256, 256);
    game.load.spritesheet('explosion', 'assets/bombs/explosion.png', 64, 64);
    game.load.spritesheet('pteroflapper', 'assets/ptero-flapper2.png', 256, 156);
    game.load.spritesheet('candies', 'assets/candies.png', 82, 86);
    game.load.spritesheet('velociraptor', 'assets/velociraptor.png', 274, 186, 4);
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    s = new Surrounding(game)
    platforms = s.platforms;
    ground = s.ground;

    // -- 
    playerController = new PlayerController(game)
    player = playerController.player


    //--CURSOR
    cursors = game.input.keyboard.createCursorKeys();

    candyController = new CandyController(game);
    

    //--BOMB
    bombController = new BombController(game)
    
    //-- Ptero flappers
    let pteroController = new PteroController(game);
    pteros = pteroController.pteros

    setUpTimers()

    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', {
        font: '84px Arial',
        fill: '#fff'
    });
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.visible = false;

    //-- Raptor
    raptors = game.add.group();
    raptors.enableBody = true

    game.time.events.add(Phaser.Timer.SECOND * 4, createRaptor, this);
}

function update() {
    //  Collide the player and the candies with the platforms
    candyController.onUpdate(platforms,player)
    
    playerController.playerAnimation(platforms)
    bombController.bombAninmation(platforms, pteros, raptors, player)
    game.physics.arcade.collide(pteros, platforms, handleCollision, null, this);
    game.physics.arcade.overlap(pteros, platforms, handleOverlap, null, this);

    function handleCollision(ptero, platform) {
        ptero.body.bounce.x = 0.5
        ptero.body.bounce.y = 0.5
        ptero.body.velocity.x = -20
        ptero.body.gravity.y = 10

    }

    function handleOverlap(ptero, platform) {
        ptero.body.bounce.x = 0.3
        ptero.body.bounce.y = 0.3
        ptero.body.position.y -= 2
        //ptero.body.gravity.y=10

    }

    if (!player.alive) {
        gameOver.visible = true
    }


}


function createRaptor(scaleFactor, height, max) {
    if (max === 3) {
        return
    }
    max = max || 0
    sf = scaleFactor || 0.75
    height = height || (game.world.height - 200)
    let raptor = raptors.create(game.world.width, height, 'velociraptor', 0);
    raptor.scale.setTo(sf, sf)
    game.physics.arcade.enable(raptor);
    raptor.animations.add('walk', [0, 1, 2, 3], 6, true);
    raptor.animations.play("walk");
    raptor.body.velocity.x = -100;
    max++
    game.time.events.add(Phaser.Timer.SECOND * 1, createRaptor, this, 0.25, (game.world.height - 100), max);

}


function setUpTimers() {
    game.time.events.loop(Phaser.Timer.SECOND * 6, bombController.createBombs, bombController, 6);
    game.time.events.loop(Phaser.Timer.SECOND * 20, createRaptor, this);

}