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