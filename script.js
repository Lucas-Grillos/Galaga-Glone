const startArea = document.getElementById("start-area");
const startBtn = document.getElementById("start-btn")

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const startingPostionX = 300;
const startingPositionY = 550;

const SHIP_VEL = 2;
const SHIP_DIAG_VEL = 1.5;

const keyInputsX = {
    ArrowLeft: false,
    ArrowRight: false
}

const keyInputsY = {
    ArrowUp: false,
    ArrowDown: false,
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
                    this.position.y + (this.verticalRect.height-this.horizontalRect.height), 
                    this.horizontalRect.width, this.horizontalRect.height);
        ctx.fillStyle = "red"
        ctx.fillRect(this.position.x, this.position.y, this.verticalRect.width, this.verticalRect.height)
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        spaceship.draw();
    }
}

const spaceship = new Spaceship(); 

const animate = () => {
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    spaceship.move();
    spaceship.draw();
    setVelocity();
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

/*
const moveShip2 = (keyInput) => {
    // console.log("Input: " + keyInput)
    Object.keys(keyInputsX).forEach(keyInputX => {
        if(keyInput === keyInputX) {
            spaceship.velocity.x=velocityX[keyInput]
        }
    });

    Object.keys(keyInputsY).forEach(keyInputY => {
        if(keyInput === keyInputY) {
            spaceship.velocity.y=velocityY[keyInput]
        }
    });
}
*/
const keyChanges = (keyInput, bool) => {
    if(keyInputsX.hasOwnProperty(keyInput)){
        keyInputsX[keyInput] = bool;
    } else if (keyInputsY.hasOwnProperty(keyInput)) {
        keyInputsY[keyInput] = bool;
    }
}

const startGame = () => {
    startArea.style.display = "none";
    canvas.style.display = "block";
    animate();
};

startBtn.addEventListener("click", startGame);

document.addEventListener("keyup", (event) => {
    keyChanges(event.key, false);
    //moveShip(event.key, 0)
    //moveShip2(event.key)    
})

document.addEventListener("keydown", (event) => {
    keyChanges(event.key, true);
    //moveShip(event.key, 1)
    //moveShip2(event.key)
})
