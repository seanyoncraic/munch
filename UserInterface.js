var UserInterface = function(myStage, myAssetManager) {
    // initialization
    var stage = myStage;
    var assetManager = myAssetManager;
    var gameConstants = window.gameConstants;
    var bugsEaten = 0;
    var snakeSpeed = gameConstants.SNAKE_MAX_SPEED;

    // grab clip for UserInterface and add to stage canvas
    var clip = assetManager.getClip("UserInterface");
    clip.x = 10;
    clip.y = 10;
    stage.addChild(clip);

    var txtBugs = new createjs.Text("", "Bold 20px Arial", "#000000");
    txtBugs.x = 175;
    txtBugs.y = 28;
    txtBugs.textBaseline = "alphabetic";
    stage.addChild(txtBugs);

    var speedBar = new createjs.Shape();
    stage.addChild(speedBar);

    // -------------------------------------------------- get / set methods
    this.setBugsEaten = function(value) {
        bugsEaten = value;
        txtBugs.text = bugsEaten;
    };

    this.setSnakeSpeed = function(value) {
        snakeSpeed = value;
        // adjust width of speedBar
        var width = (snakeSpeed / gameConstants.SNAKE_MAX_SPEED) * 80;

        console.log("speed change: " + snakeSpeed);

        speedBar.graphics.clear();
        speedBar.graphics.beginFill("#66CC33").drawRect(41,15,width,10);
    };


    // -------------------------------------------------- public methods
    this.startMe = function() {
        this.setBugsEaten(0);
        this.setSnakeSpeed(gameConstants.SNAKE_MAX_SPEED);
    }


};
