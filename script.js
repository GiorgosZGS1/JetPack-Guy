// Canvas SetUp
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameOver = false;

// Mouse properties
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
});

canvas.addEventListener('mouseup',function() {
    mouse.click = false;
});

// Player

const playerLeft = new Image();
playerLeft.src = 'images/player_left.png';
const playerRight = new Image();
playerRight.src = 'images/player_right.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.spriteWidth = 692;
        this.spriteHeight = 580;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 20;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        

        if (mouse.x != this.y) {
            this.x -= dx / this.speed;
        }
        if (mouse.y != this.y) {
            this.y -= dy / this.speed;
        }
    }

    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();*/

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if(this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 70, 0 - 76, this.spriteWidth / 4, this.spriteHeight / 4);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 104, 0 - 76, this.spriteWidth / 4, this.spriteHeight / 4);
        }
        ctx.restore();
    }
}

const player = new Player();

// Coins
const coinsArray = [];
const coinImage = new Image();
coinImage.src = 'images/silver.png'

class Coin {
    constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = canvas.height + 60; 
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        /*ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill()
        ctx.closePath();*/

        ctx.drawImage(coinImage, this.x - 44, this.y - 30, this.radius * 1.8, this.radius * 1.6)
    }
}

const coinPicked1 = document.createElement('audio');
coinPicked1.src = 'sounds/coin.wav';
const coinPicked2 = document.createElement('audio');
coinPicked2.src = 'sounds/coinsplash.ogg';


function handleCoins() {
    if (gameFrame % 50 == 0) {
        coinsArray.push(new Coin());
    }
    for (let i = 0; i < coinsArray.length; i++) {
        coinsArray[i].update();
        coinsArray[i].draw();

        if (coinsArray[i].y < 0 - coinsArray[i].radius * 2) {
            coinsArray.splice(i, 1);
            i--;
        }   else if (coinsArray[i].distance < coinsArray[i].radius + player.radius) {
            if(!coinsArray[i].counted) {
                if (coinsArray[i].sound == 'sound1') {
                    coinPicked1.play();
                } else {
                    coinPicked2.play();
                }
                score++;
                coinsArray[i].counted = true;
                coinsArray.splice(i, 1);
                i--;
            }
        }
    }

    }
    for (let i = 0; i < coinsArray.length; i++) {  
        
}

//Background
const background = new Image();
background.src = 'images/background.png';

function handleBackground() {

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Enemies
const enemyImage = new Image();
enemyImage.src = 'images/plane.png';

class Enemy {
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.spriteWidth = 925;
        this.spriteHeight = 455;
    }
    draw() {
        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();*/
        ctx.drawImage(enemyImage, this.x - 60, this.y - 66, this.radius * 2, this.radius * 2);
    }
    update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
}

const enemy1 = new Enemy();
function handleEnemies() {
    enemy1.draw();
    enemy1.update();
}

function handleGameOver() {
    ctx.fillStyle = 'blue';
    ctx.fillText('GAME OVER! You reached score ' + score, 110, 250);
    ctx.fillText('Press F5 to play again', 230, 290);
    gameOver = true;
    }
    

// Loop Animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleCoins();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('Click and drag to play', 220, 88);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);

}

animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})
