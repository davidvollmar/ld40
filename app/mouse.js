class Mouse {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.sprite = game.add.sprite(x, y, 'mouse', 0);
        this.sprite.scale.setTo(0.05, 0.05);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.animation = this.sprite.animations.add('wiggle');        
        this.animation.play(10, true);        
        this.curling = false;
        this.hasCheese = false;
        this.pickedupCheese = false;
        this.walkingSpeed = 0.01;
        this.carryingSpeed = 0.0025;
    }

    updateMouse() {		
        if(this.hasCheese) { 
            this.moveTowards(this.originX, this.originY, this.carryingSpeed);
        } else { 
            this.moveTowards(game.world.centerX, game.world.centerY, this.walkingSpeed);
        }
    }

    moveTowards(targetX, targetY, speed) {
        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;
        
        var rot = Math.atan2(dY, dX);

        //var x = Math.random() > 0.5? dX/100 : 0;
        //var y = Math.random() > 0.5? dY/100 : 0;
        var x = Math.random() > 0.5? dX * speed : 0;
        var y = Math.random() > 0.5? dY * speed : 0;

        this.sprite.x += x;
        this.sprite.y += y;
        this.sprite.rotation = rot;

        if(Math.sqrt(((dX * dX) + (dY * dY))) < Math.random() * 10) {
            this.hasCheese = true;
            this.pickedupCheese = true;
            console.log("hasCheese = true");
        }
    }
}
