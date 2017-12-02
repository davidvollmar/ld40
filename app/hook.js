class Hook {
	constructor() {
		this.sprite = null;
		this.defaultRadius = 75;
		this.currentRadius = 75;
		this.maxRadius = 400;
		this.calcAngle = 0;
		this.rotationSpeed = 2;
		this.shooting = false;
		this.pulling = false;
		this.caughtMouse = false;
		this.curledMouse = false;
		this.shootingSpeed = 10;
		this.pullingMouseSpeed = 3;
		this.pullingEmptySpeed = 8;
		this.collisionDistance = 25;
	}
}