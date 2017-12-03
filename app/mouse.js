class Mouse {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;

        this.mouseType = Math.floor(Math.random() * 5) - 2;//5 types of mice, -2, -1, 0, 1, 2

        this.collisionDistance = 25 + (3 * this.mouseType);

        this.sprite = game.add.sprite(x, y, 'mouse', 0);
        this.sprite.scale.setTo(0.05 + (0.01 * this.mouseType), 0.05 + (0.01 * this.mouseType));
        this.sprite.anchor.setTo(0.5, 0.5);

        this.animation = this.sprite.animations.add('wiggle');        
        this.animation.play(10, true);
        this.hasCheese = false;
        this.escaped = false;
        this.pickedupCheese = false;

        //make the bigger mice slower than the smaller mice
        this.walkingSpeed = 0.01 + (-0.002 * this.mouseType);
        this.carryingSpeed = 0.0025 + (-0.0005 * this.mouseType);
        
        this.requiredProximity = 30;
    }

    updateMouse() {		
        if(this.hasCheese) { 
            this.moveTowards(this.originX, this.originY, this.carryingSpeed, "wall");
        } else { 
            this.moveTowards(game.world.centerX, game.world.centerY, this.walkingSpeed, "cheese");
        }
    }

    moveTowards(targetX, targetY, speed, debug) {
        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;
        
        var rot = Math.atan2(dY, dX);

        var x = Math.random() > 0.5? dX * speed : 0;
        var y = Math.random() > 0.5? dY * speed : 0;

        this.sprite.x += x;
        this.sprite.y += y;
        this.sprite.rotation = rot;

        if(Math.sqrt(((dX * dX) + (dY * dY))) < Math.random() * this.requiredProximity) {
            //if moving to cheese, pick up, else escape
            if(!this.hasCheese) {
                this.hasCheese = true;
                this.pickedupCheese = true;
                this.requiredProximity = 100; //doesn't have to be so close to the wall to escape
            } else {
                this.escaped = true;
            }                
        }
    }
}
