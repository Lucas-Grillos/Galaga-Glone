const startArea = document.getElementById("start-area");
const startBtn = document.getElementById("start-btn")

const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const startingPostionX = 300;
const startingPositionY = 550;


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
}

const moveShip = (key, vel) => {
    switch(key) {
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
    }
}

const startGame = () => {
    startArea.style.display = "none";
    canvas.style.display = "block";
    animate();
};

startBtn.addEventListener("click", startGame);

document.addEventListener("keyup", (event) => {
    moveShip(event.key, 0)
})
document.addEventListener("keydown", (event) => {
    moveShip(event.key, 3)
})
