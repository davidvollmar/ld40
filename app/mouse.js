class Mouse {
    constructor(x, y) {
        this.sprite = game.add.sprite(x, y, "mouse");
        this.sprite.scale.setTo(0.05, 0.05);
        this.sprite.anchor.setTo(0.5, 0.5);
    }
    
    twitchMouse() {		
        var targetX = game.world.centerX;
        var targetY = game.world.centerY;

        var dX = targetX - this.sprite.x;
        var dY = targetY - this.sprite.y;

        var x = Math.random() > 0.5? dX/100 : 0;
        var y = Math.random() > 0.5? dY/100 : 0;
        this.sprite.x += x;
        this.sprite.y += y;
    }
}

function updateMice(mice) {
    if(Math.random() < 0.01 && mice.length < 50) {
        var newMouse = new Mouse(Math.random() * window.screen.width, Math.random() * window.screen.height);			
        mice.push(newMouse);
    }

    mice.map(function(mouse) {
        mouse.twitchMouse();
    });
}