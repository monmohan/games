function setupStars() {
    stars = game.add.group();

    stars.enableBody = true;
    //starText = game.add.text(50, 50, 'stars: 0', { fontSize: '32px', fill: '#000' });
    createMoreStars(12, function () {
        numStars += 12;
    });


}

function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();
    numStars--
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
    //starText.text=numStars+creatingStars;
    if (numStars < 5) {
        createMoreStars(12, function () {
            numStars += 12
        })

    }

}

function createMoreStars(num, updater) {
    if (creatingStars) return
    creatingStars = true
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < num; i++) {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 100;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;

    }
    creatingStars = false
    updater()
}