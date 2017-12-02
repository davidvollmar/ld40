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
        
        var rot = Math.atan2(dY, dX) - Math.PI / 2;

        var x = Math.random() > 0.5? dX/100 : 0;
        var y = Math.random() > 0.5? dY/100 : 0;
        this.sprite.x += x;
        this.sprite.y += y;
        this.sprite.rotation = rot;
    }
}

function updateMice(mice) {
    if(Math.random() < 0.01 && mice.length < 50) {        
        mice.push(spawnMouse());
    }

    mice.map(function(mouse) {
        mouse.twitchMouse();
    });
}

function spawnMouse() {
    var rand = Math.random();
    if(rand <= .25) {
        return new Mouse(Math.random() * window.screen.width, 0);        
    } else if(rand <= .5) {
        return new Mouse(Math.random() * window.screen.width, window.screen.height);    
    } else if(rand <= .75) {
        return new Mouse(0, Math.random() * window.screen.height);
    } else {
        return new Mouse(window.screen.width, Math.random() * window.screen.height);
    }
}

function curleMouse() {
    console.log("curle mouse!");
}