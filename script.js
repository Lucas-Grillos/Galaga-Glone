const startArea = document.getElementById("start-area");
const startBtn = document.getElementById("start-btn")

const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 800;
const ctx = canvas.getContext("2d");

const startingPostionX = 250;
const startingPositionY = 750;

let fireInterval = true;

const SHIP_VEL = 3;
const SHIP_DIAG_VEL = 2;

const fireKey = " ";

const keyInputsX = {
    ArrowLeft: false,
    ArrowRight: false
}

const keyInputsY = {
    ArrowUp: false,
    ArrowDown: false,
}

const LEVEL_1 = [
    {x: 0, y: -100},
    {x: 100, y: -100},
    {x: 425, y: -150},
    {x: 200, y: -450},
    {x: 400, y: -475},
    {x: 300, y: -865},
    {x: 250, y: -900},
    {x: 450, y: -1100},
    {x: 225, y: -1230},
    {x: 375, y: -1345}
]

class Alien_Bullet {
    constructor(coords) {
        this.position = {
            x: coords.x,
            y: coords.y
        }
        this.velocity = {
            x: 0,
            y: 1
        }

        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI, false);
        ctx.fillStyle = "yellow";
        ctx.fill();
    }
    
    move() {
        this.position.y += this.velocity.y;
    }
}

class Alien {
    constructor(coords) {
        this.width = 40;
        this.height = 30;
        

        this.position = {
            x: coords.x,
            y: coords.y
        }

        this.velocity = {
            x: .5 * (this.oneOrNeg1()), // moving left or right
            y: 1.2
        }

        this.velocity_variance = 4;
        this.markedForDeletion = false;
        this.hasBullet = this.oneOrNeg1() == 1 ? true : false;
        this.fireBulletLocation = this.getRandom(300) + 100;  
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + (this.width / 2), this.position.y + this.height);
        ctx.lineTo(this.position.x + this.width, this.position.y);
        ctx.fillStyle = "blue";
        ctx.fill();
    }
    
    fireBullet() {
        let alienbullet = new Alien_Bullet(this.position);
        alien_bullets.push(alienbullet);
        this.hasBullet = false;
    }
    
    move() {
        this.position.y+=this.velocity.y;
        this.position.x+=this.velocity.x;

        if (this.position.x < 0 || this.position.x+this.width > canvas.width) {
            this.velocity.x = this.velocity.x * -1;
            // check to see if alien's bounds are verging over left or right width of the screen, and then reverses it's velocity
        }

        if (this.markedForDeletion) {
            cleanAliens();
        }
        
        if (this.hasBullet && this.position.y >= this.fireBulletLocation) {
            this.fireBullet()
        }
        
    }

    getRandom(max) {
        return Math.floor(Math.random() * max);
    }

    oneOrNeg1() {
        return this.getRandom(2) == 0 ? -1 : 1;
    }

    varyVelocity() {
        this.velocity.y = Number((this.velocity.y + (this.getRandom(this.velocity_variance) / 10) * (this.oneOrNeg1())).toFixed(1))

        // adds or subtracts ( * this.getRandom(2) == 0 ? -1 : 1 ) a random number between 0 and 2 (this.velocity_variance) to our
        // init_velocity. toFixed(1) makes certain that we're staying at only 1 digit place past the decimal, and Number() converts the
        // resulting string back into a number
    }
}

class Bullet {
    
    constructor() {
        this.height = 12;
        this.width = 6;
        this.velocity = 6;
        this.position = {
            x: spaceship.position.x + (spaceship.verticalRect.width / 2) - (this.width / 2),
            y: spaceship.position.y
        }
        this.markedForDeletion = false;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    move() {
        this.position.y -= this.velocity;
        if (this.position.y < -this.height || this.checkForBullseye()) {
            this.markedForDeletion = true;
            cleanBullets();
        }
        this.checkForBullseye();
    }

    checkForBullseye() {
        
        if(aliens.length>0) {
            let bullseye = aliens.some(alien => {
                if(this.position.y <= alien.position.y + (alien.height/2) && this.position.y >= alien.position.y && (this.position.x >= alien.position.x && this.position.x <= alien.position.x + alien.width)) {
                    alien.markedForDeletion = true;
                    return true;
                }
            })
            return bullseye;
        }
        
    }
}

class Spaceship {
    constructor() {

        this.verticalRect = {
            /*
            width: 10,
            height: 30
            */
           width: 15,
           height: 45
        }

        this.horizontalRect = {
            /*
            width: 24,
            height: 10
            */
           width: 36,
           height: 15
        }

        this.position = {
            x: startingPostionX - (this.verticalRect.width/2),
            y: startingPositionY
        }

        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x - (this.horizontalRect.width - this.verticalRect.width) / 2, 
                    this.position.y + (this.verticalRect.height - this.horizontalRect.height), 
                    this.horizontalRect.width, this.horizontalRect.height);
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.verticalRect.width, this.verticalRect.height)
    }

    move() {
        // - (this.horizontalRect.width - this.verticalRect.width) / 2 
        if (this.position.x  - ((this.horizontalRect.width - this.verticalRect.width) / 2) <= 0 && this.velocity.x < 0) {
            this.velocity.x = 0;
        }
        
        //width of the vertical rect... + (this.horizontalRect.width - this.verticalRect.width) / 2

        if (this.position.x + (this.verticalRect.width + ((this.horizontalRect.width - this.verticalRect.width) / 2)) >= canvas.width && this.velocity.x > 0) {
            this.velocity.x = 0;
        }

        if (this.position.y <= 0 && this.velocity.y < 0) {
            this.velocity.y = 0;
        }

        if (this.position.y + this.verticalRect.height >= canvas.height && this.velocity.y > 0) {
            this.velocity.y = 0;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        spaceship.draw();
    }
}

const spaceship = new Spaceship();
let bullets = [];
let aliens = [];
let alien_bullets = [];

const createLevel = () => {
    LEVEL_1.forEach(coords => {
        let alien = new Alien(coords);
        alien.varyVelocity();
        aliens.push(alien);
    })
}
createLevel();

const animate = () => {
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    spaceship.move();
    spaceship.draw();
    
    if( aliens.length) {
        aliens.forEach( alien => alien.draw() );
        aliens.forEach( alien => alien.move() );
    }

    if (bullets.length) {
        bullets.forEach( bullet => bullet.draw() );
        bullets.forEach( bullet => bullet.move() );
    }
    if (alien_bullets) {
        alien_bullets.forEach( alienbullet => alienbullet.draw() );
        alien_bullets.forEach( alienbullet => alienbullet.move() );
    }
    setVelocity();
}

cleanBullets = () => {
    bullets = bullets.filter( bullet => !bullet.markedForDeletion )
}

cleanAliens = () => {
    aliens = aliens.filter( alien => !alien.markedForDeletion ) 
}

const setVelocity = () => {
    if (keyInputsY.ArrowUp && Object.values(keyInputsX).some(val => val===true) && !keyInputsY.ArrowDown ) {
        spaceship.velocity.y = -SHIP_DIAG_VEL
    } else if (keyInputsY.ArrowUp && !keyInputsY.ArrowDown) {
        spaceship.velocity.y = -SHIP_VEL;} 
    else if (!keyInputsY.ArrowUp && !keyInputsY.ArrowDown) 
        {spaceship.velocity.y = 0}

    if (keyInputsY.ArrowDown && Object.values(keyInputsX).some(val => val===true) && !keyInputsY.ArrowUp) {
        spaceship.velocity.y = SHIP_DIAG_VEL
    } else if (keyInputsY.ArrowDown && !keyInputsY.ArrowUp) {
        spaceship.velocity.y = SHIP_VEL;
    } else if (!keyInputsY.ArrowDown && !keyInputsY.ArrowUp)
        {spaceship.velocity.y = 0}

    if (keyInputsX.ArrowLeft && Object.values(keyInputsY).some(val => val===true) && !keyInputsX.ArrowRight) {
        spaceship.velocity.x = -SHIP_DIAG_VEL;
    } else if (keyInputsX.ArrowLeft && !keyInputsX.ArrowRight) {
        spaceship.velocity.x = -SHIP_VEL;
    } else if (!keyInputsX.ArrowLeft && !keyInputsX.ArrowRight) 
        {spaceship.velocity.x = 0}

    if (keyInputsX.ArrowRight && Object.values(keyInputsY).some(val => val===true) && !keyInputsX.ArrowLeft) {
        spaceship.velocity.x = SHIP_DIAG_VEL
    } else if (keyInputsX.ArrowRight && !keyInputsX.ArrowLeft) {
        spaceship.velocity.x = SHIP_VEL;
    } else if (!keyInputsX.ArrowRight && !keyInputsX.ArrowLeft) 
        {spaceship.velocity.x = 0}
}

const moveShip = (keyInput, vel) => {
    switch(keyInput) {
        case "ArrowUp":
            spaceship.velocity.y=-vel;
            break;
        
        case "ArrowDown":
            spaceship.velocity.y=vel;
            break;
        
        case "ArrowLeft":
            spaceship.velocity.x=-vel;
            break;

        case "ArrowRight":
            spaceship.velocity.x=vel;
            break;
    }
}


/*
const moveShip = (keyInput, vel) => {
    switch(keyInput) {
        case "ArrowUp":
            if(Object.values(keyInputsX).some(val => val===true)) {
                spaceship.velocity.y = -(vel * .6)
                spaceship.velocity.x = spaceship.velocity.x*.6;
            }
            else {spaceship.velocity.y=-vel;}
            break;
        
        case "ArrowDown":
            if(Object.values(keyInputsX).some(val => val===true)) {
                spaceship.velocity.y = (vel * .6)
                spaceship.velocity.x = spaceship.velocity.x*.6;
            }
            else {spaceship.velocity.y=vel;}
            break;
        
        case "ArrowLeft":
            if(Object.values(keyInputsY).some(val => val===true)) {
                spaceship.velocity.x = -(vel * .6);
                spaceship.velocity.y = spaceship.velocity.y*.6;
            }
            else {spaceship.velocity.x=-vel;}
            break;

        case "ArrowRight":
            if(Object.values(keyInputsY).some(val => val===true)) {
                spaceship.velocity.x = (vel * .6);
                spaceship.velocity.y = spaceship.velocity.y*.6;
            }
            else {spaceship.velocity.x=vel;}
            break;
    }
}
*/

const fireBullet = () => {
    let bullet = new Bullet();
    bullets.push(bullet);
    fireInterval = false;
    setTimeout(() => {
        fireInterval = true;
      }, "100");
}

const keyChanges = (keyInput, bool, keyUpDown) => {
    if(keyInputsX.hasOwnProperty(keyInput)){
        keyInputsX[keyInput] = bool;
    } else if (keyInputsY.hasOwnProperty(keyInput)) {
        keyInputsY[keyInput] = bool;
    } else if (keyInput === fireKey && bool && fireInterval) {
        fireBullet();
    } else if (keyInput === "a" && bool) {
        console.log(spaceship.position.x)
    }
    
}

const startGame = () => {
    startArea.style.display = "none";
    canvas.style.display = "block";
    animate();
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keyup", (event) => {
    keyChanges(event.key, false);
    //moveShip(event.key, 0) 
})

document.addEventListener("keydown", (event) => {
    keyChanges(event.key, true);
    //moveShip(event.key, 1)
})
