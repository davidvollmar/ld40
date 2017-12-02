window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update });
	var keyLeft, keyRight;
	var rotationSpeed = 2;
	var hook;
	var hookRotationRadius = 75;
	var calcangle;

	function preload () {
		game.load.image("hook", "assets/diamond.png");
		game.load.image("cheese", "assets/cheese.png");
	
		game.load.image("mouse", "assets/mouse.png");
		game.load.image("mouse_with_cheese", "assets/mouse.png");
	}

	function create () {

		game.stage.backgroundColor = "#300000";
		
		hook = game.add.sprite(game.world.centerX, game.world.centerY, "hook");
		hook.anchor.setTo(0.5, 0.5); 

		var cheese = game.add.sprite(game.world.centerX, game.world.centerY, "cheese");
		cheese.anchor.setTo(0.5, 0.5);
		cheese.scale.setTo(0.05, 0.05);
		
		var mouse = game.add.sprite(0,0, "mouse");
		mouse.scale.setTo(0.05, 0.05);

		//Define input keys
		keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
	}

	function update() {
		if (keyLeft.isDown)
		{
			hook.angle -= rotationSpeed;
		}
		if(keyRight.isDown) 
		{
			hook.angle += rotationSpeed;
		}

		///angles are defined on a range from -180 to +180
		//initially angle is 0
		//we introduce here 'calcangle' to simplify the calculations for the rotation along the cheese
		calcangle = ((hook.angle + 180) / 360) * 2 * Math.PI;
		hook.x = game.world.centerX + (hookRotationRadius * Math.cos(calcangle));
		hook.y = game.world.centerY + (hookRotationRadius * Math.sin(calcangle));

	}
};
