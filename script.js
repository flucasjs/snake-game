// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let snakeWidth = 10;
let snakeHeight = 10;
let score = 4;
let direction = "right";
let game = false;
let gameState = 0;
let maxWidth = canvasWidth / snakeWidth;
let maxHeight = canvasHeight / snakeHeight;

 // Visual element used to toggle theme settings.
 const TOGGLEON = "fa-toggle-on";
 const TOGGLEOFF = "fa-toggle-off";

let len = 4;
let snake = [];

for (let i = len - 1; i >= 0; i--) {

    snake.push({ x: i, y: 0});

}

let food = {

    x: Math.floor(getRandomArbitrary(5, maxWidth - 5)),
    y: Math.floor(getRandomArbitrary(5, maxHeight - 5)),

}

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

window.addEventListener("load", () => {

    displayStart();
    loadTheme();

});

document.addEventListener("keydown", getDirection);

theme.addEventListener("click", setTheme);

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

function startGame() {

    gameState = 1;

    let interval = setInterval(draw, 45);

    return (() => {

        clearInterval(interval);
        resetGame();

    });

}

function resetGame() {

    gameState = 0;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    snake = [];

    for (let i = len - 1; i >= 0; i--) {

        snake.push({ x: i, y: 0});

    }

    direction = "right";
    displayStart();
    score = 4;

}

function getDirection(event) {

    if ((event.code == "ArrowUp") && (direction != "down")) {

        direction = "up";

    } else if ((event.code == "ArrowDown") && (direction != "up")) {

        direction = "down";

    } else if ((event.code == "ArrowLeft") && (direction != "right")) {

        direction = "left";

    } else if ((event.code == "ArrowRight") && (direction != "left")) {

        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 0)) {

        game = startGame();
        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 1)) {

        game();

    }
}

function drawSnake(x, y) {

    context.fillStyle = "white";
    context.fillRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);

    context.strokeStyle = "aqua";
    context.strokeRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);

}



function drawFood(x, y) {

    context.fillStyle = "yellow";
    context.fillRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);

    context.strokeStyle = "orange";
    context.strokeRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);

}

function checkCollision(x, y, array) {
    
    for (let i = 0; i < array.length; i++) {

        if ((x == array[i].x) && (y == array[i].y)) {

            return true;
            
        }

    }

    return false;

}

function drawScore(score) {

    context.fillStyle = "yellow";
    context.font = "10px Verdana";
    context.fillText(`Score: ${score}`, 5, canvasHeight - 5);

}

function draw() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < snake.length; i++) {

        let x = snake[i].x;
        let y = snake[i].y;
        drawSnake(x, y);

    }

    drawFood(food.x, food.y);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "up") {

        snakeY--;

    } else if (direction == "down") {

        snakeY++;

    } else if (direction == "left") {

        snakeX--;

    } else if (direction == "right") {

        snakeX++;

    }

    // Game Over
    if (snakeX < 0 || snakeY < 0 || snakeX >= maxWidth ||  snakeY >= maxHeight || checkCollision(snakeX, snakeY, snake)) {

        displayGameOver();
        gameState = 1;

    }

    if ((snakeX == food.x) && (snakeY == food.y)) {

        food = {

            x: Math.floor(getRandomArbitrary(5, maxWidth - 5)),
            y: Math.floor(getRandomArbitrary(5, maxHeight - 5)),
        
        };

        score++;

    } else {

        snake.pop();

    }

    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);
    drawScore(score);

}

function displayStart() {

    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Snake Game", 130, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to start`, 152, 300);

}

function displayGameOver() {

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Game Over", 135, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to try again`, 125, 300);

}

function loadTheme() {
    
    let style = localStorage.getItem("THEME");

    if (style == "dark") {

        let element = document.getElementById("toggle");

        element.classList.toggle(TOGGLEON);
        element.classList.toggle(TOGGLEOFF);

        document.body.style.background = "rgba(0, 0, 0, 0.75)";

    }

}

function setTheme() {

    let element = event.target;

    element.classList.toggle(TOGGLEON);
    element.classList.toggle(TOGGLEOFF);

    if (element.classList.contains(TOGGLEON)) {

        document.body.style.background = "rgba(0, 0, 0, 0.75)";
        localStorage.setItem("THEME", "dark");
        
        
    } else {

        document.body.style.background = "whitesmoke";
        localStorage.setItem("THEME", "light");

    }

}

function getRandomArbitrary(min, max) {

    return Math.random() * (max - min) + min;

}


