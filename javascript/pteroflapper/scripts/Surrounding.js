(function () {
    function Surrounding(game) {
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