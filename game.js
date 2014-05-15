// TODO
// > change assetmanager of Tic Tac Toe so the manifest is external
// > assetmanager now includes count property in data so that you can specify the number of frames for the sprite. If this is excluded it is calculated
// based on the side of the spritesheet image. If you have any blank frames in your spritesheet they will be added to the animation. Count counters this.
// only an issue if you don't specify the animations
// Fix custom events in biplane 3 to new createjs.Event("name",true)
// Add feature to asset manager to load json
// get rid of dimensions and hard code it?
// scoreboard added
// check GameConstants in betting game - used in RaceScreen but not passed in???
// figure out standard for window.gameConstants for accessing globals
// does snake class need getClip() method anymore?



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
var assetManager, introCaption, background, snake, gameOverCaption;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
var userInterface;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var gameConstants = {
	"FRAME_RATE":26,
    "SNAKE_MAX_SPEED":5
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
    animations:{alive:[0,11], dead:[12,29]}}},
    {src:"lib/UserInterface.png", id:"UserInterface", data:{
    width:161, height:19, regPoint:"TopLeft",
    animations:{}}}
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
    snake = new Snake(stage, assetManager, gameConstants);
    snake.resetMe();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    userInterface = new UserInterface(stage, assetManager);
    userInterface.startMe();
    stage.addEventListener("onSnakeSpeedChange", onSnakeSpeedChange, true);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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

    // current state of keys
    leftKey = false;
    rightKey = false;
    upKey = false;
    downKey = false;

    // setup event listeners for keyboard keys
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);

    // startup the ticker
    createjs.Ticker.setFPS(gameConstants.FRAME_RATE);
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
    userInterface.setBugsEaten(bugsEaten);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // decrease the amount of bugs on the screen every ten bugs eaten
    if ((bugsEaten % 10) === 0) {
        bugDelay = bugDelay + 500;
        bugTimer.delay = bugDelay;
    }

    console.log("onBugEaten");

}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
function onSnakeSpeedChange(e) {
    userInterface.setSnakeSpeed(e.target.speed);
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function onGameOver(e) {

    console.log("onGameOver");

    // gameOver
    clearInterval(bugTimer);
    stage.addChild(gameOverCaption);

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
        } else if (rightKey) {
            snake.go(MovingObject.RIGHT);
        } else if (upKey) {
            snake.go(MovingObject.UP);
        } else if (downKey) {
            snake.go(MovingObject.DOWN);
        } else {
            snake.stopMe();
        }
    }

    // update the stage!
	stage.update();
}

