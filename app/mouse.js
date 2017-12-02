class Mouse {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.sprite = game.add.sprite(x, y, 'mouse', 0);
        this.sprite.scale.setTo(0.05, 0.05);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.animation = this.sprite.animations.add('wiggle');        
        this.animation.play(10, true);
        this.hasCheese = false;
        this.escaped = false;
        this.pickedupCheese = false;
        this.walkingSpeed = 0.01;
        this.carryingSpeed = 0.0025;
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

        console.log("distance to: " + debug + " = " + Math.sqrt(((dX * dX) + (dY * dY))));
        if(Math.sqrt(((dX * dX) + (dY * dY))) < Math.random() * 30) {
            //if moving to cheese, pick up, else escape
            if(!this.hasCheese) {
                console.log("picked up cheese");
                this.hasCheese = true;
                this.pickedupCheese = true;
            } else {
                console.log("escaped");
                this.escaped = true;
            }                
        }
    }
}
