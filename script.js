// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

// Initialize 2d drawing context instance for canvas element.
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// Dimensions
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let snakeWidth = 10;
let snakeHeight = 10;
let maxCanvasBlockWidth = canvasWidth / snakeWidth;
let maxCanvasBlockHeight = canvasHeight / snakeHeight;

// Initial parameters for game.
let score = 4;
let direction = "right";
let gameState = 0;


 // Visual element used to toggle theme settings.
 const TOGGLEON = "fa-toggle-on";
 const TOGGLEOFF = "fa-toggle-off";

//  Initialize a snake of 4 blocks.
//  A snake is an array of objects 
//  Each object defines the x and y coordinates of the individual blocks that make up the snake.
 let snake = createSnake(4);

// Randomize food block location at least 5 blocks from edges to minimize difficulty.
let food = createRandomFoodObject(maxCanvasBlockWidth, maxCanvasBlockHeight, 5);

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

// Initialize the game and background theme.
window.addEventListener("load", () => {

    displayStart();
    loadTheme();

});

// Move the snake based on user input of arrow keys.
document.addEventListener("keydown", getDirection);

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

// Initializes the game state.
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
    clearCanvas(context, canvasWidth, canvasHeight);
    snake = createSnake(4);
    direction = "right";
    displayStart();
    score = 4;

}

function getDirection(event) {

    if ((event.code == "ArrowUp" || event.code == "KeyW") && (direction != "down")) {

        direction = "up";

    } else if ((event.code == "ArrowDown" || event.code == "KeyS") && (direction != "up")) {

        direction = "down";

    } else if ((event.code == "ArrowLeft" || event.code == "KeyA") && (direction != "right")) {

        direction = "left";

    } else if ((event.code == "ArrowRight" || event.code == "KeyD") && (direction != "left")) {

        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 0)) {

        window.game = startGame();
        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 1)) {

        window.game();

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

function checkCollision(x, y, snakeArray) {
    
    for (let i = 0; i < snakeArray.length; i++) {

        if ((x == snakeArray[i].x) && (y == snakeArray[i].y)) {

            return true;
            
        }

    }

    return false;

}

function checkOutOfBounds(snakeX, snakeY, maxCanvasBlockWidth, maxCanvasBlockHeight) {

    return (snakeX < 0 || snakeY < 0 || snakeX >= maxCanvasBlockWidth ||  snakeY >= maxCanvasBlockHeight)
    
}

function drawScore(score) {

    context.fillStyle = "yellow";
    context.font = "10px Verdana";
    context.fillText(`Score: ${score}`, 5, canvasHeight - 5);

}

function clearCanvas(context, canvasWidth, canvasHeight) {

    context.clearRect(0, 0, canvasWidth, canvasHeight);

}

function draw() {

    clearCanvas(context, canvasWidth, canvasHeight);

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
    if (checkOutOfBounds(snakeX, snakeY, maxCanvasBlockWidth, maxCanvasBlockHeight) || checkCollision(snakeX, snakeY, snake)) {

        displayGameOver();
        gameState = 1;

    }

    if ((snakeX == food.x) && (snakeY == food.y)) {

        food = createRandomFoodObject(maxCanvasBlockWidth, maxCanvasBlockHeight, 5);

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

function getRandomArbitraryNumber(min, max) {

    return Math.random() * (max - min) + min;

}

function createSnake(len) {

    let snake = [];
    
    for (let i = len - 1; i >= 0; i--) {
    
        snake.push({ x: i, y: 0});
    
    }

    return snake;

 }

 function createRandomFoodObject(maxCanvasBlockWidth, maxCanvasBlockHeight, borderOffset = 0) {

    return {

        x: Math.floor(getRandomArbitraryNumber(5, maxCanvasBlockWidth - borderOffset)),
        y: Math.floor(getRandomArbitraryNumber(5, maxCanvasBlockHeight - borderOffset)),
    
    };

}

