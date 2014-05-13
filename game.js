// IDEAS FOR LESSONS FOR COURSE
// lesson on over git and github with students for brackets
// add BitmapText and Text classes to the textfields lesson
// const is supported in firefox and chrome. Safari and Opera allow it but take it as a var. IE 10 is not supported but IE 11 does
// using ZOE for spritesheet generation (http://www.youtube.com/watch?v=uUX2E-otOUc) - note on how to place your registration point and all assets must be in main timeline with frame labels to define different animations. Generates JSON that can be used with AssetManager so ALL assets are in one spritesheet. See lib folder of HTML5 Munch
// add challenge to take this game and add sound effects?
// javascript timers (setInterval() and setTimeout())
// there is no width and height for sprites - you need to use getBounds().width, etc. Add to MovingObject class lesson

// TODO
// > change assetmanager of Tic Tac Toe so the manifest is external
// > assetmanager now includes count property in data so that you can specify the number of frames for the sprite. If this is excluded it is calculated
// based on the side of the spritesheet image. If you have any blank frames in your spritesheet they will be added to the animation. Count counters this.
// only an issue if you don't specify the animations


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
    width:30, height:38, regPoint:"TopLeft",
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


    console.log("stage: " + stage.canvas.width);


    // enable mouseover events for the stage - disabled by default since they can be expensive
    stage.enableMouseOver();

	// construct preloader object to load spritesheet and sound assets
	assetManager = new AssetManager();
    document.addEventListener("onAssetsLoaded", onSetup);
    // load the assets
	assetManager.loadAssets(manifest);
}

function onSetup() {
	console.log(">> setup");
	// kill event listener
	document.removeEventListener("onAssetsLoaded", onSetup);

    // construct game objects
    background = assetManager.getClip("Background");
    stage.addChild(background);
    introCaption = assetManager.getClip("IntroCaption");
    introCaption.x = 50;
    introCaption.y = 50;
    stage.addChild(introCaption);
    gameOverCaption = assetManager.getClip("GameOverCaption");

    /*
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CHALLENGE SOLUTION
    scoreBoard = new ScoreBoard();
    this.addEventListener(Snake.SNAKE_SLOWED, onSnakeSlowed, true);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    // setup event listener to start game
    background.on("click", onStartGame, this);

    // setup game event listeners
    document.addEventListener("onMoveDiagonalOffStage", onKillBug);
    document.addEventListener("onBugEaten", onBugEaten);
	document.addEventListener("onSnakeKilled", onGameOver);

    /*
    // ?????????????????????? TESTING
    snake = assetManager.getClip("Snake");
    snake.x = 0;
    snake.y = 0;
    snake.gotoAndPlay("alive");
    stage.addChild(snake);
    */

    stage.update();

}

function onStartGame(e) {
    stage.removeChild(introCaption);
    // initialization
    bugsEaten = 0;

    // construct snake object and setup
    snake = new Snake(stage, assetManager);
    snake.setupMe();

    // construct and setup bugtimer to drop bugs on displaylist
    //bugDelay = 500;
    //bugTimer = setInterval(onAddBug, bugDelay);


    /*
    // construct snake object (player)
    snake = assetManager.getClip("Snake");
    snake.gotoAndPlay("alive");
    // stop snake moving by default
    //snake.stopMe();
    //snake.setupMe();
    stage.addChild(snake);

    var snake = new MovingObject(assetManager.getSpriteSheet("Snake"), stage);
    snake.x = 100;
    snake.y = 100;
    snake.setDirection(MovingObject.DOWN);
    snake.gotoAndPlay("alive");
    snake.startMe();
    stage.addChild(snake);


    var bug = new MovingDiagonalObject(assetManager.getSpriteSheet("Bug"), stage);
    bug.x = 200;
    bug.y = 200;
    bug.rotation = 45;
    bug.gotoAndPlay("alive");
    bug.startMe();
    stage.addChild(bug);
    */

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
    createjs.Ticker.on("tick", onTick, this);
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

}

function onKillBug(e) {

}

function onBugEaten(e) {

}

function onGameOver(e) {

}

function onResetGame(e) {

}

function onTick(e) {
    // !!!!!!!!!!!!!!!!!!! TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

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

