window.onload = function() {
	var windowWidth = 800;
	var windowHeight = 600;
	
	var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, "", { preload: preload, create: create, update: update });
	var keys = {
		keyLeft: null, 
		keyRight: null,
		keyShoot: null
	};

	var hook = new Hook();

	var mice = [];
	
	var Mouse = function(x, y) {
		this.sprite = game.add.sprite(x, y, "mouse");
		this.sprite.scale.setTo(0.05, 0.05);
		this.sprite.anchor.setTo(0.5, 0.5);
	}
	
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
		cheese.scale.setTo(0.05, 0.065);

		//Define input keys
		keys.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
		keys.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
		keys.keyShoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//initialize 
		hook.currentRadius = hook.defaultRadius;
	}

	function update() {

		updateHook(hook, keys);
		updateMice();

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

	}

	function updateMice() {
		if(Math.random() < 0.01 && mice.length < 50) {
			var newMouse = new Mouse(Math.random() * windowWidth, Math.random() * windowHeight);			
			mice.push(newMouse);
		}

		mice.map(function(mouse) {
			twitchMouse(mouse);
		});
	}

	function twitchMouse(mouse) {		
		var targetX = game.world.centerX;
		var targetY = game.world.centerY;

		var dX = targetX - mouse.sprite.x;
		var dY = targetY - mouse.sprite.y;

		var x = Math.random() > 0.5? dX/100 : 0;
		var y = Math.random() > 0.5? dY/100 : 0;
		mouse.sprite.x += x
		mouse.sprite.y += y		
	}
};
