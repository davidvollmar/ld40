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
	this.curledMouse = false;
	this.shootingSpeed = 10;
	this.pullingMouseSpeed = 3;
	this.pullingEmptySpeed = 8;
	this.collisionDistance = 25;
}

function updateHook(hook, keys) {
	updateHookPosition(hook, keys);
	updateHookState(hook);
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
		if(keys.shootPressed) {
			if(hook.caughtMouse) {
				curleMouse(hook.sprite.x, hook.sprite.y);
				hook.curledMouse = true;
			} else {
				hook.shooting = true;	
			}	
			keys.shootPressed = false;		
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
		hook.currentRadius = hook.defaultRadius;
	}	
	if(hook.caughtMouse && hook.curledMouse) {
		hook.caughtMouse = false;
		hook.curledMouse = false;
		hook.sprite.loadTexture('hook', 0, false);
	}
}