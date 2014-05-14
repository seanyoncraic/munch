// IDEAS FOR LESSONS FOR COURSE
// lesson on over git and github with students for brackets
// add BitmapText and Text classes to the textfields lesson
// const is supported in firefox and chrome. Safari and Opera allow it but take it as a var. IE 10 is not supported but IE 11 does
// using ZOE for spritesheet generation (http://www.youtube.com/watch?v=uUX2E-otOUc) - note on how to place your registration point and all assets must be in main timeline with frame labels to define different animations. Generates JSON that can be used with AssetManager so ALL assets are in one spritesheet. See lib folder of HTML5 Munch
// add challenge to take this game and add sound effects?
// javascript timers (setInterval() and setTimeout())
// there is no width and height for sprites - you need to use getBounds().width, etc. Add to MovingObject class lesson
// to approaches to object orientation in JS - prototype and closure http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript
// demo a central game event listener much like I did in biplane 3
// two things not supported by createjs - keyboard listeners and timers (setInterval())
// must find third part pixel perfect collision detection tool
// collision detection using hittest (localToGlobal, etc) http://www.createjs.com/tutorials/HitTest/
// radius collision detection and others http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/

// TODO
// > change assetmanager of Tic Tac Toe so the manifest is external
// > assetmanager now includes count property in data so that you can specify the number of frames for the sprite. If this is excluded it is calculated
// based on the side of the spritesheet image. If you have any blank frames in your spritesheet they will be added to the animation. Count counters this.
// only an issue if you don't specify the animations
// Fix custom events in biplane 3 to new createjs.Event("name",true)
// Add feature to asset manager to load json
// get rid of dimensions and hard code it?



// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

// game variables
var stage = null;
var canvas = null;
var downKey = false;
var upKey = false;
var leftKey = false;
var rightKey = false;
// bug timer to add gameplay
var bugTimer = null;
var bugDelay = 0;
var bugsEaten = 0;

// object to preload and handle all assets (spritesheet and sounds)
var assetManager, introCaption, background, snake, gameOverCaption, scoreBoard;

var GameConstants = {
	"FRAME_RATE":26
};

// manifest of asset information
var manifest = [
    {src:"lib/Snake.png", id:"Snake", data:{
    width:108, height:73, regPoint:"center",
    animations:{alive:[0,11], dead:[12,39]}}},
    {src:"lib/Background.png", id:"Background", data:{
    width:600, height:600, regPoint:"TopLeft",
    animations:{}}},
    {src:"lib/IntroCaption.png", id:"IntroCaption", data:{
    width:165, height:62, regPoint:"TopLeft",
    animations:{}}},
    {src:"lib/GameOverCaption.png", id:"GameOverCaption", data:{
    width:222, height:45, regPoint:"TopLeft",
    animations:{}}},
    {src:"lib/Bug.png", id:"Bug", data:{
    width:30, height:38, regPoint:"center",
    animations:{alive:[0,11], dead:[12,29]}}}
];

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");

	// get reference to canvas
	canvas = document.getElementById("stage");
	// set canvas to as wide/high as the browser window
	canvas.width = 600;
	canvas.height = 600;
	// create stage object
    stage = new createjs.Stage(canvas);

    // enable mouseover events for the stage - disabled by default since they can be expensive
    stage.enableMouseOver();

	// construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    stage.addEventListener("onAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);
}

function onSetup() {
	console.log(">> setup");
	// kill event listener
	stage.removeEventListener("onAssetsLoaded", onSetup);

    // construct game objects
    background = assetManager.getClip("Background");
    stage.addChild(background);
    introCaption = assetManager.getClip("IntroCaption");
    introCaption.x = 50;
    introCaption.y = 50;
    stage.addChild(introCaption);
    gameOverCaption = assetManager.getClip("GameOverCaption");
    gameOverCaption.x = 50;
    gameOverCaption.y = 50;
    snake = new Snake(stage, assetManager);
    snake.resetMe();

    /*
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    scoreBoard = new ScoreBoard();
    this.addEventListener(Snake.SNAKE_SLOWED, onSnakeSlowed, true);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    // setup event listener to start game
    background.addEventListener("click", onStartGame);
    // setup game event listeners to listen on the capture phase
    stage.addEventListener("onBugEaten", onBugEaten, true);
	stage.addEventListener("onSnakeKilled", onGameOver, true);
    stage.update();
}

function onStartGame(e) {
    stage.removeChild(introCaption);
    // initialization
    bugsEaten = 0;

    // remove click event on background
    background.removeEventListener("click", onStartGame);

    // start the snake object
    snake.startMe();

    // construct and setup bugtimer to drop bugs on displaylist
    bugDelay = 500;
    bugTimer = setInterval(onAddBug, bugDelay);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    // add scoreboard to displaylist
    //this.addChild(scoreBoard);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // current state of keys
    leftKey = false;
    rightKey = false;
    upKey = false;
    downKey = false;

    // setup event listeners for keyboard keys
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

    // startup the ticker
    createjs.Ticker.setFPS(GameConstants.FRAME_RATE);
    createjs.Ticker.addEventListener("tick", onTick);
}

function onKeyDown(e) {
    // which keystroke is down?
    if (e.keyCode == 37) leftKey = true;
    else if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
}

function onKeyUp(e) {
    // which keystroke is up?
    if (e.keyCode == 37) leftKey = false;
    else if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
}

function onAddBug(e) {
    // add bug to the stage
    var bug = new Bug(stage, assetManager, snake);
    bug.startMe();
}

function onBugEaten(e) {
    // increment bug counter
    bugsEaten++;
    // energize the snake with energy
    snake.energizeMe();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    // update scoreboard
    //scoreBoard.snakeSpeed = snake.speed;
    //scoreBoard.bugs = bugs;
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // decrease the amount of bugs on the screen every ten bugs eaten
    if ((bugsEaten % 10) == 0) {
        bugDelay = bugDelay + 500;
        bugTimer.delay = bugDelay;
    }

    console.log("onBugEaten");

}

function onGameOver(e) {

    console.log("onGameOver");

    // gameOver
    clearInterval(bugTimer);
    stage.addChild(gameOverCaption);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    //this.removeChild(scoreBoard);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // add listener to reset game when click background
    background.addEventListener("click", onResetGame);

    // remove all listeners
	document.removeEventListener("keydown", onKeyDown);
	document.removeEventListener("keyup", onKeyUp);
    createjs.Ticker.off("tick", onTick);
}

function onResetGame(e) {
    // kill event listener and add listener to start a new game again
    background.removeEventListener("click", onResetGame);
    background.addEventListener("click", onStartGame);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    //scoreBoard.resetMe();
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // reset the snake
    snake.resetMe();

    // adjust caption on screen
    stage.removeChild(gameOverCaption);
    stage.addChild(introCaption);
    stage.update();
}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

    // only monitor keyboard if snake is alive
    if (!snake.getKilled()) {
        if (leftKey) {
            snake.go(MovingObject.LEFT);
            //snake.direction = MovingObject.LEFT;
            //snake.startMe();
        } else if (rightKey) {
            snake.go(MovingObject.RIGHT);
            //snake.direction = MovingObject.RIGHT;
            //snake.startMe();
        } else if (upKey) {
            snake.go(MovingObject.UP);
            //snake.direction = MovingObject.UP;
            //snake.startMe();
        } else if (downKey) {
            snake.go(MovingObject.DOWN);
            //snake.direction = MovingObject.DOWN;
            //snake.startMe();
        } else {
            snake.stopMe();
            //snake.stop();
            //snake.stopMe();
        }
    }

    // update the stage!
	stage.update();
}

