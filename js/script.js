const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

let boardBackground = "white";
let snakeColor = "lightgreen";
let snakeBorder = "black";
let foodColor = "red";
let gameOverTextColor = "black";

const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverSound = document.getElementById('gameOverSound');
const moveSound = document.getElementById('moveSound');
const eatSound = document.getElementById('eatSound');

// Sound control elements
const toggleSoundBtn = document.getElementById('toggleSound');
const volumeControl = document.getElementById('volumeControl');
const muteSoundBtn = document.getElementById('muteSound');

// Modal elements
const modal = document.getElementById('modal');
const playButton = document.getElementById('playButton');

// Start game when play button is clicked
playButton.addEventListener('click', startGame);

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function startGame() {
    modal.style.display = 'none';
    gameStart();
}

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();

    // Start background music
    toggleBackgroundMusic();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
        stopBackgroundMusic(); // Stop background music on game over
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);
    // If food is eaten
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        playEatSound(); // Play eating sound
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            playMoveSound(); // Play move sound
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            playMoveSound(); // Play move sound
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            playMoveSound(); // Play move sound
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            playMoveSound(); // Play move sound
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameHeight):
            running = false;
            playGameOverSound(); // Play game over sound
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            playGameOverSound(); // Play game over sound
            break;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = gameOverTextColor;
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStart();
}

// Function to toggle background music (play/pause)
function toggleBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

// Function to stop background music
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Function to adjust volume
function adjustVolume() {
    backgroundMusic.volume = volumeControl.value;
}

// Function to toggle mute/unmute
function toggleMute() {
    if (backgroundMusic.volume === 0) {
        backgroundMusic.volume = volumeControl.value;
        muteSoundBtn.textContent = "Mute";
    } else {
        backgroundMusic.volume = 0;
        muteSoundBtn.textContent = "Unmute";
    }
}

// Function to play move sound
function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.play();
}

// Function to play eat sound
function playEatSound() {
    eatSound.currentTime = 0;
    eatSound.play();
}

// Function to play game over sound
function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
}

// Function to set game mode
function setMode(mode) {
    switch (mode) {
        case 'classic':
            boardBackground = 'white';
            snakeColor = 'lightgreen';
            snakeBorder = 'black';
            foodColor = 'red';
            gameOverTextColor = 'black';
            break;
        case 'dark':
            boardBackground = 'black';
            snakeColor = 'white';
            snakeBorder = 'gray';
            foodColor = 'red';
            gameOverTextColor = 'white';
            break;
        case 'neon':
            boardBackground = 'black';
            snakeColor = 'cyan';
            snakeBorder = 'blue';
            foodColor = 'magenta';
            gameOverTextColor = 'cyan';
            break;
    }
    clearBoard(); // Clear the board to apply the new colors immediately
    drawSnake(); // Redraw the snake with the new colors
    drawFood(); // Redraw the food with the new colors
}
