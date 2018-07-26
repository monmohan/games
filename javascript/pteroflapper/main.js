var score = 0;
var scoreText;
var numStars = 0;
var creatingStars = false;
var starText;
var stars;
var player;
let platforms, ground, ledge1,ledge2;
var pteros;
var gameOver;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});


function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('bomb', 'assets/bombs/002.png', 256, 256);
    game.load.spritesheet('explosion', 'assets/bombs/explosion.png', 64, 64);
    game.load.spritesheet('pteroflapper', 'assets/ptero-flapper2.png', 256, 156);
    game.load.spritesheet('candies', 'assets/candies.png', 82, 86);
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.

    ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is s in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    ledge1 = platforms.create(400, 400, 'ground');

    ledge1.body.immovable = true;

    ledge2 = platforms.create(-150, 250, 'ground');

    ledge2.body.immovable = true;
    // -- PLAYER
    createPlayer()


    //--CURSOR
    cursors = game.input.keyboard.createCursorKeys();

    //--STARS
    stars = game.add.group();

    stars.enableBody = true;
    /*starText = game.add.text(50, 50, 'stars: 0', {
        fontSize: '32px',
        fill: '#000'
    });*/
    createMoreStars(12, function () {
        numStars += 12;
    });

    //--scoring
    scoreText = game.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });


    //--BOMB
    bombs = game.add.group();

    bombs.enableBody = true;
    //-- Ptero flappers
    pteros = game.add.group();
    pteros.enableBody = true

    createPteroFlapper(50)

    setUpTimers()

    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', {
        font: '84px Arial',
        fill: '#fff'
    });
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.visible = false;
}

function update() {
    //  Collide the player and the stars with the platforms
    var starCollides = game.physics.arcade.collide(stars, platforms)
    playerAnimation()
    bombAninmation()
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

    if(!player.alive){
        gameOver.visible=true
    }


}

function bombAninmation() {
    var bombCollides = game.physics.arcade.collide(platforms, bombs, explode);

    game.physics.arcade.overlap(player, bombs, killPlayer, null, this);
    game.physics.arcade.collide(player, pteros, killPlayer, null, this);


    function killPlayer(player, bomb) {
        if (bomb) {
            bomb.animations.play('explode', 10, false, true);
        }
        player.kill()


    }

    function explode(platforms, bomb) {
        bomb.animations.play('explode', 10, false, true);
        //bomb.kill()
    }


}

function playerAnimation() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    } else {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -400;
    }

    //Player overlap with stars
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function pteroFlapperAnimation(ptero) {
    ptero.animations.play("flapping");
    ptero.body.velocity.x = 100;
}

function createBombs(num) {
    for (var i = 0; i < num; i++) {
        var bomb = bombs.create(i * 200, 20, 'explosion', 0);
        //bomb = game.add.sprite(100, 20, 'explosion');
        //  We need to enable physics on the player
        game.physics.arcade.enable(bomb);

        bomb.body.collideWorldBounds = true;

        bomb.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 22], 5, true);

        //  Let gravity do its thing
        bomb.body.gravity.y = 100;

        //  This just gives each star a slightly random bounce value
        bomb.body.bounce.y = 0.2 + Math.random() * 0.2;

    }



}

function createPlayer() {
    // The player and its settings
    player = game.add.sprite(100, game.world.height - 150, 'dude');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}


function createPteroFlapper(y) {
    let ny = (y + game.rnd.integerInRange(10,300)) % (game.world.height - 70)
    let ptero = pteros.create(0, ny, 'pteroflapper', 1);
    ptero.scale.setTo(0.4, 0.4)
    game.physics.arcade.enable(ptero);
    ptero.animations.add('flapping', [0, 1], 5, true);
    pteroFlapperAnimation(ptero)
    game.time.events.add(Phaser.Timer.SECOND * 5, createPteroFlapper, this, ny);

}

function reducePlatform(){
    ledge1.scale.setTo(0.9,0.9)
    ledge2.scale.setTo(0.9,0.9)
}

function setUpTimers() {
    game.time.events.loop(Phaser.Timer.SECOND * 6, createBombs, this, 6);
    game.time.events.loop(Phaser.Timer.SECOND * 19, reducePlatform, this);

}