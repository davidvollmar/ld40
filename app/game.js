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
	var cheese = 8;
	
	function preload () {
		game.load.image("hook", "assets/diamond.png");
		game.load.image("fullhook", "assets/star.png");

		game.load.image("cheese", "assets/cheese.png");
	
		//game.load.image("mouse", "assets/mouse.png");
		game.load.spritesheet('mouse', 'assets/mouse2.png', 720, 1430, 2);
		game.load.image("mouse_with_cheese", "assets/mouse_with_cheese.png");
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

	// KEY HANDLERS

	function shootPressed() {
		if(!hook.pulling && !hook.shooting) {
			keys.shootPressed = true;
		}
	}

	// UPDATES

	function update() {
		resolveCollisions();
		updateHook(hook, keys);
		updateMice(mice);
		updateCurledMice(curledMice);
		updateGameState();
	}	

	function updateGameState() {
		if(cheese <= 0) {
			//TODO game over
			console.log(" TODO game over");
		}
	}

	function updateHook() {
		hook.updateShooting(keys);
		keys.shootPressed = false;
		if (hook.curledMouse) {
			spawnCurleMouse(hook.sprite.x, hook.sprite.y, hook.sprite.rotation + Math.PI);
		}

		hook.updatePosition(keys);
		hook.updateAngle();
		hook.updateState();
	}

	function updateCurledMice(curledMice) {
		for(curledMouseIndex in curledMice) {
			var curledMouse = curledMice[curledMouseIndex];
			curledMouse.move();

			//remove if out of bounds
			if(curledMouse.sprite.x > game.windowWidth || 
	        	curledMouse.sprite.x < 0 ||
	        	curledMouse.sprite.y < 0 || 
	        	curledMouse.sprite.y > game.windowHeight) {

				curledMice.splice(curledMouseIndex, 1);
				curledMouse.sprite.destroy();
			}
		}
	}

	function updateMice(mice) {
	    if(Math.random() < 0.01 && mice.length < 50) {        
	        mice.push(spawnMouse());
	    }

	    mice.map(function(mouse) {
	        mouse.updateMouse();
	        if(mouse.pickedupCheese) {
	        	mouse.pickedupCheese = false;
	        	mouse.animation.destroy();
	        	mouse.sprite.destroy();
	        	mouse.sprite = game.add.sprite(mouse.sprite.x, mouse.sprite.y, "mouse_with_cheese");
	        	mouse.sprite.scale.setTo(0.15, 0.15);
	        	mouse.sprite.anchor.setTo(0.5, 0.5);
	        	cheese--;
	        }
	    });
	}

	// COLLISION HANDLERS

	function resolveCollisions() {
		resolveHookCollisions();
		resolveMiceCollisions();
	}

	//resolve collisions between hook and mice
	function resolveHookCollisions() {
		//first check collisions, then if a collision is found, remove the mouse from the mice array and update hook state
		var mouseIndex = getHookMouseCollision();
		if (mouseIndex >= 0) {
			var mouseToDelete = mice[mouseIndex];
			mouseToDelete.sprite.destroy();
			mice.splice(mouseIndex, 1);

			//update hook state
			hook.pulling = true;
			hook.shooting = false;
			hook.caughtMouse = true;
			cheese++;

			hook.sprite.loadTexture('fullhook', 0, false);
		}
	}

	//resolve collisions between curledmice and normal mice
	function resolveMiceCollisions() {
		for (curledMouseIndex in curledMice) {
			var curledMouse = curledMice[curledMouseIndex];
			var mouseIndex = getCurledMouseCollision(curledMouse);
			if(mouseIndex >= 0) {
				//increasing the sprite of the curling mouse, to indicate that we picked up another mouse
				curledMouse.sprite.scale.setTo(0.1, 0.1);

				//deleting the hit mouse
				var mouseToDelete = mice[mouseIndex];
				mouseToDelete.sprite.destroy();
				mice.splice(mouseIndex, 1);
			}
		}		
	}

	function getCurledMouseCollision(curledMouse) {
		var collidedMouse = -1;
		for(mouseIndex in mice) {
			if(collidedMouse < 0) {
				var mouse = mice[mouseIndex];

				var distance = Math.sqrt( 
					((curledMouse.sprite.x - mouse.sprite.x) * (curledMouse.sprite.x - mouse.sprite.x)) + 
					((curledMouse.sprite.y - mouse.sprite.y) * (curledMouse.sprite.y - mouse.sprite.y))
				);

				if (distance < curledMouse.collisionDistance) {
					collidedMouse = mouseIndex;
				}
			}
		}
		return collidedMouse;
	}

	function getHookMouseCollision() {
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

						collidedMouse = mouseindex;
					}
				}
			}
		}
		return collidedMouse;
	}

	// OTHER FUNCTIONS

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

	function spawnCurleMouse(x, y, r) {
		curledMice.push(new CurleMouse(x, y, r));
	}
};
