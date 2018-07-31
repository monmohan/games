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