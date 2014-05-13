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
    // static constant hacking by adding them on as property of object

    // reference to the stage object
    var stage = null;
    var speed = 0;
    var xDisplace = 0;
    var yDisplace = 0;
    var dimensions = null;

    // construct custom event object for object moving off stage
    var eventOffStage = new CustomEvent("onMovingDiagonalObjectOffStage");
    // private variables
    var tickerListener = null;

    // ------------------------------------------------ constructor method
    // define initialize method for MovingDiagonalObject
    MovingDiagonalObject.prototype.initialize = function(spriteSheet, myStage) {
        // must fire your super class initialize in order to work
        this.Sprite_initialize(spriteSheet);
        // constructor method entry point
        // ...

        // initialization
        stage = myStage;
        speed = 2;
        dimensions = this.getBounds();
        this.stop();
    };

    // ------------------------------------------------ get/set methods
    MovingDiagonalObject.prototype.getSpeed = function() {
        return speed;
    };
    MovingDiagonalObject.prototype.setSpeed = function(value) {
        speed = value;
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
        xDisplace = Math.cos(radians) * speed;
        yDisplace = Math.sin(radians) * speed;

        this.play();
        // setup listener to listen for ticker to control animation
        tickerListener = createjs.Ticker.on("tick", this.onMove, this);
    };

    MovingDiagonalObject.prototype.stopMe = function() {
        this.stop();
        createjs.Ticker.off("tick", tickerListener);
    };

    // ------------------------------------------------ event handlers
    MovingDiagonalObject.prototype.onMove = function(e) {
        // move sprite
        this.x = this.x + xDisplace;
        this.y = this.y + yDisplace;

        // check if object is off the stage
        if ((this.x < -dimensions.width) || (this.x > (stage.canvas.width + dimensions.width)) || (this.y < -dimensions.height) || (this.y > (stage.canvas.height + dimensions.height))) {
            document.dispatchEvent(eventOffStage);
        }
    };

}());
