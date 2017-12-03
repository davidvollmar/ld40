class Hook {
	constructor() {
		this.armsprite = null;
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
	}

	updatePosition(keys) {
		if (this.shooting || this.pulling) {
			if(this.shooting) {
				this.currentRadius += this.shootingSpeed;
			}
			if(this.pulling) {
				var pullingSpeed = this.caughtMouse ? this.pullingMouseSpeed : this.pullingEmptySpeed;
				this.currentRadius -= pullingSpeed;
			}
		} else {//so if (!shooting && !pulling) 
			if (keys.action == actions.LEFT) {
				this.sprite.angle -= this.rotationSpeed;
			}
			if(keys.action == actions.RIGHT) {
				this.sprite.angle += this.rotationSpeed;
			}
		}


		///angles are defined on a range from -180 to +180
		//initially angle is 0
		//we introduce here 'calcAngle' to simplify the calculations for the rotation along the cheese		
		this.calcAngle = ((this.sprite.angle + 180) / 360) * 2 * Math.PI;
		
		this.sprite.x = game.world.centerX + (this.currentRadius * Math.cos(this.calcAngle));
		this.sprite.y = game.world.centerY + (this.currentRadius * Math.sin(this.calcAngle));

		//arm sprite probeersel
		var dx = this.sprite.x - game.world.centerX;
		var dy = this.sprite.y - game.world.centerY;

		this.armsprite.x = this.sprite.x;
		this.armsprite.y = this.sprite.y;
		this.armsprite.angle = this.sprite.angle;
		this.armsprite.width = Math.sqrt(dx*dx + dy*dy);
	}

	updateShooting() {		
		if (this.caughtMouse) {			
			this.curledMouse = true;
		} else {		
			this.shooting = true;
		}
	}

	updateState() {
		if (this.shooting && (this.currentRadius >= this.maxRadius)) {			
			this.pulling = true;
			this.shooting = false;
		}
		if (this.pulling && (this.currentRadius <= this.defaultRadius)) {
			this.pulling = false;
			this.currentRadius = this.defaultRadius;
		}	
		if(this.caughtMouse && this.curledMouse) {
			this.caughtMouse = false;
			this.curledMouse = false;
			this.sprite.loadTexture('hook', 0, false);
		}
	}

	canShoot() {		
		return (!this.shooting && !this.pulling);
	}
}
