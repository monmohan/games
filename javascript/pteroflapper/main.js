let Surrounding = require('./scripts/Surrounding.js')

let CandyController = require('./scripts/CandyController.js')
let candyController;

let PteroController = require('./scripts/PteroController.js')
let pteroController;

let PlayerController = require('./scripts/PlayerController.js')
let playerController;


let BombController = require('./scripts/BombController.js')
let bombController;

let GameConext = require('./scripts/GameContext.js')
let gameContext;

let RaptorController=require('./scripts/RaptorController.js')
let raptorController;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update
});



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
    cursors = game.input.keyboard.createCursorKeys();
    let s = new Surrounding(game)
    playerController = new PlayerController(game)
    candyController = new CandyController(game);
    bombController = new BombController(game)
    pteroController = new PteroController(game);
    raptorController = new RaptorController(game);
    gameContext=new GameConext(playerController.player,candyController.candies,raptors,pteroController.pteros,s.platforms)

    
}

function update() {
    candyController.onUpdate(gameContext)
    playerController.onUpdate(gameContext)
    bombController.onUpdate(gameContext)
    pteroController.onUpdate(gameContext)
    raptorController.onUpdate(gameContext)
    playerController.refresh(gameContext)
    
}
