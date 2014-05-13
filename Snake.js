(function() {
    // initialization
    var stage;
    var assetManager;
    var SNAKE_MAX_SPEED = 5;
    var killed = false;
    var slowDownDelay = 0;
    var slowDownTimer = null;

    // grab clip for Snake and add to stage canvas
    var clip;

    // construct custom event objects
    var eventSnakeKilled = new CustomEvent("onSnakeKilled");
    var eventSnakeSlowed = new CustomEvent("onSnakeSlowed");

    var Snake = function(myStage, myAssetManager) {
        // passed in required game objects
        stage = myStage;
        assetManager = myAssetManager;
        // initialization
        killed = false;
        slowDownDelay = 5000;

        // construct clip for this object and add to stage
        clip = new MovingObject(assetManager.getSpriteSheet("Snake"), stage);
        stage.addChild(clip);
    };

    // ---------------------------------------------- get/set methods
    Snake.prototype.getKilled = function() {
        return killed;
    };

    // ---------------------------------------------- public methods
    Snake.prototype.setupMe = function() {
        clip.x = 280;
        clip.y = 300;
        clip.setSpeed(SNAKE_MAX_SPEED);

        // start the timer
        //slowDownTimer = setInterval(onSlowMe, slowDownDelay);
    };

    Snake.prototype.energizeMe = function() {
        // snake can only gain more energy if less than maximum
        if (clip.getSpeed() < SNAKE_MAX_SPEED) {
            clip.setSpeed(this.speed + 1);
        }
        // reset slowdown timer so the interval starts again
        //clearInterval(slowDownTimer);
        //slowDownTimer = setInterval(onSlowMe, slowDownDelay);
    }

    Snake.prototype.killMe = function() {
        if (!killed) {
            killed = true;
            clip.stopMe();
            //clearInterval(slowDownTimer);
            clip.gotoAndPlay("dead");
            document.dispatchEvent(eventSnakeKilled);
        }
    }

    Snake.prototype.go = function(direction) {
        clip.setDirection(direction);
        if (!clip.getMoving()) {
            clip.gotoAndPlay("alive");
            clip.startMe();
        }
    }

    Snake.prototype.stopMe = function() {
        // stop animation and movement
        clip.stop();
        clip.stopMe();
    }


    // ----------------------------------------------- event handlers
    function onSlowMe(e) {
        // adjust speed of MovingObject
        clip.setSpeed(clip.getSpeed() - 1);
        document.dispatchEvent(eventSnakeSlowed);
        // check if snake is dead
        if (clip.getSpeed() <= 0) {
            killMe();
        }

        console.log("slowing down! " + clip.getSpeed());

    }

    // add this object to the window so it is accessible anywhere in your app (like all objects)
    window.Snake = Snake;

})();


