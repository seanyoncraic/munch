// Extending a CreateJS class (or object technically speaking)

// the code is within a function declaration that is executed immediately once
// this ensures that whatever written here (functions, variables, etc) is not in the global scope causing conflicts with whatever this is used in
(function() {
    // MovingDiagonalObject is that actual object that will do the inheriting - this is the constructor method
    var MovingDiagonalObject = function(spriteSheet, myStage) {
        // this will call the initialize method that I define below to MovingDiagonalObject
        this.initialize(spriteSheet, myStage);
    };
    // this makes our new MovingDiagonalObject object inherit all methods and properties of Sprite
    MovingDiagonalObject.prototype = new createjs.Sprite();
    // overriding the initialize method of Sprite so it calls ours instead
    MovingDiagonalObject.prototype.Sprite_initialize = MovingDiagonalObject.prototype.initialize;
    // add this MovingDiagonalObject object to the window so it is accessible anywhere in your app (like all objects)
    window.MovingDiagonalObject = MovingDiagonalObject;

    // ------------------------------------------------ public properties
    // using the prototype method means EVERYTHING is public - sucky but easier to do inheritance than closure

    // reference to the stage object
    MovingDiagonalObject.prototype.stage = null;
    MovingDiagonalObject.prototype.speed = 0;
    MovingDiagonalObject.prototype.xDisplace = 0;
    MovingDiagonalObject.prototype.yDisplace = 0;
    MovingDiagonalObject.prototype.dimensions = null;

    // construct custom event object for object moving off stage
    MovingDiagonalObject.prototype.eventOffStage = new createjs.Event("onMovingDiagonalObjectOffStage", true);

    // private variables
    MovingDiagonalObject.prototype.tickerListener = null;

    // ------------------------------------------------ constructor method
    // define initialize method for MovingDiagonalObject
    MovingDiagonalObject.prototype.initialize = function(spriteSheet, myStage) {
        // must fire your super class initialize in order to work
        this.Sprite_initialize(spriteSheet);
        // constructor method entry point
        // ...

        // initialization
        this.stage = myStage;
        this.speed = 2;
        this.dimensions = this.getBounds();
        this.stop();
    };

    // ------------------------------------------------ private methods
    function radianMe(degrees) {
        return (degrees * (Math.PI / 180));
    }

    // ------------------------------------------------ public methods
    MovingDiagonalObject.prototype.startMe = function() {
        // convert current rotation of object to radians
        var radians = radianMe(this.rotation);
        // calculating X and Y displacement
        this.xDisplace = Math.cos(radians) * this.speed;
        this.yDisplace = Math.sin(radians) * this.speed;
        this.play();
        // setup listener to listen for ticker to control animation
        this.tickerListener = createjs.Ticker.on("tick", this.onMove, this);
    };

    MovingDiagonalObject.prototype.stopMe = function() {
        this.stop();
        createjs.Ticker.off("tick", this.tickerListener);
    };

    // ------------------------------------------------ event handlers
    MovingDiagonalObject.prototype.onMove = function(e) {
        // move sprite
        this.x = this.x + this.xDisplace;
        this.y = this.y + this.yDisplace;

        // check if object is off the stage
        if ((this.x < -this.dimensions.width) || (this.x > (this.stage.canvas.width + this.dimensions.width)) || (this.y < -this.dimensions.height) || (this.y > (this.stage.canvas.height + this.dimensions.height))) {
            this.dispatchEvent(this.eventOffStage);
        }
    };

}());
