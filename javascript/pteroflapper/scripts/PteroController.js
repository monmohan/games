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