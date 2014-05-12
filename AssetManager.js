// AssetManager class
// Sean Morrow
// May 6 / 2014

var AssetManager = function() {
	// keep track of assets
    var manifest = null;
	var counter = -1;
	var total = -1;
	// array of spritesheet objects
	var spriteSheets = [];
	//var sounds = [];
	// preloader object
	preloader = new createjs.LoadQueue();

	// construct custom event object and initialize it
	var eventAssetLoaded = new CustomEvent("onAssetLoaded");
	var eventAllLoaded = new CustomEvent("onAssetsLoaded");

	// ------------------------------------------------------ event handlers
	onLoaded = function(e) {
		// what type of asset was loaded?
		switch(e.item.type) {
			case createjs.LoadQueue.IMAGE:
				// spritesheet loaded
				var source = e.item.src;
				var data = e.item.data;
				// determine registration point of sprite
				var x = 0;
				var y = 0;
				if (data.regPoint == "center"){
					x = Math.floor(data.width/2);
					y = Math.floor(data.height/2);
				}
				// construct Spritesheet object from source
				spriteSheet = new createjs.SpriteSheet({
					images:[source],
					frames:{width:data.width, height:data.height, regX:x, regY:y},
					animations: data.animations
				});

				// store spritesheet object for later retrieval
				spriteSheets[e.item.id] = spriteSheet;

				break;
			case createjs.LoadQueue.SOUND:
				// sound loaded
				// not sure we need with SoundJS
				//sounds.push(e.result);
				break;
        }
        // keeping track of how many loaded?
        counter++;
        // an asset has been loaded
        document.dispatchEvent(eventAssetLoaded);
        console.log("asset loaded: " + e.result.src);
	};

	//called if there is an error loading the spriteSheet (usually due to a 404)
	onError = function(e) {
		console.log("Preloader > Error Loading asset");
	};

	onComplete = function(e) {
		if (counter >= total) {
			// dispatch event that all assets are loaded
			document.dispatchEvent(eventAllLoaded);
        }
	};

	// ------------------------------------------------------ public methods
	this.getClip = function(id) {
		// construct sprite object to animate the frames (I call this a clip)
		var sprite = new createjs.Sprite(spriteSheets[id]);
		sprite.name = id;
		sprite.x = 0;
		sprite.y = 0;
		sprite.currentFrame = 0;
		return sprite;
	};

	this.getProgress = function() {
		return (counter/total);
	};

	this.loadAssets = function(myManifest) {
		// setup manifest
        manifest = myManifest;
		counter = 0;
		total = manifest.length;
		// registers the PreloadJS object with SoundJS - will automatically have access to all sound assets
		preloader.installPlugin(createjs.SoundJS);
        preloader.on("fileload", onLoaded);
        preloader.on("error", onError);
        preloader.on("complete", onComplete);
		preloader.setMaxConnections(5);
		// load first spritesheet to start preloading process
		preloader.loadManifest(manifest);
	};
};
