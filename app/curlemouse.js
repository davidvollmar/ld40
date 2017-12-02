class CurleMouse {
	constructor(x, y, rotation) {
		this.sprite = game.add.sprite(x, y, "mouse");
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.scale.setTo(0.05, 0.05);

        this.sprite.rotation = rotation;
        this.distance = 75;
        this.speed = 8;
    }

    move() {
    	this.distance += this.speed;
    	this.sprite.x = game.world.centerX + this.distance * Math.cos(this.sprite.rotation);
    	this.sprite.y = game.world.centerY + this.distance * Math.sin(this.sprite.rotation);
    }
}