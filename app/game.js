window.onload = function() {
	console.log("Prepare to Cheese!");

	var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update});
	
	function preload () {
		game.load.image("cheese", "assets/cheese.png");
	}

	function create () {
		var cheese = game.add.sprite(game.world.centerX, game.world.centerY, "cheese");
		cheese.scale.setTo(0.1, 0.1);
		cheese.anchor.setTo(0.5, 0.5);

		console.log("Cheese!");
	}

	function update() {

	}
};
