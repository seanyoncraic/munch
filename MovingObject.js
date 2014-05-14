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
    MovingObject.prototype.stage = null;
    MovingObject.prototype.speed = 0;
	MovingObject.prototype.direction = 0;
	MovingObject.prototype.moving = false;
    MovingObject.prototype.dimensions = null;

    // construct custom event object for object moving off stage
    MovingObject.prototype.eventOffStage = new createjs.Event("onOffStage", true);
    // private variables
    MovingObject.prototype.tickerListener = null;

    // ------------------------------------------------ constructor method
    // define initialize method for MovingObject
    MovingObject.prototype.initialize = function(spriteSheet, myStage) {
        // must fire your super class initialize in order to work
        this.Sprite_initialize(spriteSheet);
        // constructor method entry point
        // ...

        // initialization
        this.stage = myStage;
        this.speed = 2;
        this.direction = MovingObject.LEFT;
        this.moving = false;
        this.dimensions = this.getBounds();
        this.stop();
    };

    // ------------------------------------------------ public methods
    MovingObject.prototype.startMe = function() {
        if (!this.moving) {
            this.play();
            // setup listener to listen for ticker to control animation
            this.tickerListener = createjs.Ticker.on("tick", this.onMove, this);
            this.moving = true;
        }
    };

    MovingObject.prototype.stopMe = function() {
        if (this.moving) {
            this.stop();
            createjs.Ticker.off("tick", this.tickerListener);
            this.moving = false;
        }
    };

    // ------------------------------------------------ event handlers
    MovingObject.prototype.onMove = function(e) {
        // moving left
        if (this.direction == 1) {
            // moving left
            this.scaleX = 1;
            this.rotation = 0;
            this.x = this.x - this.speed;
            if (this.x < -this.dimensions.width) {
                this.x = this.stage.canvas.width;
                this.dispatchEvent(this.eventOffStage);
            }
        } else if (this.direction == 2) {
            // moving right
            this.scaleX = -1;
            this.rotation = 0;
            this.x = this.x + this.speed;
            if (this.x > (this.stage.canvas.width + this.dimensions.width)) {
                this.x = -this.dimensions.width;
                this.dispatchEvent(this.eventOffStage);
            }

        } else if (this.direction == 3) {
            // moving up
            this.scaleX = 1;
            this.rotation = 90;
            this.y = this.y - this.speed;
            if (this.y < -this.dimensions.height) {
                this.y = this.stage.canvas.height;
                this.dispatchEvent(this.eventOffStage);
            }

        } else if (this.direction == 4) {
            // moving down
            this.scaleX = 1;
            this.rotation = -90;
            this.y = this.y + this.speed;
            if (this.y > (this.stage.canvas.height + this.dimensions.height)) {
                this.y = -this.dimensions.height;
                this.dispatchEvent(this.eventOffStage);
            }

        }
    };

}());
