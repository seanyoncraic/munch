var Bug = function(myStage, myAssetManager, mySnake) {
    // initialization
    var stage = myStage;
    var assetManager = myAssetManager;
    var snake = mySnake.getClip();
    var tickerListener = null;

    // construct clip for this object and add to stage
    var clip = new MovingDiagonalObject(assetManager.getSpriteSheet("Bug"), stage);
    // add bugs so they are below the snake (snake)
    stage.addChildAt(clip, stage.getChildIndex(snake));

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
        // radius collision detection
        // Calculate difference between centres
        var distX = snake.x - clip.x;
        var distY = snake.y - clip.y;
        // Get distance with Pythagoras
        var dist = Math.sqrt((distX * distX) + (distY * distY))
        // 69 is the sum of the radius
        if (dist <= 40) {
            // collision detection with snake
            clip.dispatchEvent(eventBugEaten);
            killMe();
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

        //console.log("bug killed");

        // cleanup event listeners
        clip.off("animationend", onKilled);
        // remove displayobject
        stage.removeChild(clip);
        // remove ticker listener
        createjs.Ticker.off("tick", tickerListener);
    }
};
