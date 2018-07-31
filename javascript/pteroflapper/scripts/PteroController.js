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

    }
    module.exports = PteroController
})();