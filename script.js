// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //
class Block {

    constructor(blockDimension = 1, x = 0, y = 0) {

        this.blockDimension = blockDimension;

        this.x = x;

        this.y = y;

    }

    // --------------- Methods --------------- //

    drawBlock(context, fill, stroke) {

        context.fillStyle = fill;
        context.fillRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

        context.strokeStyle = stroke;
        context.strokeRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

    }

    // ----------- Getters/Setters ----------- //

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

}

class Snake extends Block {

    constructor(blockDimension = 1, length = 1) {

        super(blockDimension);

        this.blockDimension = blockDimension;
        
        this.blocks = (() => {
            
            let blockArray = [];

            for (let i = length - 1; i >= 0; i--) {

                let block = new Block(this.blockDimension);
                block.x = i;
                block.y = 0;
                blockArray.push(block);
            
            }
    
            return blockArray;

        })();

        this.length = this.blocks.length;

        this.head = this.blocks[0]

    }

    // --------------- Methods --------------- //

    pop() {

        this.blocks.pop();

    }

    drawSnake(context) {

        for (let i = this.length - 1; i >= 0; i--) {
            
            this.blocks[i].drawBlock(context, "white", "aqua");

        }

    }

     // ----------- Getters/Setters ----------- //

    set length(value) {

        this._length = value;

        this._blocks = (() => {
            
            let blockArray = [];

            for (let i = this._length - 1; i >= 0; i--) {

                let block = new Block(this.blockDimension);
                block.x = i;
                block.y = 0;
                blockArray.push(block);
            
            }
    
            return blockArray;

        })();

    }

    set head(block) {

        this.blocks.unshift(block);

    }

    get length() {

        return this.blocks.length;

    }

    get head() {

        return this.blocks[0];

    }

}

class Food extends Block {

    constructor(blockDimension = 1){

        super(blockDimension);

        this.block = new Block(blockDimension);

    }

    // --------------- Methods --------------- //

    randomizePosition(maxHorizontalPosition = 1, maxVerticalPosition = 1, borderOffset = 0) {

        this.block.x = Math.floor(getRandomArbitraryNumber(borderOffset, maxVerticalPosition - borderOffset));
        this.block.y = Math.floor(getRandomArbitraryNumber(borderOffset, maxHorizontalPosition - borderOffset));

    }

    drawFood(context) {

        this.block.drawBlock(context, "yellow", "orange");
    
    }

     // ----------- Getters/Setters ----------- //
    
    set block(blockObj) {
        
        this._block = blockObj;

    }

    set x(value) {

        this._x = value;

        this._block = new Block(this.blockDimension, this._y, this._x);

    }

    set y(value) {

        this._y = value;

        this._block = new Block(this.blockDimension, this._y, this._x);

    }

    get block() {

        return this._block;

    }

    get x() {

        return this._block.x;

    }

    get y() {

        return this._block.y;

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
let gameStarted = 0;
let gameEnded = 0;
let gamePaused = 0;

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

//  Initialize a snake of 4 blocks.
//  A snake is an array of objects.
//  Each object defines the x and y coordinates of the individual blocks that make up the snake.
let snake = new Snake(10, 4);

// Randomize food block location at least 5 blocks from edges to minimize difficulty.
let food = new Food(10)
food.randomizePosition(blockSpanHorizontal, blockSpanVertical, 5);

// Used to prevent multiple user inputs per timer interval which can create snake collision bugs.
let userAction = 0;

// Selector for toggle icon that allows user to select light or dark theme.
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

    // If user entered a keyboard input, gameEnded until next timer interval for new user input.
    if (userAction) return;
    getDirection(event, context, canvas);

});

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// -------------------------------------------------- FUNCTION DEFINITIONS -------------------------------------------------- //

// Initializes the game state.
function startGame(context, canvas) {

    let interval = setInterval(draw, 45, context, canvas);
    gameStarted = 1;
    gameEnded = 0;
    gamePaused = 0;

    // 0 for gameover, 1 for reset, 2 for pause.
    return ((state) => {

        if (state == 1) {

            clearInterval(interval);
            resetGame(context, canvas);

        } else  if (state == 0) {

            displayGameOver(context, canvas);

        } else if (state == 2) {

            displayGamePaused(context, canvas);

        }
        
    });

}

// Reset display and initial game parameters,
function resetGame(context, canvas) {

    resetDisplay(context, canvas)
    gameStarted = 0;
    gamePaused = 0;
    gameEnded = 1;
    snake = new Snake(10, 4);
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

    if (gamePaused) {
        
        if (event.code == 'Enter') {

            // Paused Game. Resume the game.
            resumeGame();
    
        } else if (event.code == 'KeyN') {

            // Paused Game. Restart the game.
            window.game(1);

        }

        return;

    }
    

    if (event.code == "Enter") {

        if (!gameStarted) {

            // Nonactive Game. Start the Game.
            window.game = startGame(context, canvas);
            direction = "right";
            
        } else {

            if (!gameEnded) {

                //Active Game. Pause the game.
                window.game(2);

            } else {

                // Game Over. Reset the game.
                window.game(1);

            }
            
        }

        return;

    }

    if (!(gameEnded || gamePaused)) {

        // If user enters any movement key, raise userAction flag to prevent further input.
        userAction = 1;

        let prevDirection = direction;

        if ((event.code == "ArrowUp" || event.code == "KeyW") && (direction != "down")) {

            direction = "up";

        } else if ((event.code == "ArrowDown" || event.code == "KeyS") && (direction != "up")) {

            direction = "down";

        } else if ((event.code == "ArrowLeft" || event.code == "KeyA") && (direction != "right")) {

            direction = "left";

        } else if ((event.code == "ArrowRight" || event.code == "KeyD") && (direction != "left")) {

            direction = "right";

        }

        // Bypass timer interval and immediately update canvas if user changes direction for more responsive movement.
        if (direction != prevDirection) {

            draw(context, canvas);

        }

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

        if ((x == snake.blocks[i].x) && (y == snake.blocks[i].y)) {

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

    if (gamePaused) { return; }

    clearCanvas(context, canvas);

    snake.drawSnake(context, snake);
    
    food.drawFood(context);

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

        window.game(0);
        gameEnded = 1;
        userAction = 0;
        return;

    }

    if ((snakeHeadX == food.x) && (snakeHeadY == food.y)) {

        food.randomizePosition(blockSpanHorizontal, blockSpanVertical, 5);
        
        score++;

    } else {

        snake.pop();

    }

    snake.head = new Block(snake.blockDimension);
    snake.head.x = snakeHeadX;
    snake.head.y = snakeHeadY;
    
    drawScore(score, context, canvas);

    // User input has been processed. Allow new user input.
    userAction = 0;

}

// Show the start screen.
function displayStart(context) {

    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Snake Game", 130, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to start`, 152, 300);

}

// Show the game over screen after clearing the canvas.
function displayGameOver(context, canvas) {

    clearCanvas(context, canvas);
    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Game Over", 135, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to try again`, 125, 300);

}

// Show the pause screen after clearing the canvas.
function displayGamePaused(context, canvas) {

    clearCanvas(context, canvas);
    
    context.fillStyle = "gold";
    context.font = "48px Verdanna";
    context.fillText("Game Paused", 120, 220);
    context.font = "24px Verdanna";
    context.fillText(`Press "Enter" to resume or 'n' to reset`, 75, 300);

    gamePaused = 1;

}

// Resets the gamePaused flag which allows draw function to continue rendering.
function resumeGame() {

    gamePaused = 0;

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
