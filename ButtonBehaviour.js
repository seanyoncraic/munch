var ButtonBehaviour = function(clip, states ,stage) {
    // Adds button behaviour to any createJS sprite object

    // the different frames in the sprite for the states of the button
    // can include up, over, down [optional], and disabled [optional]
    var buttonStates = states;

    // state of button (translates to frame number)
    var state = buttonStates.up;
    var enabled = true;

    // private variables
    var frameCount = clip.spriteSheet.getNumFrames();

    // set the stage to accept mouseover events (disabled by default) - if not already set
    stage.enableMouseOver();

    // navigate to new frame in sprite
    clip.gotoAndStop(state);
    stage.update();

    // setup event listeners
    // note we are binding the TicTac function itself to be the this of the event handler
    clip.addEventListener("mousedown", onDown);
    clip.addEventListener("mouseover", onOver);
    clip.addEventListener("mouseout", onOut);

    // -------------------------------------------------------------  get/set methods
    this.getState = function(){
        return state;
    };

    this.getEnabled = function(){
        return enabled;
    };

    // -------------------------------------------------------------  public methods
    this.enableMe = function(){
        enabled = true;
        if (buttonStates.disabled !== undefined) {
            state = buttonStates.up;
            clip.gotoAndStop(state);
            stage.update();
        }
        clip.addEventListener("mousedown", onDown);
        clip.addEventListener("mouseover", onOver);
        clip.addEventListener("mouseout", onOut);
    };

    this.disableMe = function(){
        enabled = false;
        // does the sprite support a disabled state?
        if (buttonStates.disabled !== undefined) {
            state = buttonStates.disabled;
            clip.gotoAndStop(state);
            stage.update();
        }
        clip.removeEventListener("mousedown", onDown);
        clip.removeEventListener("mouseover", onOver);
        clip.removeEventListener("mouseout", onOut);
    };

    // -------------------------------------------------------------  event handlers
    function onDown(e) {
        // is there a down state frame included in the sprite - otherwise Over frame is used
        if (buttonStates.down !== undefined) state = buttonStates.down;
        else state = buttonStates.OVER;
        clip.gotoAndStop(state);
        stage.update();
    }

    function onOver(e) {
        state = buttonStates.over;
        clip.gotoAndStop(state);
        stage.update();
    }

    function onOut(e) {
        state = buttonStates.up;
        clip.gotoAndStop(state);
        stage.update();
    }
};
