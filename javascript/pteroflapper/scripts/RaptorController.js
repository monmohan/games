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