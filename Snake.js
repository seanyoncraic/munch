var Snake = function() {
    // private game variables
    var stage = window.stage;
    var assetManager = window.assetManager;

    // initialization
    var SNAKE_MAX_SPEED = 5;
    var killed = false;
    var slowDownDelay = 5000;
    var slowDownTimer = null;

    // construct custom event objects
    var eventSnakeKilled = new CustomEvent("onSnakeKilled");
    var evetnSnakeSlowed = new CustomEvent("onSnakeSlowed");

    // ---------------------------------------------- get/set methods
    this.getKilled = function() {
        return killed;
    };

    // ---------------------------------------------- public methods
    this.setupMe = function() {
        clip.x = 280;
        clip.y = 300;
        //clip.speed = Snake.SNAKE_MAX_SPEED;

        // start the timer
        //slowDownTimer = setInterval(onSlowMe, slowDownDelay);
    };

    // ----------------------------------------------- event handlers

    function onSlowMe(e) {

        console.log("slowing down!");

    }







};
