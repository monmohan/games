(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./scripts/BombController.js":2,"./scripts/CandyController.js":3,"./scripts/PlayerController.js":4,"./scripts/PteroController.js":5,"./scripts/Surrounding.js":6}],2:[function(require,module,exports){
(function () {
    function BombController(game) {
        this.bombs = game.add.group();
        this.bombs.enableBody = true;
        this.game = game;

    }
    BombController.prototype.createBombs = function (num) {
        for (var i = 0; i < num; i++) {
            var bomb = this.bombs.create(i * 200, 20, 'explosion', 0);
            //bomb = game.add.sprite(100, 20, 'explosion');
            //  We need to enable physics on the player
            this.game.physics.arcade.enable(bomb);

            bomb.body.collideWorldBounds = true;

            bomb.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 22], 5, true);

            //  Let gravity do its thing
            bomb.body.gravity.y = 100;

            //  This just gives each star a slightly random bounce value
            bomb.body.bounce.y = 0.2 + Math.random() * 0.2;

        }



    }

    BombController.prototype.bombAninmation = function (platforms, pteros, raptors, player) {
        var bombCollides = this.game.physics.arcade.collide(platforms, this.bombs, explode);

        this.game.physics.arcade.overlap(player, this.bombs, killPlayer, null, this);
        this.game.physics.arcade.collide(player, pteros, killPlayer, null, this);
        this.game.physics.arcade.collide(player, raptors, killPlayer, null, this);


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
    module.exports = BombController
})();
},{}],3:[function(require,module,exports){
(function () {
    var creatingcandies = false;
    let score = 0;
    let scoreText;

    function CandyController(game) {
        this.candies = game.add.group();
        this.candies.enableBody = true;
        this.numcandies = 0
        scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.setupcandies();
        this.game=game;

    }

    CandyController.prototype.setupcandies = function () {
        this.createMorecandies(15)


    }

    CandyController.prototype.collectCandies = function (player, candy) {

        // Removes the star from the screen
        candy.kill();
        this.numcandies--
            score += 10;
        scoreText.text = 'Score: ' + score;

        if (this.numcandies < 8) {
            this.createMorecandies(15)

        }

    }

    CandyController.prototype.createMorecandies = function (num) {
        if (creatingcandies) return
        creatingcandies = true
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < num; i++) {
            let star = this.candies.create(i * 70, 0, 'candies', i % 4)
            star.scale.setTo(0.4, 0.4);

            //  Let gravity do its thing
            star.body.gravity.y = 100;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.5 + Math.random() * 0.2;

        }
        creatingcandies = false
        this.numcandies += num
    }

    CandyController.prototype.onUpdate = function (platforms, player) {
        var starCollides = this.game.physics.arcade.collide(this.candies, platforms)
        this.game.physics.arcade.overlap(player, this.candies, this.collectCandies, null, this);

    }
    module.exports = CandyController;
})();
},{}],4:[function(require,module,exports){
(function () {
    function PlayerController(game) {
        // The player and its settings
        let player = game.add.sprite(100, game.world.height - 150, 'dude');
        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.game = game;
        this.player = player
    }


    PlayerController.prototype.playerAnimation = function (platforms) {
        var hitPlatform = this.game.physics.arcade.collide(this.player, platforms);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        } else if (cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        } else {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
            this.player.body.velocity.y = -400;
        }


    }
    module.exports = PlayerController
})();
},{}],5:[function(require,module,exports){
(function () {
    function PteroController(game) {
        this.game = game
        this.pteros = game.add.group();
        this.pteros.enableBody = true
        this.createPteroFlapper(50);

    }
    PteroController.prototype.pteroFlapperAnimation = function (ptero) {
        ptero.animations.play("flapping");
        ptero.body.velocity.x = 100;
    }


    PteroController.prototype.createPteroFlapper = function (y) {
        let ny = (y + this.game.rnd.integerInRange(10, 300)) % (this.game.world.height - 70)
        let ptero = this.pteros.create(0, ny, 'pteroflapper', 1);
        ptero.scale.setTo(0.4, 0.4)
        this.game.physics.arcade.enable(ptero);
        ptero.animations.add('flapping', [0, 1], 5, true);
        this.pteroFlapperAnimation(ptero)
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.createPteroFlapper, this, ny);

    }
    module.exports=PteroController
})();
},{}],6:[function(require,module,exports){
(function () {
    function Surrounding(game) {
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');


        this.platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.

        this.ground = this.platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is s in size)
        this.ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        this.ground.body.immovable = true;

        //  Now let's create two ledges
        this.ledge1 = this.platforms.create(400, 400, 'ground');

        this.ledge1.body.immovable = true;

        this.ledge2 = this.platforms.create(-150, 250, 'ground');

        this.ledge2.body.immovable = true;
    }
    
    module.exports = Surrounding
})();
},{}]},{},[1]);
