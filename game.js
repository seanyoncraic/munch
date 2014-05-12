// IDEAS FOR LESSONS FOR COURSE
// lesson on over git and github with students for brackets
//

// TODO
// change assetmanager of Tic Tac Toe so the manifest is external


// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

// game variables
var stage = null;
var canvas = null;

// game objects
var snake;

// object to preload and handle all assets (spritesheet and sounds)
var assetManager;

var GameConstants = {
	"FRAME_RATE":26
};

// manifest of asset information
var manifest = [
    {src:"lib/Snake.png", id:"Snake", data:{
    width:108, height:73, regPoint:"TopLeft",
    animations:{alive:[0,11], dead:[12,39]}}}
];

// ------------------------------------------------------------ event handlers
function onInit() {
	console.log(">> initializing");

	// get reference to canvas
	canvas = document.getElementById("stage");
	// set canvas to as wide/high as the browser window
	canvas.width = 600;
	canvas.height = 200;
	// create stage object
	stage = new createjs.Stage(canvas);

	// color the background of the game with a shape
	background = new createjs.Shape();
	background.graphics.beginFill("#999999").drawRect(0,0,600,200);
	background.cache(0,0,600,200);
	stage.addChild(background);

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

    // startup the ticker
    createjs.Ticker.setFPS(GameConstants.FRAME_RATE);
    createjs.Ticker.on("tick", onTick, this);


    snake = assetManager.getClip("Snake");
    snake.x = 100;
    snake.y = 100;
    snake.gotoAndPlay("alive");
    stage.addChild(snake);



}

function onTick(e) {
    // TESTING FPS
    document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();





    // update the stage!
	stage.update();
}

