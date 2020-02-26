
// find and replace JXAN with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()


function JXAN(game) {
    this.count = 0
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "Jiarui Xiong && Ai Nguyen";
    this.color = "White";
    this.cooldown = 0;
    this.direction = { x: randomInt(1600) - 800, y: randomInt(1600) - 800 };
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

JXAN.prototype = new Entity();
JXAN.prototype.constructor = JXAN;

// alter the code in this function to create your agent
// you may check the state but do not change the state of these variables:
//    this.rocks
//    this.cooldown
//    this.x
//    this.y
//    this.velocity
//    this.game and any of its properties

// you may access a list of zombies from this.game.zombies
// you may access a list of rocks from this.game.rocks
// you may access a list of players from this.game.players

JXAN.prototype.selectAction = function () {
    debugger;
    var acceleration = 1000000;
    var actionZombie = { direction: { x: this.direction.x, y: this.direction.y }, throwRock: false, target: null };
    var actionRock = { direction: { x: this.direction.x, y: this.direction.y }, throwRock: false, target: null };
    var closestZombie = Infinity;
    var closestRock = Infinity;
    var target1 = null;

    for (var i = 0; i < this.game.zombies.length; i++) {
        var ent = this.game.zombies[i];
        var dist = distance(ent, this);
        closestZombie = Math.min(dist, closestZombie);
        if (dist <= closestZombie) {
            if (this.game.players[0].rocks !== 0 && dist <= 35){
                debugger
                closestZombie = dist;
                target1 = ent;
            } else {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                actionZombie.direction.x -= difX * acceleration / (dist * dist);
                actionZombie.direction.y -= difY * acceleration / (dist * dist);
            }
        }
    }


    for (var i = 0; i < this.game.rocks.length; i++) {
        var ent = this.game.rocks[i];
        var dist = distance(ent, this);
        closestRock = Math.min(dist, closestRock);
        if (dist <= closestRock) {
            if (dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                actionRock.direction.x += difX * acceleration / (dist * dist);
                actionRock.direction.y += difY * acceleration / (dist * dist);
            }
        }

    }
    this.count++;
    if(this.y > 780 || this.x > 780){
        console.log(this.count);
    }
    if (target1) {
        actionRock.target = target1;
        actionRock.throwRock = true;
        actionZombie.target = target1;
        actionZombie.throwRock = true;
    }
    debugger;
    if (closestRock <= closestZombie){
        if (this.rocks === (2 || 1)){
            return actionZombie
        } else {
            return actionRock
        }
    } else if(closestRock > closestZombie){
        return actionZombie
    }

};









// do not change code beyond this point

JXAN.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

JXAN.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

JXAN.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

JXAN.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

JXAN.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

JXAN.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
        var target = this.action.target;
        var dir = direction(target, this);

        var rock = new Rock(this.game);
        rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
        rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
        rock.velocity.x = dir.x * rock.maxSpeed;
        rock.velocity.y = dir.y * rock.maxSpeed;
        rock.thrown = true;
        rock.thrower = this;
        this.game.addEntity(rock);
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
    console.log("x: " + this.x + " ,y: " + this.y);
};

JXAN.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};