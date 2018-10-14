(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./scripts/BombController.js":2,"./scripts/CandyController.js":3,"./scripts/GameContext.js":4,"./scripts/PlayerController.js":5,"./scripts/PteroController.js":6,"./scripts/RaptorController.js":7,"./scripts/Surrounding.js":8}],2:[function(require,module,exports){
(function () {
    function BombController(game) {
        this.bombs = game.add.group();
        this.bombs.enableBody = true;
        this.game = game;
        game.time.events.loop(Phaser.Timer.SECOND * 6, this.createBombs, this, 6);

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

    BombController.prototype.onUpdate = function (gameContext) {
        var bombCollides = this.game.physics.arcade.collide(gameContext.platforms, this.bombs, explode);
        this.game.physics.arcade.overlap(gameContext.player, this.bombs, killPlayer, null, this);
        
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
    let creatingcandies = false;
    let score = 0;
    let scoreText;
    let _creatingCandies = false;

    function CandyController(game) {
        this.candies = game.add.group();
        this.candies.enableBody = true;
        this.numcandies = 0
        scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.createMorecandies(15)
        this.game = game;

    }


    CandyController.prototype.collectCandies = function (player, candy) {

        // Removes the star from the screen
        candy.kill();
        if (this.numcandies > 0) {
            this.numcandies--;
        }
        score += 10;
        scoreText.text = 'Score: ' + score;


    }

    CandyController.prototype.createMorecandies = function (num) {
        if (_creatingCandies) {
            return
        }
        _creatingCandies = true
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < num; i++) {
            let star = this.candies.create(i * 70, 0, 'candies', i % 4)
            star.scale.setTo(0.4, 0.4);

            //  Let gravity do its thing
            star.body.gravity.y = 100;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.5 + Math.random() * 0.2;
            this.numcandies++

        }
        _creatingCandies = false

    }

    CandyController.prototype.onUpdate = function (gameContext) {
        var starCollides = this.game.physics.arcade.collide(gameContext.candies, gameContext.platforms)
        this.game.physics.arcade.overlap(gameContext.player, gameContext.candies, this.collectCandies, null, this);
        if (this.numcandies < 5) {
            this.createMorecandies(15)

        }

    }
    module.exports = CandyController;
})();
},{}],4:[function(require,module,exports){
(function(){
    
    function GameContext(player, candies, raptors, pteros, platforms){
        this.player=player
        this.platforms=platforms
        this.raptors=raptors
        this.pteros=pteros
        this.candies=candies
    }
    module.exports=GameContext

})();
},{}],5:[function(require,module,exports){
(function () {
    let gameOver

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
        gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', {
            font: '84px Arial',
            fill: '#fff'
        });
        gameOver.anchor.setTo(0.5, 0.5);
        gameOver.visible = false;
    }


    PlayerController.prototype.onUpdate = function (gameContext) {
        var hitPlatform = this.game.physics.arcade.collide(this.player, gameContext.platforms);

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
    PlayerController.prototype.refresh = function (gameContext) {
        if (!this.player.alive) {
            //gameOver.visible = true
        }

    }
    module.exports = PlayerController
})();
},{}],6:[function(require,module,exports){
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
    PteroController.prototype.onUpdate = function (gameContext) {
        this.game.physics.arcade.collide(this.pteros, gameContext.platforms, handleCollision, null, this);
        this.game.physics.arcade.overlap(this.pteros, gameContext.platforms, handleOverlap, null, this);
        this.game.physics.arcade.collide(gameContext.player, gameContext.pteros, killPlayer, null, this);

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
        function killPlayer(player, ptero){
            player.kill()
        }

    }
    module.exports = PteroController
})();
},{}],7:[function(require,module,exports){
(function () {
    let _game;

    function RaptorController(game) {
        raptors = game.add.group();
        raptors.enableBody = true
        this.raptors = raptors
        game.time.events.add(Phaser.Timer.SECOND * 4, this.createRaptor, this);
        _game = game;
        game.time.events.loop(Phaser.Timer.SECOND * 20, this.createRaptor, this);
    }

    RaptorController.prototype.createRaptor = function (scaleFactor, height, max) {
        if (max === 3) {
            return
        }
        max = max || 0
        sf = scaleFactor || 0.75
        height = height || (_game.world.height - 200)
        let raptor = this.raptors.create(_game.world.width, height, 'velociraptor', 0);
        raptor.scale.setTo(sf, sf)
        _game.physics.arcade.enable(raptor);
        raptor.animations.add('walk', [0, 1, 2, 3], 6, true);
        raptor.animations.play("walk");
        raptor.body.velocity.x = -100;
        max++
        _game.time.events.add(Phaser.Timer.SECOND * 1, this.createRaptor, this, 0.25, (_game.world.height - 100), max);

    }
    RaptorController.prototype.onUpdate = function(gameContext){
        _game.physics.arcade.collide(gameContext.player, gameContext.raptors, killPlayer, null, this);
        function killPlayer(player,raptor){
            player.kill();
        }
    }
    

    module.exports = RaptorController

})();
},{}],8:[function(require,module,exports){
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
