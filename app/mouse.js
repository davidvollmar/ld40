class Mouse {
    constructor(x, y) {
        this.sprite = game.add.sprite(x, y, 'mouse', 0);
        this.sprite.scale.setTo(0.05, 0.05);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.animation = this.sprite.animations.add('wiggle');        
        this.animation.play(10, true);        
        this.curling = false;
    }

    updateMouse() {		
        var targetX = game.world.centerX;
        var targetY = game.world.centerY;

        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;
        
        var rot = Math.atan2(dY, dX);

        var x = Math.random() > 0.5? dX/100 : 0;
        var y = Math.random() > 0.5? dY/100 : 0;
        this.sprite.x += x;
        this.sprite.y += y;
        this.sprite.rotation = rot;
    }
}
