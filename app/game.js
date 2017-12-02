window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update });
	var keyLeft, keyRight;
	var hook = 
	{
		sprite: null,
		defaultRadius: 75,
		currentRadius: 75,
		maxRadius: 500,
		calcAngle: 0,
		rotationSpeed: 2,
		shooting: false,
		pulling: false,
		shootingSpeed: 3,
		pullingSpeed: 2
	};

	function preload () {
		game.load.image("hook", "assets/diamond.png");
		game.load.image("cheese", "assets/cheese.png");
	}

	function create () {

		game.stage.backgroundColor = "#300000";
		
		hook.sprite = game.add.sprite(game.world.centerX, game.world.centerY, "hook");
		hook.sprite.anchor.setTo(0.5, 0.5); 

		var cheese = game.add.sprite(game.world.centerX, game.world.centerY, "cheese");
		cheese.anchor.setTo(0.5, 0.5);
		cheese.scale.setTo(0.05, 0.05);

		//Define input keys
		keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		keyShoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//initialize 
		hook.currentRadius = hook.defaultRadius;
	}

	function update() {

		if (hook.shooting || hook.pulling) 
		{
			if(hook.shooting)
			{
				hook.currentRadius += hook.shootingSpeed;
			}
			if(hook.pulling) 
			{
				hook.currentRadius -= hook.pullingSpeed;
			}

			updateHookState();
		} 
		else 
		{//so if (!shooting && !pulling) 

			if (keyLeft.isDown)
			{
				hook.sprite.angle -= hook.rotationSpeed;
			}
			if(keyRight.isDown) 
			{
				hook.sprite.angle += hook.rotationSpeed;
			}
			if(keyShoot.isDown)
			{
				hook.shooting = true;
			}
		}

		draw();
	}

	function updateHookState() {
		if (hook.shooting && (hook.currentRadius >= hook.maxRadius)) {			
			hook.pulling = true;
			hook.shooting = false;
		}
		if (hook.pulling && (hook.currentRadius <= hook.defaultRadius)) {
			hook.pulling = false;
			hook.currentRadius = hook.defaultRadius;
		}
	}

	function draw() {
		///angles are defined on a range from -180 to +180
		//initially angle is 0
		//we introduce here 'calcAngle' to simplify the calculations for the rotation along the cheese
		hook.calcAngle = ((hook.sprite.angle + 180) / 360) * 2 * Math.PI;

		//when "shooting" the hook, we simply increase the radius.

		hook.sprite.x = game.world.centerX + (hook.currentRadius * Math.cos(hook.calcAngle));
		hook.sprite.y = game.world.centerY + (hook.currentRadius * Math.sin(hook.calcAngle));

		console.log("r: " + hook.currentRadius + "x: " + hook.sprite.x + " y: " + hook.sprite.y);
	}
};
