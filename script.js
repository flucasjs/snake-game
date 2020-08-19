// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //

class Snake {

    constructor(length = 4, dimension = 10) {

        this.length = length;

        this.dimensions = {

            blockWidth: dimension,
            blockHeight: dimension,

        };

        this.blocks = (function() {
            
            let ary = [];


            for (let i = this.length - 1; i >= 0; i--) {
            
                ary.push({ x: i, y: 0 });
            
            }
    
            return ary;

        }).bind(this)();
        

    }

}

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

// Initialize 2d drawing context for canvas element.
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// Dimensions
let blockWidth = 10;
let blockHeight = 10;
let blockSpanHorizontal = canvas.width / blockWidth;
let blockSpanVertical = canvas.height / blockHeight;

// Initial parameters for game.
let score = 4;
let direction = "right";
let gameState = 0;

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

//  Initialize a snake of 4 blocks.
//  A snake is an array of objects.
//  Each object defines the x and y coordinates of the individual blocks that make up the snake.
let snake = new Snake(4, 10);

// Randomize food block location at least 5 blocks from edges to minimize difficulty.
let food = createRandomFoodObject(blockSpanHorizontal, blockSpanVertical, 5);



// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

// Initialize the game and background theme.
window.addEventListener("load", () => {

    displayStart(context);
    loadTheme();

});

// Move the snake based on user input of arrow keys.
document.addEventListener("keydown", getDirection);

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

// Initializes the game state.
function startGame(context, canvas, snake) {

    gameState = 1;

    let interval = setInterval(draw, 45, context, canvas, snake);

    return (() => {

        clearInterval(interval);
        resetGame(context, canvas);

    });

}

// Reset display and initial game parameters,
function resetGame(context, canvas) {

    resetDisplay(context, canvas)
    gameState = 0;
    snake = new Snake(4, 10);
    direction = "right";
    score = 4;

}

// Clears canvas and displays menu.
function resetDisplay(context, canvas) {

    clearCanvas(context, canvas);
    displayStart(context);

}

// Set direction based on user input. Reset game if Enter key is pressed.
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

        window.game = startGame(context, canvas, snake);
        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 1)) {

        window.game();

    }
}

// Draw a single snake block at given location.
function drawSnakeBlock(context, x, y, snake) {

    context.fillStyle = "white";
    context.fillRect(x * snake.dimensions.blockWidth, y * snake.dimensions.blockHeight, snake.dimensions.blockWidth, snake.dimensions.blockHeight);

    context.strokeStyle = "aqua";
    context.strokeRect(x * snake.dimensions.blockWidth, y * snake.dimensions.blockHeight, snake.dimensions.blockWidth, snake.dimensions.blockHeight);

}

// Draw snake of given block dimensions.
function drawSnake(context, snake) {

    for (let i = 0; i < snake.length; i++) {

        drawSnakeBlock(context, snake.blocks[i].x, snake.blocks[i].y, snake);

    }
}

// Draw food block at given location.
function drawFood(context, x, y, blockWidth, blockHeight) {

    context.fillStyle = "yellow";
    context.fillRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);

    context.strokeStyle = "orange";
    context.strokeRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);

}

function checkCollision(x, y, snake) {
    
    for (let i = 0; i < snake.length; i++) {

        if ((x == snake.blocks[i].x) && (y == snake.blocks[i].y)) {

            return true;
            
        }

    }

    return false;

}

function checkOutOfBounds(snakeHeadX, snakeHeadY, blockSpanHorizontal, blockSpanVertical) {

    return (snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX >= blockSpanHorizontal ||  snakeHeadY >= blockSpanVertical)
    
}

function drawScore(score, context, canvas) {

    context.fillStyle = "yellow";
    context.font = "10px Verdana";
    context.fillText(`Score: ${score}`, 5, canvas.height - 5);

}

function clearCanvas(context, canvas) {

    context.clearRect(0, 0, canvas.width, canvas.height);

}

function draw(context, canvas, snake) {

    clearCanvas(context, canvas);

    drawSnake(context, snake);

    drawFood(context, food.x, food.y, blockWidth, blockHeight);

    let snakeHeadX = snake.blocks[0].x;
    let snakeHeadY = snake.blocks[0].y;

    if (direction == "up") {

        snakeHeadY--;

    } else if (direction == "down") {

        snakeHeadY++;

    } else if (direction == "left") {

        snakeHeadX--;

    } else if (direction == "right") {

        snakeHeadX++;

    }

    // Game Over
    if (checkOutOfBounds(snakeHeadX, snakeHeadY, blockSpanHorizontal, blockSpanVertical) || checkCollision(snakeHeadX, snakeHeadY, snake)) {

        displayGameOver(context, canvas);
        gameState = 1;

    }

    if ((snakeHeadX == food.x) && (snakeHeadY == food.y)) {

        food = createRandomFoodObject(blockSpanHorizontal, blockSpanVertical, 5);

        score++;

    } else {

        snake.blocks.pop();

    }

    let newHead = { x: snakeHeadX, y: snakeHeadY };
    snake.blocks.unshift(newHead);
    drawScore(score, context, canvas);

}

function displayStart(context) {

    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Snake Game", 130, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to start`, 152, 300);

}

function displayGameOver(context, canvas) {

    clearCanvas(context, canvas);
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



 function createRandomFoodObject(blockSpanHorizontal, blockSpanVertical, borderOffset = 0) {

    return {

        x: Math.floor(getRandomArbitraryNumber(5, blockSpanHorizontal - borderOffset)),
        y: Math.floor(getRandomArbitraryNumber(5, blockSpanVertical - borderOffset)),
    
    };

}

