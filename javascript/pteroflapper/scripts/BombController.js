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
        this.game.physics.arcade.collide(gameContext.player, gameContext.pteros, killPlayer, null, this);
        this.game.physics.arcade.collide(gameContext.player, gameContext.raptors, killPlayer, null, this);


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