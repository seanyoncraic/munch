var Snake = function(myStage, myAssetManager) {
    // initialization
    var stage = myStage;
    var assetManager = myAssetManager;
    var SNAKE_MAX_SPEED = 5;
    var killed = false;
    var slowDownDelay = 5000;
    var slowDownTimer = null;
    // no way around this it is needed in a setInterval event handler
    var myScope = this;

    // construct custom event objects
    var eventSnakeKilled = new createjs.Event("onSnakeKilled", true);
    var eventSnakeSlowed = new createjs.Event("onSnakeSlowed", true);

    // grab clip for Snake and add to stage canvas
    var clip = new MovingObject(assetManager.getSpriteSheet("Snake"), stage);
    stage.addChild(clip);

    // ---------------------------------------------- get/set methods
    this.getKilled = function() {
        return killed;
    };

    this.getClip = function() {
        return clip;
    };

    // ---------------------------------------------- public methods
    this.startMe = function() {
        killed = false;
        // start the timer
        slowDownTimer = setInterval(onSlowMe, slowDownDelay);
    };

    this.stopMe = function() {
        // stop animation and movement
        clip.stop();
        clip.stopMe();
    };

    this.resetMe = function() {
        clip.gotoAndStop(1);
        clip.x = 280;
        clip.y = 300;
        clip.speed = SNAKE_MAX_SPEED;
    };

    this.energizeMe = function() {
        // snake can only gain more energy if less than maximum
        if (clip.speed < SNAKE_MAX_SPEED) {
            clip.speed = this.speed + 1;
        }
        // reset slowdown timer so the interval starts again
        clearInterval(slowDownTimer);
        slowDownTimer = setInterval(onSlowMe, slowDownDelay);
    };

    this.killMe = function() {
        if (!killed) {
            killed = true;
            clip.stopMe();
            // kill slowdown timer
            clearInterval(slowDownTimer);
            clip.gotoAndPlay("dead");
            clip.addEventListener("animationend", onKilled);
        }
    };

    this.go = function(direction) {
        clip.direction = direction;
        if (!clip.moving) {
            clip.gotoAndPlay("alive");
            clip.startMe();
        }
    };

    // ----------------------------------------------- event handlers
    function onSlowMe() {
        // adjust speed of MovingObject
        clip.speed = clip.speed - 1;
        clip.dispatchEvent(eventSnakeSlowed);
        // check if snake is dead
        if (clip.speed <= 0) {
            myScope.killMe();
        }
    }

    function onKilled(e) {
        // cleanup
        clip.stop();
        clip.removeEventListener("animationend", onKilled);
        // dispatch event that snake has been killed!
        clip.dispatchEvent(eventSnakeKilled);
    }
};
