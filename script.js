// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //
class Block {

    constructor(blockDimension = 1, x = 0, y = 0) {

        this.dimensions = {

            blockWidth: blockDimension,
            blockHeight: blockDimension,

        };

        this.position = {

            x,
            y,

        };

    }

    drawBlock(context) {

        context.fillStyle = "white";
        context.fillRect(this.position.x * this.dimensions.blockWidth, this.position.y * this.dimensions.blockHeight, this.dimensions.blockWidth, this.dimensions.blockHeight);

        context.strokeStyle = "aqua";
        context.strokeRect(this.position.x * this.dimensions.blockWidth, this.position.y * this.dimensions.blockHeight, this.dimensions.blockWidth, this.dimensions.blockHeight);

    }

}

class Snake {

    constructor(length = 1, blockDimensions = 1) {

        this.blockDimensions = blockDimensions;

        this.blocks = (() => {
            
            let blockArray = [];

            for (let i = length - 1; i >= 0; i--) {
            
                blockArray.push(new Block(this.blockDimensions, i, 0));
            
            }
    
            return blockArray;

        })();

        this.length = this.blocks.length;

        this.head = this.blocks[0]

    }

    set head(block) {

        this.blocks.unshift(block);

    }

    get head() {

        return this.blocks[0];

    }

    set length(value) {

        return;

    }

    get length() {
        return this.blocks.length;
    }

    pop() {

        this.blocks.pop();

    }

    drawSnake(context, snake) {

        for (let i = 0; i < snake.length; i++) {
            
            this.blocks[i].drawBlock(context);

        }

    }

}

class Food {

    constructor(blockDimensions = 1, x = 0, y = 0){

        this.position = {
       
               x,
               y,
           
        };

        this.block = new Block(blockDimensions, this.position.x, this.position.y)

    }

    randomizePosition(maxHorizontalPosition = 1, maxVerticalPosition = 1, borderOffset = 0) {

        this.position = {
       
            x: Math.floor(getRandomArbitraryNumber(borderOffset, maxVerticalPosition - borderOffset)),
            y: Math.floor(getRandomArbitraryNumber(borderOffset, maxHorizontalPosition - borderOffset)),
        
        };

    }

}

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

// Initialize 2d drawing context for canvas element.
let canvas = document.querySelector(".snake-game__display");
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

let food = new Food(10)
food.randomizePosition(blockSpanHorizontal, blockSpanVertical, 5);

let theme = document.querySelector(".theme-toggle");

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

// Initialize the game and background theme.
window.addEventListener("load", () => {

    theme.classList.add('fas', 'fa-toggle-off');
    theme.style.fontSize = '30px';
    theme.style.cursor = 'pointer';
    displayStart(context);
    loadTheme();

});

// Move the snake based on user input of arrow keys.
document.addEventListener("keydown", () => {

    getDirection(event, context, canvas);

});

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

// Initializes the game state.
function startGame(context, canvas) {

    gameState = 1;

    let interval = setInterval(draw, 45, context, canvas);

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
function getDirection(event, context, canvas) {
    
    if ((event.code == "ArrowUp" || event.code == "KeyW") && (direction != "down")) {

        direction = "up";

    } else if ((event.code == "ArrowDown" || event.code == "KeyS") && (direction != "up")) {

        direction = "down";

    } else if ((event.code == "ArrowLeft" || event.code == "KeyA") && (direction != "right")) {

        direction = "left";

    } else if ((event.code == "ArrowRight" || event.code == "KeyD") && (direction != "left")) {

        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 0)) {

        window.game = startGame(context, canvas);
        direction = "right";

    } else if ((event.code == "Enter") && (gameState == 1)) {

        window.game();

    }
}

// Draw food block at given location.
function drawFood(context, food, blockWidth, blockHeight) {

    context.fillStyle = "yellow";
    context.fillRect(food.position.x * blockWidth, food.position.y * blockHeight, blockWidth, blockHeight);

    context.strokeStyle = "orange";
    context.strokeRect(food.position.x * blockWidth, food.position.y * blockHeight, blockWidth, blockHeight);

}

// Detect collision of snake against itself.
function checkCollision(x, y, snake) {
    
    for (let i = 0; i < snake.length; i++) {

        if ((x == snake.blocks[i].position.x) && (y == snake.blocks[i].position.y)) {

            return true;
            
        }

    }

    return false;

}

// Detect collision of snake with borders.
function checkOutOfBounds(snakeHeadX, snakeHeadY, blockSpanHorizontal, blockSpanVertical) {

    return (snakeHeadX < 0 || snakeHeadY < 0 || snakeHeadX >= blockSpanHorizontal ||  snakeHeadY >= blockSpanVertical)
    
}

// Display score in bottom left corner.
function drawScore(score, context, canvas) {

    context.fillStyle = "yellow";
    context.font = "10px Verdana";
    context.fillText(`Score: ${score}`, 5, canvas.height - 5);

}

// Clear all drawings on canvas with given context.
function clearCanvas(context, canvas) {

    context.clearRect(0, 0, canvas.width, canvas.height);

}

// Draw a snake on canvas given the context.
function draw(context, canvas) {

    clearCanvas(context, canvas);

    snake.drawSnake(context, snake);
    
    drawFood(context, food, blockWidth, blockHeight);

    let snakeHeadX = snake.blocks[0].position.x;
    let snakeHeadY = snake.blocks[0].position.y;
    
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

    if ((snakeHeadX == food.position.x) && (snakeHeadY == food.position.y)) {

        food.randomizePosition(blockSpanHorizontal, blockSpanVertical, 5);
        
        score++;

    } else {

        snake.pop();

    }

    snake.head = new Block(snake.blockDimensions, snakeHeadX, snakeHeadY);
    
    drawScore(score, context, canvas);

}

// Show the start screen.
function displayStart(context) {

    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Snake Game", 130, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to start`, 152, 300);

}

// Show the game over screen after clear;ing the canvas.
function displayGameOver(context, canvas) {

    clearCanvas(context, canvas);
    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Game Over", 135, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to try again`, 125, 300);

}

// Load a background theme.
function loadTheme() {
    
    let style = localStorage.getItem("THEME");

    if (style == "dark") {

        let element = document.getElementById("toggle");

        element.classList.toggle(TOGGLEON);
        element.classList.toggle(TOGGLEOFF);

        document.body.style.background = "rgba(0, 0, 0, 0.75)";

    }

}

// Display a background theme depending on the toggle element.
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

// Returns an arbitrary number between min and max.
function getRandomArbitraryNumber(min, max) {

    return Math.random() * (max - min) + min;

}

// Create a food object with a random position.
 function createRandomFoodObject(blockSpanHorizontal, blockSpanVertical, borderOffset = 0) {

    return {

        x: Math.floor(getRandomArbitraryNumber(5, blockSpanHorizontal - borderOffset)),
        y: Math.floor(getRandomArbitraryNumber(5, blockSpanVertical - borderOffset)),
    
    };

}
