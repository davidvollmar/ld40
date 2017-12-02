var Hook = function() {
	this.sprite = null;
	this.defaultRadius = 75;
	this.currentRadius = 75;
	this.maxRadius = 400;
	this.calcAngle = 0;
	this.rotationSpeed = 2;
	this.shooting = false;
	this.pulling = false;
	this.caughtMouse = false;
	this.shootingSpeed = 10;
	this.pullingMouseSpeed = 3;
	this.pullingEmptySpeed = 8;
	this.collisionDistance = 25;
}

function updateHook(hook, keys) {
	updateHookPosition(hook, keys);
	updateHookState(hook);
	updateHookAngle(hook);
}


function updateHookPosition(hook, keys) {
	if (hook.shooting || hook.pulling) {
		if(hook.shooting) {
			hook.currentRadius += hook.shootingSpeed;
		}
		if(hook.pulling) {
			var pullingSpeed = hook.caughtMouse ? hook.pullingMouseSpeed : hook.pullingEmptySpeed;
			hook.currentRadius -= pullingSpeed;
		}
	} else {//so if (!shooting && !pulling) 
		if (keys.keyLeft.isDown) {
			hook.sprite.angle -= hook.rotationSpeed;
		}
		if(keys.keyRight.isDown) {
			hook.sprite.angle += hook.rotationSpeed;
		}
		if(keys.keyShoot.isDown) {
			hook.shooting = true;
		}
	}	
}

function updateHookState(hook) {
	if (hook.shooting && (hook.currentRadius >= hook.maxRadius)) {			
		hook.pulling = true;
		hook.shooting = false;
	}
	if (hook.pulling && (hook.currentRadius <= hook.defaultRadius)) {
		hook.pulling = false;
		if(hook.caughtMouse) {
			hook.caughtMouse = false;
			hook.sprite.loadTexture('hook', 0, false);
		}
		hook.currentRadius = hook.defaultRadius;
	}
}

function updateHookAngle(hook) {
	///angles are defined on a range from -180 to +180
	//initially angle is 0
	//we introduce here 'calcAngle' to simplify the calculations for the rotation along the cheese
	hook.calcAngle = ((hook.sprite.angle + 180) / 360) * 2 * Math.PI;
	
	hook.sprite.x = game.world.centerX + (hook.currentRadius * Math.cos(hook.calcAngle));
	hook.sprite.y = game.world.centerY + (hook.currentRadius * Math.sin(hook.calcAngle));
}