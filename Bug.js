var Bug = function(myStage, myAssetManager, mySnake) {
    // initialization
    var stage = myStage;
    var assetManager = myAssetManager;
    var snakeClip = mySnake.getClip();
    var tickerListener = null;

    // construct clip for this object and add to stage
    var clip = new MovingDiagonalObject(assetManager.getSpriteSheet("Bug"), stage);
    // add bugs so they are below the snake (snake)
    stage.addChildAt(clip, stage.getChildIndex(snakeClip));

    // get bounds of sprite so we can determine width / height
    var dimensions = clip.getBounds();

    // construct custom event objects
    var eventBugEaten = new createjs.Event("onBugEaten", true);

    // --------------------------------------------- private methods
    function randomMe(low, high) {
        return Math.round(Math.random() * (high - low)) + low;
    }

    // ---------------------------------------------- public methods
    this.startMe = function() {
        // random selection of speed of bug
        clip.speed = randomMe(2,6);

        // bug starts on left or right of stage?
        if (randomMe(1, 2) == 1) {
            // move right
            clip.x = -dimensions.width;
            // randomly select starting y location of mower
            clip.y = randomMe(50, stage.canvas.height - 50);
            clip.rotation = randomMe(45, -45);
        } else {
            // move left
            clip.x = stage.canvas.width;
            clip.y = randomMe(50, stage.canvas.height - 50);
            clip.rotation = randomMe(135, 225);
        }

        // fire startMe again to take the new rotation of the bug
        clip.gotoAndPlay("alive");
        clip.startMe();

        // setup listener to listen for ticker to monitor collisions
        tickerListener = createjs.Ticker.on("tick", onCollisionTest, this);

        // listen for when my bug goes off the screen and kill it if it does
        clip.addEventListener("onMovingDiagonalObjectOffStage", killMe);
    };

    // ----------------------------------------------- event handlers
    function onCollisionTest(e) {
        // only do collision test on every other tick to save on processing
        if (createjs.Ticker.getTicks() % 2 == 0) {

            /*
            // LESSON COLLISION DETECTION
            // radius collision detection
            // Calculate difference between centres
            var distX = snakeClip.x - clip.x;
            var distY = snakeClip.y - clip.y;
            // Get distance with Pythagoras
            var dist = Math.sqrt((distX * distX) + (distY * distY))
            // bug has a radius of 19
            // snake has a radius of 75
            // force the radius of the circle on the snake to only be 5
            // sum of 5 + 19 = 24
            if (dist <= 24) {
                // collision detection with snake
                clip.dispatchEvent(eventBugEaten);
                killMe();
            }
            */

            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
            // radius collision detection
            // Calculate difference between centres
            var distX = 0;
            var distY = 0;
            var direction = snakeClip.direction;
            // transform circle depending on direction of snake so it is always over the head
            if (direction == MovingObject.LEFT) {
                distX = snakeClip.x - 32 - clip.x;
                distY = snakeClip.y - clip.y;
            } else if (direction == MovingObject.RIGHT) {
                distX = snakeClip.x + 32 - clip.x;
                distY = snakeClip.y - clip.y;
            } else if (direction == MovingObject.UP) {
                distX = snakeClip.x - clip.x;
                distY = snakeClip.y - 32 - clip.y;
            } else {
                distX = snakeClip.x - clip.x;
                distY = snakeClip.y + 32 - clip.y;
            }

            // Get distance with Pythagoras
            var dist = Math.sqrt((distX * distX) + (distY * distY))
            // bug has a radius of 19
            // snake has a radius of 75
            // force the radius of the circle on the snake to only be 5
            // sum of 5 + 19 = 24
            if (dist <= 24) {
                // collision detection with snake
                clip.dispatchEvent(eventBugEaten);
                killMe();
            }
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    }

    function killMe() {
        createjs.Ticker.off("tick", tickerListener);
        clip.stopMe();
        // play death sequence of bug
        clip.gotoAndPlay("dead");
        clip.on("animationend", onKilled, this);
    }

    function onKilled(e) {
        // cleanup event listeners
        clip.off("animationend", onKilled);
        // remove displayobject
        stage.removeChild(clip);
        // remove ticker listener
        createjs.Ticker.off("tick", tickerListener);
    }
};
