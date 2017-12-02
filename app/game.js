window.onload = function() {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update });
	var hook = new Hook();
	var keys = {
		keyLeft: null, 
		keyRight: null,
		keyShoot: null
	};
	
	function preload () {
		game.load.image("hook", "assets/diamond.png");
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
		cheese.scale.setTo(0.05, 0.05);
		
		var mouse = game.add.sprite(0,0, "mouse");
		mouse.scale.setTo(0.05, 0.05);

		//Define input keys
		keys.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		keys.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		keys.keyShoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//initialize 
		hook.currentRadius = hook.defaultRadius;
	}

	function update() {

		updateHook(hook, keys);

		draw();
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
