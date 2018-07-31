(function () {
    let creatingcandies = false;
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
        this.createMorecandies(15)
        this.game=game;

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

    CandyController.prototype.onUpdate = function (gameContext) {
        var starCollides = this.game.physics.arcade.collide(gameContext.candies, gameContext.platforms)
        this.game.physics.arcade.overlap(gameContext.player, gameContext.candies, this.collectCandies, null, this);

    }
    module.exports = CandyController;
})();