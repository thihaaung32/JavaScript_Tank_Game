/*
Name: Thiha Aung
Student ID: 923057314
GitHub: thihaaung32    
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Images and Sounds
const tankImage = new Image();
tankImage.src = './images/tank.png';
const bulletImage = new Image();
bulletImage.src = './images/bullet.png';
const enemyImage = new Image();
enemyImage.src = './images/enermy.gif'; 
const shootSound = new Audio('./sounds/shoot.mp3');
const explosionSound = new Audio('./sounds/explosion.mp3');

// Game Elements
const tank = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5
};

const bullets = [];
let bulletSpeed = 5;
const enemies = [];
let enemySpeed = 2;
let enemySpawnRate = 3000;
let enemySpawnInterval = setInterval(spawnEnemy, enemySpawnRate);

let score = 0;
let level = 1;
let lives = 3;
let gameOver = false;

// Initialize Game
tankImage.onload = draw;

// Drawing Function
function draw() {
    if (gameOver) return;
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.drawImage(tankImage, tank.x, tank.y, tank.width, tank.height);

    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        ctx.drawImage(bulletImage, bullet.x, bullet.y, 30, 15);
        if (bullet.x > canvas.width) bullets.splice(index, 1);
    });
   
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, 90, 70);
        enemy.x -= enemySpeed;
    });    
   
    drawScore();
    drawLives();      

}

function drawScore() {
    ctx.fillStyle = 'green';
    ctx.font = '28px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Level: ' + level, 10, 60);
}

function drawLives() {
    ctx.fillStyle = 'red';
    ctx.font = '28px Arial';
    ctx.fillText('Lives: ' + lives, canvas.width - 100, 30);
}


function moveTank(event) {
    if (gameOver) return;

    switch (event.keyCode) {
    
        case 38: // up
            tank.y -= tank.speed;
            break;
     
        case 40: // down
            tank.y += tank.speed;
            break;
        case 32: // spacebar - shoot
            shootBullet();
            break;
    }
    draw();
}

function shootBullet() {
    shootSound.play();
    bullets.push({ x: tank.x + tank.width, y: tank.y + tank.height / 2, speed: bulletSpeed });
}

function spawnEnemy() {
    enemies.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 40,
        height: 40
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + 10 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 5 > enemy.y) {
                explosionSound.play();
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                levelUp();
            }
        });
    });


}

function levelUp() {
    if (score % 100 === 0) {
        level++;
        lives++;
        enemySpeed += 0.7;
        if (enemySpawnRate > 500) {
            enemySpawnRate -= 200;
            clearInterval(enemySpawnInterval);
            enemySpawnInterval = setInterval(spawnEnemy, enemySpawnRate);
        }
    }
}

function checkTankCollisions() {
    enemies.forEach((enemy, index) => {
        if (tank.x < enemy.x + enemy.width &&
            tank.x + tank.width > enemy.x &&
            tank.y < enemy.y + enemy.height &&
            tank.y + tank.height > enemy.y) {
            lives--; // Deduct a life
            enemies.splice(index, 1); // Remove the enemy that collided
            if (lives <= 0) {
                gameOver = true;
                document.getElementById('startButton').style.display = 'block'; // Show the start button
                document.getElementById('gameCanvas').style.display = 'none'; // Optionally hide the canvas

                alert('Game Over!\nYour score: ' + score + '\nYour Level: ' + level);
                let playAgain = confirm('Do you want to play again?');
                if (playAgain) {
                    location.reload(); // Reloads the page to restart the game
                }  
            }
        }
    });
}

function resetGame() {
    score = 0;
    level = 1;
    lives = 3;
    gameOver = false;
    enemies.length = 0; // Clear any existing enemies
    bullets.length = 0; // Clear any existing bullets
    tank.x = 100; // Reset tank position if necessary
    tank.y = 100;
    enemySpeed = 2;
    enemySpawnRate = 3000;
    clearInterval(enemySpawnInterval);
    enemySpawnInterval = setInterval(spawnEnemy, enemySpawnRate);
}



// the gameLoop function 
function gameLoop() {
    if (!gameOver) {
        draw();
        checkCollisions();
        checkTankCollisions(); 
        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('keydown', moveTank);
gameLoop();

// Event Listener for Start Game Button
document.getElementById('startButton').addEventListener('click', function() {
    this.style.display = 'none'; 
    document.getElementById('gameCanvas').style.display = 'block'; 
    document.getElementById('gameDescription').style.display = 'none';
    resetGame();
    gameLoop(); 
});