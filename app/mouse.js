class Mouse {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;

        this.mouseType = Math.floor(Math.random() * 5) - 2;//5 types of mice, -2, -1, 0, 1, 2

        this.collisionDistance = 25 + (3 * this.mouseType);

        this.setSprite(x, y, "mouse");
  
        this.state = MouseState.WALKINGTO;

        //make the bigger mice slower than the smaller mice
        this.walkingSpeed = 0.01 + (-0.002 * this.mouseType);
        this.carryingSpeed = 0.0025 + (-0.0005 * this.mouseType);
        
        this.requiredProximity = 30;
    }

    updateMouse() {		
        switch(this.state) {
            case MouseState.WALKINGTO:
                this.moveTowards(game.world.centerX, game.world.centerY, this.walkingSpeed);
                if(this.reachedDestination(game.world.centerX, game.world.centerY)) {
                    this.state = MouseState.WALKINGFROM;
                    this.pickupCheese();
                    this.requiredProximity = 100;
                }
                break;
            case MouseState.WALKINGFROM:      
                this.moveTowards(this.originX, this.originY, this.carryingSpeed);
                if(this.reachedDestination(this.originX, this.originY)) {
                    this.state = MouseState.ESCAPED;
                }         
                
                break;
        }        
    }

    pickupCheese() {
        this.animation.destroy();
        this.sprite.destroy();
        this.setSprite(this.sprite.x, this.sprite.y, "mouse_with_cheese");
    }

    moveTowards(targetX, targetY, speed) {
        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;
        
        var rot = Math.atan2(dY, dX);

        var x = Math.random() > 0.5? dX * speed : 0;
        var y = Math.random() > 0.5? dY * speed : 0;

        this.sprite.x += x;
        this.sprite.y += y;
        this.sprite.rotation = rot;
    }

    reachedDestination(targetX, targetY) {
        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;
        return Math.sqrt((dX * dX) + (dY * dY)) < Math.random() * this.requiredProximity;
    }

    setSprite(x, y, source) {
        this.sprite = game.add.sprite(x, y, source, 0);
        this.sprite.scale.setTo(0.05 + (0.01 * this.mouseType), 0.05 + (0.01 * this.mouseType));
        this.sprite.anchor.setTo(0.5, 0.5);

        this.animation = this.sprite.animations.add('wiggle');
        this.animation.play(10, true);
    }
}
