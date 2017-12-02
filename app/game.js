var game;

window.onload = function() {
	var windowWidth = 800;
	var windowHeight = 600;
	
	game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, "", { preload: preload, create: create, update: update });
	var keys = {
		keyLeft: null, 
		keyRight: null,
		keyShoot: null,
		shootPressed: false
	};

	var hook = new Hook();

	var mice = [];
	var curledMice = [];
	
	function preload () {
		game.load.image("hook", "assets/diamond.png");
		game.load.image("fullhook", "assets/star.png");

		game.load.image("cheese", "assets/cheese.png");
	
		game.load.image("mouse", "assets/mouse.png");
		game.load.image("mouse_with_cheese", "assets/mouse.png");
	}

	function create () {

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#300000";
		
		hook.sprite = game.add.sprite(game.world.centerX, game.world.centerY, "hook");
		hook.sprite.anchor.setTo(0.5, 0.5); 

		var cheese = game.add.sprite(game.world.centerX, game.world.centerY, "cheese");
		cheese.anchor.setTo(0.5, 0.5);
		cheese.scale.setTo(0.05, 0.065);

		//Define input keys
		keys.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		keys.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		//the left and right keys we want to be able to keep pressing, but spacebar should be a one-time hit per press
		keys.keyShoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		keys.keyShoot.onDown.add(shootPressed);

		//initialize 
		hook.currentRadius = hook.defaultRadius;
	}

	function shootPressed() {
		if(!hook.pulling && !hook.shooting) {
			keys.shootPressed = true;
		}
	}

	function update() {
		resolveCollisions();
		updateHook(hook, keys);
		updateMice(mice);
		updateCurledMice(curledMice);
	}	

	function resolveCollisions() {
		resolveHookCollisions();
		resolveMiceCollisions();
	}

	//resolve collisions between hook and mice
	function resolveHookCollisions() {
		//first check collisions, then if a collision is found, remove the mouse from the mice array and update hook state
		var mouseIndex = getCollision();
		if (mouseIndex >= 0) {
			var mouseToDelete = mice[mouseIndex];
			mouseToDelete.sprite.destroy();
			mice.splice(mouseIndex, 1);

			//update hook state
			hook.pulling = true;
			hook.shooting = false;
			hook.caughtMouse = true;

			hook.sprite.loadTexture('fullhook', 0, false);
		}
	}

	//resolve collisions between curledmice and normal mice
	function resolveMiceCollisions() {
		var mouseIndices = getMiceCollisions();
		for (mouseIndex in mouseIndices) {
			var mouseToReplace = mice[mouseIndex];
			mouseToReplace.sprite.destroy();
			mice.splice(mouseIndex, 1);

			//now create 1 new curledmouse and change the direction of the other one

		}
	}

	function getMiceCollisions() {
		var collidedmice = [];
		//TODO implement
		return collidedmice;
	}

	function getCollision() {
		var collidedMouse = -1;
		if(hook.shooting) {
			for(var mouseindex in mice) {
				if(collidedMouse < 0) {	//only catch 1 mouse at a time
					var mouse = mice[mouseindex];				
					//lazy collision detection, just compare distance.
					//if mouse caught, remove from mice array and change hooksprite to caughtmouse sprite.
					if (Math.sqrt( 
						((hook.sprite.x - mouse.sprite.x) * (hook.sprite.x - mouse.sprite.x)) + 
						((hook.sprite.y - mouse.sprite.y) * (hook.sprite.y - mouse.sprite.y))) <
						hook.collisionDistance) {

						console.log("COLLIDED");
						collidedMouse = mouseindex;
					}
				}
			}
		}
		return collidedMouse;
	}

	function curleMouse() {
		curledMice.push(new CurleMouse(hook.sprite.x, hook.sprite.y, hook.sprite.rotation + Math.PI));
	}

	function updateHook(hook, keys) {
		updateHookPosition(hook, keys);
		updateHookState(hook);
		updateHookAngle(hook);
	}


	function updateHookPosition(hook, keys) {
		if (hook.shooting || hook.pulling) {
			if(hook.shooting) {
				hook.currentRadius += hook.shootingSpeed;
			}
			if(hook.pulling) {
				var pullingSpeed = hook.caughtMouse ? hook.pullingMouseSpeed : hook.pullingEmptySpeed;
				hook.currentRadius -= pullingSpeed;
			}
		} else {//so if (!shooting && !pulling) 
			if (keys.keyLeft.isDown) {
				hook.sprite.angle -= hook.rotationSpeed;
			}
			if(keys.keyRight.isDown) {
				hook.sprite.angle += hook.rotationSpeed;
			}
			if(keys.shootPressed) {
				if(hook.caughtMouse) {
					curleMouse(hook.sprite.x, hook.sprite.y);
					hook.curledMouse = true;
				} else {
					hook.shooting = true;	
				}	
				keys.shootPressed = false;		
			}
		}	
	}

	function updateHookState(hook) {
		if (hook.shooting && (hook.currentRadius >= hook.maxRadius)) {			
			hook.pulling = true;
			hook.shooting = false;
		}
		if (hook.pulling && (hook.currentRadius <= hook.defaultRadius)) {
			hook.pulling = false;
			hook.currentRadius = hook.defaultRadius;
		}	
		if(hook.caughtMouse && hook.curledMouse) {
			hook.caughtMouse = false;
			hook.curledMouse = false;
			hook.sprite.loadTexture('hook', 0, false);
		}
	}

	function updateHookAngle(hook) {
		///angles are defined on a range from -180 to +180
		//initially angle is 0
		//we introduce here 'calcAngle' to simplify the calculations for the rotation along the cheese
		hook.calcAngle = ((hook.sprite.angle + 180) / 360) * 2 * Math.PI;
		
		hook.sprite.x = game.world.centerX + (hook.currentRadius * Math.cos(hook.calcAngle));
		hook.sprite.y = game.world.centerY + (hook.currentRadius * Math.sin(hook.calcAngle));
	}

	function updateCurledMice(curledMice) {
		curledMice.map(function(curledMouse) {
	        curledMouse.move();
	    });
	}

	function updateMice(mice) {
	    if(Math.random() < 0.01 && mice.length < 50) {        
	        mice.push(spawnMouse());
	    }

	    mice.map(function(mouse) {
	        mouse.updateMouse();
	    });
	}

	function spawnMouse() {
	    var rand = Math.random();
	    if(rand <= .25) {
	        return new Mouse(Math.random() * window.screen.width, 0);        
	    } else if(rand <= .5) {
	        return new Mouse(Math.random() * window.screen.width, window.screen.height);    
	    } else if(rand <= .75) {
	        return new Mouse(0, Math.random() * window.screen.height);
	    } else {
	        return new Mouse(window.screen.width, Math.random() * window.screen.height);
	    }
	}
};
