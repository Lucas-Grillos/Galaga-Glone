const startArea = document.getElementById("start-area");
const startBtn = document.getElementById("start-btn")

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const startingPostionX = 300;
const startingPositionY = 550;

let fireInterval = true;

const SHIP_VEL = 2;
const SHIP_DIAG_VEL = 1.5;

const fireKey = " ";

const keyInputsX = {
    ArrowLeft: false,
    ArrowRight: false
}

const keyInputsY = {
    ArrowUp: false,
    ArrowDown: false,
}

class Bullet {
    constructor() {
        this.height = 8;
        this.width = 4;
        this.velocity = 8;
        this.position = {
            x: spaceship.position.x,
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
        if (this.position.y < 0) {
            this.markedForDeletion = true;
            cleanBullets();
        }
    }
}

class Spaceship {
    constructor() {

        this.verticalRect = {
            width: 10,
            height: 30
        }

        this.horizontalRect = {
            width: 24,
            height: 10
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

        if (this.position.x - 7 <= 0 && this.velocity.x < 0) {
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

const animate = () => {
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    spaceship.move();
    spaceship.draw();
    bullets.forEach( bullet => bullet.draw() );
    bullets.forEach( bullet => bullet.move() )
    setVelocity();
}

cleanBullets = () => {
    bullets = bullets.filter( bullet => !bullet.markedForDeletion )
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
        console.log(bullets)
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
