class Hook {

	constructor() {
		this.armsprite = null;
		this.sprite = null;
		this.defaultRadius = 75;
		this.currentRadius = 75;
		this.maxRadius = 400;
		this.calcAngle = 0;
		this.rotationSpeed = 2;
		this.shootingSpeed = 10;
		this.pullingMouseSpeed = 3;
		this.pullingEmptySpeed = 8;
		
		this.state = HookState.HOLDINGEMPTY;
	}

	update(action, shoot) {
		//First, set angle and radius
		switch(this.state) {
			case HookState.HOLDINGEMPTY:
				if(shoot) {
					this.state = HookState.SHOOTING;
				} else {
					this.move(action);
				}
				break;
			case HookState.HOLDINGMOUSE:
				if(shoot) {
					this.state = HookState.CURLING;
				} else {
					this.move(action);
				} 				
				break;
			case HookState.SHOOTING:
				this.currentRadius += this.shootingSpeed
				if(this.currentRadius >= this.maxRadius) {
					this.state = HookState.PULLINGEMPTY;					
				}
				break;				
			case HookState.CURLING:			
				this.state = HookState.HOLDINGEMPTY;
				this.sprite.loadTexture("hook", 0, false);
				break;
			case HookState.PULLINGEMPTY:
				this.currentRadius -= this.pullingEmptySpeed;
				if(this.currentRadius <= this.defaultRadius) {		
					this.currentRadius = this.defaultRadius;
					this.state = HookState.HOLDINGEMPTY;
				}		
				break;
			case HookState.PULLINGMOUSE:						
				this.currentRadius -= this.pullingMouseSpeed;
				if(this.currentRadius <= this.defaultRadius) {		
					this.currentRadius = this.defaultRadius;
					this.state = HookState.HOLDINGMOUSE;
				}
				break;
		}

		//Now: set position based on angle and radius.
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

	move(action) {
		switch(action) {
			case actions.LEFT:
				this.sprite.angle -= this.rotationSpeed;
				break;
			case actions.RIGHT:
				this.sprite.angle += this.rotationSpeed;
				break;
		}
	}

	collidesWith(mouse) {
		return Math.sqrt(
						((this.sprite.x - mouse.sprite.x) * (this.sprite.x - mouse.sprite.x)) + 
						((this.sprite.y - mouse.sprite.y) * (this.sprite.y - mouse.sprite.y))
					) < mouse.collisionDistance;
	}

	catchMouse() {
		this.state = HookState.PULLINGMOUSE;
		this.sprite.loadTexture("fullhook", 0, false);
	}
}
