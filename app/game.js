var game;

window.onload = function() {
	//magic numbers
	var windowWidth = 800;
	var windowHeight = 600;
	
	var cheeseLeft; //whenever a mouse takes a piece, cheese--. if cheese == 0, game over
	var score;
	var mouseSpawningProbability;
	var maximumNrOfMice;
	var gameover = false;

	initMagicNumbers();

	//game init
	game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, "", { preload: preload, create: create, update: update });	
	//declare other variables
	var keys = {
		keyLeft: null, 
		keyRight: null,
		keyShoot: null,
		shootPressed: false,
		keyRestart: null
	};
	var hook = new Hook();
	var mice = [];
	var curledMice = [];

	//GAME INIT FUNCTIONS
	
	function initMagicNumbers() {
		cheeseLeft = 20;
		score = 0;
		mouseSpawningProbability = 0.01;
		maximumNrOfMice = 10;
	}

	function preload () {
		game.load.image("background", "assets/background.jpeg");

		game.load.image("hook", "assets/diamond.png");
		game.load.image("fullhook", "assets/star.png");

		game.load.image("cheese", "assets/cheese.png");
	
		game.load.spritesheet('mouse', 'assets/mouse2.png', 720, 1430, 2);
		game.load.image("mouse_with_cheese", "assets/mouse_with_cheese.png");
	}

	function create () {
		background = game.add.tileSprite(0, 0, windowWidth, windowHeight, "background");
		
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

		keys.keyRestart = game.input.keyboard.addKey(Phaser.Keyboard.R);
		keys.keyRestart.onDown.add(restartPressed);

		//initialize 
		hook.currentRadius = hook.defaultRadius;

		//score text top corner
		cheeseLeftText = game.add.text(130, 30, "Cheese Left: " + cheeseLeft, {
	        font: "32px Arial",
	        fill: "#ffffff",
	        align: "left"
	    });

	    scoreText = game.add.text(130, 60, "Score: " + score, {
	    	font: "32px Arial",
	    	fill: "#ffffff",
	    	align: "left"	    	
	    });

	    deadText = game.add.text(game.world.centerX, game.world.centerY, "", {
			font: "64px Arial",
    		fill: "#ffffff",
    		align: "left"	
		});
		
	    cheeseLeftText.anchor.setTo(0.5, 0.5);
	    scoreText.anchor.setTo(0.5, 0.5);
	    deadText.anchor.setTo(0.5, 0.5);
	}

	// KEY HANDLERS

	function shootPressed() {
		if(!hook.pulling && !hook.shooting) {
			keys.shootPressed = true;
		}
	}

	function restartPressed() {
		if(gameover) {
			for(mouseIndex in mice) {
				var mouse = mice[mouseIndex];
				mouse.sprite.destroy();
			}
			mice = [];

			for(mouseIndex in curledMice) {
				var curledMouse = curledMice[mouseIndex];
				curledMouse.sprite.destroy();
			}
			curledMice = [];

			initMagicNumbers();
			updateScoreTexts();

			deadText.setText("");
			gameover = false;
		}
	}

	// UPDATES

	function update() {
		if(!gameover) {
			resolveCollisions();
			updateHook();
			updateMice();
			updateCurledMice();
			updateGameState();
		}
	}	

	function updateGameState() {
		if(cheeseLeft <= 0) {
			gameover = true;
			deadText.setText("GAME OVER\n Press R to get more cheese");			
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

	function updateCurledMice() {
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

	function updateMice() {
	    if(Math.random() < mouseSpawningProbability && mice.length < maximumNrOfMice) {        
	        mice.push(spawnMouse());
	    }
	    
	    for(mouseIndex in mice) {
	    	var mouse = mice[mouseIndex];
	    	mouse.updateMouse();

	    	//change sprite if picked up cheese
	    	if(mouse.pickedupCheese) {
	        	mouse.pickedupCheese = false;
	        	mouse.animation.destroy();
	        	mouse.sprite.destroy();
	        	mouse.sprite = game.add.sprite(mouse.sprite.x, mouse.sprite.y, "mouse_with_cheese");
	        	mouse.sprite.scale.setTo(0.15, 0.15);
	        	mouse.sprite.anchor.setTo(0.5, 0.5);
	        	updateLife(-1);
	        }

	        //remove if escaped with the cheese
	        if(mouse.escaped) {
	        	mice.splice(mouseIndex, 1);
	        	mouse.sprite.destroy();
	        }
	    }
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

			//update hook state
			hook.pulling = true;
			hook.shooting = false;
			hook.caughtMouse = true;
			if(mouseToDelete.hasCheese) {				
				updateLife(1);
			}

			hook.sprite.loadTexture('fullhook', 0, false);

			//delete caught mouse from mice admin
			mouseToDelete.sprite.destroy();
			mice.splice(mouseIndex, 1);

			updateScore(1);			
		}
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
						mouse.collisionDistance) {

						collidedMouse = mouseindex;
					}
				}
			}
		}
		return collidedMouse;
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

				updateScore(1);
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

	// OTHER FUNCTIONS

	function spawnMouse() {
	    var rand = Math.random();
	    var offset  = 100; //place the mice 100 outside of the screen, such that the cleaning up is done neatly outside of the view

	    if(rand <= .25) {
	        return new Mouse(Math.random() * windowWidth, 0 - offset);        
	    } else if(rand <= .5) {
	        return new Mouse(Math.random() * windowWidth, windowHeight + offset);    
	    } else if(rand <= .75) {
	        return new Mouse(0 - offset, Math.random() * windowHeight);
	    } else {
	        return new Mouse(windowWidth + offset, Math.random() * windowHeight);
	    }
	}

	function spawnCurleMouse(x, y, r) {
		curledMice.push(new CurleMouse(x, y, r));
	}

	function updateLife(delta) {
		cheeseLeft += delta;
		updateScoreTexts();
	}

	function updateScore(delta) {
		score += delta;

		//increase difficulty "all" the time
		if(maximumNrOfMice <= 50 && mouseSpawningProbability < 1) {
			maximumNrOfMice++;
			mouseSpawningProbability *= 1.01;
		}

		updateScoreTexts();
	}

	function updateScoreTexts() {		
		cheeseLeftText.setText("Cheese Left: " + cheeseLeft + "!");
		scoreText.setText("Score: " + score + "!");
	}
};
