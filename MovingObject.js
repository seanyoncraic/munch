// Extending a CreateJS class (or object technically speaking)

// the code is within a function declaration that is executed immediately once
// this ensures that whatever written here (functions, variables, etc) is not in the global scope causing conflicts with whatever this is used in
(function() {
    // MovingObject is that actual object that will do the inheriting - this is the constructor method
    var MovingObject = function(spriteSheet, myStage) {
        // this will call the initialize method that I define below to MovingObject
        this.initialize(spriteSheet, myStage);
    };
    // this makes our new MovingObject object inherit all methods and properties of Sprite
    MovingObject.prototype = new createjs.Sprite();
    // overriding the initialize method of Sprite so it calls ours instead
    MovingObject.prototype.Sprite_initialize = MovingObject.prototype.initialize;
    // add this MovingObject object to the window so it is accessible anywhere in your app (like all objects)
    window.MovingObject = MovingObject;

    // ------------------------------------------------ public properties
    // static constant hacking by adding them on as property of object
    MovingObject.LEFT = 1;
    MovingObject.RIGHT = 2;
    MovingObject.UP = 3;
    MovingObject.DOWN = 4;

    // reference to the stage object
    var stage = null;
    var speed = 0;
	var direction = 0;
	var moving = false;
    var dimensions = null;

    // construct custom event object for object moving off stage
    var eventOffStage = new CustomEvent("onOffStage");
    // private variables
    var tickerListener = null;

    // ------------------------------------------------ constructor method
    // define initialize method for MovingObject
    MovingObject.prototype.initialize = function(spriteSheet, myStage) {
        // must fire your super class initialize in order to work
        this.Sprite_initialize(spriteSheet);
        // constructor method entry point
        // ...

        // initialization
        stage = myStage;
        speed = 2;
        direction = MovingObject.LEFT;
        moving = false;
        dimensions = this.getBounds();
        this.stop();
    };

    // ------------------------------------------------ get/set methods
    MovingObject.prototype.getSpeed = function() {
        return speed;
    };
    MovingObject.prototype.setSpeed = function(value) {
        speed = value;
    };

    MovingObject.prototype.getDirection = function() {
        return direction;
    };
    MovingObject.prototype.setDirection = function(value) {
        direction = value;
    };

    MovingObject.prototype.getMoving = function() {
        return moving;
    };

    // ------------------------------------------------ public methods
    MovingObject.prototype.startMe = function() {
        if (!moving) {
            this.play();
            // setup listener to listen for ticker to control animation
            tickerListener = createjs.Ticker.on("tick", this.onMove, this);
            moving = true;
        }
    };

    MovingObject.prototype.stopMe = function() {
        if (moving) {
            this.stop();
            createjs.Ticker.off("tick", tickerListener);
            moving = false;
        }
    };

    // ------------------------------------------------ event handlers
    MovingObject.prototype.onMove = function(e) {
        // moving left
        if (direction == 1) {
            // moving left
            this.scaleX = 1;
            this.rotation = 0;
            this.x = this.x - speed;
            if (this.x < -dimensions.width) {
                this.x = stage.canvas.width;
                document.dispatchEvent(eventOffStage);
            }
        } else if (direction == 2) {
            // moving right
            this.scaleX = -1;
            this.rotation = 0;
            this.x = this.x + speed;
            if (this.x > (stage.canvas.width + dimensions.width)) {
                this.x = -dimensions.width;
                document.dispatchEvent(eventOffStage);
            }

        } else if (direction == 3) {
            // moving up
            this.scaleX = 1;
            this.rotation = 90;
            this.y = this.y - speed;
            if (this.y < -dimensions.height) {
                this.y = stage.canvas.height;
                document.dispatchEvent(eventOffStage);
            }

        } else if (direction == 4) {
            // moving down
            this.scaleX = 1;
            this.rotation = -90;
            this.y = this.y + speed;
            if (this.y > (stage.canvas.height + dimensions.height)) {
                this.y = -dimensions.height;
                document.dispatchEvent(eventOffStage);
            }

        }
    };

}());
