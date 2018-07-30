(function () {
    var creatingStars = false;
    let score=0;
    let scoreText;

    function CandyController(game) {
        this.stars = game.add.group();
        this.stars.enableBody = true;
        this.numStars = 0
        scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.setupStars();
        
        
    
    }
    
    CandyController.prototype.setupStars = function () {
        this.createMoreStars(15)


    }

    CandyController.prototype.collectStar = function (player, star) {

        // Removes the star from the screen
        star.kill();
        this.numStars--
        score += 10;
        scoreText.text = 'Score: ' + score;
        
        if (this.numStars < 8) {
            this.createMoreStars(15)

        }

    }

    CandyController.prototype.createMoreStars = function (num) {
        if (creatingStars) return
        creatingStars = true
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < num; i++) {
            //  Create a star inside of the 'stars' group
            //var star = stars.create(i * 70, 0, 'star');
            let star = this.stars.create(i * 70, 0, 'candies', i % 4)
            star.scale.setTo(0.4, 0.4);

            //  Let gravity do its thing
            star.body.gravity.y = 100;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.5 + Math.random() * 0.2;

        }
        creatingStars = false
        this.numStars += num
    }
    module.exports = CandyController;
})();