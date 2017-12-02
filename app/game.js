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
	
	function preload () {
		game.load.image("hook", "assets/diamond.png");
		game.load.image("fullhook", "assets/star.png");

		game.load.image("cheese", "assets/cheese.png");
	
		game.load.image("mouse", "assets/mouse.png");
		game.load.image("mouse_with_cheese", "assets/mouse.png");
	}

	function create () {
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

		draw();
	}	

	function resolveCollisions() {
		//first check collisions, then if a collision is found, remove the mouse from the mice array and update hook state
		var mouseIndex = getCollision();
		if (mouseIndex >= 0) {
			var mouseToDelete = mice[mouseIndex];
			mouseToDelete.sprite.x = -1000;//TODO fix proper delete
			mice.splice(mouseIndex, 1);

			//update hook state
			hook.pulling = true;
			hook.shooting = false;
			hook.caughtMouse = true;

			hook.sprite.loadTexture('fullhook', 0, false);
		}
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

						collidedMouse = mouseindex;
					}
				}
			}
		}
		return collidedMouse;
	}

	function draw() {
		///angles are defined on a range from -180 to +180
		//initially angle is 0
		//we introduce here 'calcAngle' to simplify the calculations for the rotation along the cheese
		hook.calcAngle = ((hook.sprite.angle + 180) / 360) * 2 * Math.PI;

		//when "shooting" the hook, we simply increase the radius.

		hook.sprite.x = game.world.centerX + (hook.currentRadius * Math.cos(hook.calcAngle));
		hook.sprite.y = game.world.centerY + (hook.currentRadius * Math.sin(hook.calcAngle));

	}
};
