'use strict';

// -------------------------------------------------- CLASS DEFINITIONS -------------------------------------------------- //
class Block {

    constructor(blockDimension = 1, x = 0, y = 0) {

        this.blockDimension = blockDimension;

        this.x = x;
        this.y = y;

    }

    // --------------- Block Methods --------------- //

    drawBlock(context, fill, stroke) {

        context.fillStyle = fill;
        context.fillRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

        context.strokeStyle = stroke;
        context.strokeRect(this._x * this.blockDimension, this._y * this.blockDimension, this.blockDimension, this.blockDimension);

    }

    // ----------- Block Getters/Setters ----------- //

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

    constructor(blockDimensions = 1, length = 1, initialDirection = "ArrowRight") {

        super(blockDimensions);

        this.blockDimensions = blockDimensions;
        this.length = length;
        this.direction = initialDirection;
        this.inputLocked = 0;
        
        this.blocks = (() => {

            let blockArray = [];

            for (let i = this.length - 1; i >= 0; i--) {

                let block = new Block(this.blockDimension);
                block.x = i;
                block.y = 0;
                blockArray.push(block);

            }

            return blockArray;

        })();

        this.head = this.blocks[0];

        this.nextHead = (() => {

            let nextHead = new Block(this.blockDimensions, this.snake.head.x, this.snake.head.y);

            if (this.direction == "up") {

                nextHead.y--;

            } else if (this.direction.y == "down") {

                nextHead.y++;

            } else if (this.direction == "left") {

                nextHead.x--;

            } else if (this.direction == "right") {

                nextHead.x++;

            }

            return nextHead;

        });
        
    }

    // --------------- Snake Methods --------------- //

    pop() {

        this.blocks.pop();

    }

    unshift(value) {

        this.blocks.unshift(value);

    }

    drawSnake(context) {

        for (let i = this.length - 1; i >= 0; i--) {

            this.blocks[i].drawBlock(context, "white", "aqua");

        }

    }

    boundsCollision(totalHorizontalBlocks, totalVerticalBlocks) {

        return (this.nextHead.x < 0 || this.nextHead.y < 0 || this.nextHead.x >= totalHorizontalBlocks || this.nextHead.y >= totalVerticalBlocks);

    }

    selfCollision() {

        for (let block of this.blocks) {

            return ((this.nextHead.x == block.x) && (this.nextHead.y == block.y));

        }

    }

    headCollision(totalHorizontalBlocks, totalVerticalBlocks) {

        this.nextHead = (() => {

            let nextHead = new Block(this.blockDimensions, this.head.x, this.head.y);

            if (this.direction == "up") {

                nextHead.y--;

            } else if (this.direction == "down") {

                nextHead.y++;

            } else if (this.direction == "left") {

                nextHead.x--;

            } else if (this.direction == "right") {

                nextHead.x++;

            }

            return nextHead;

        })();

        return (this.selfCollision() || this.boundsCollision(totalHorizontalBlocks, totalVerticalBlocks));

    }


    // ----------- Snake Getters/Setters ----------- //

    set direction(code) {

            if ((code == "ArrowUp" || code == "KeyW") && (this._direction != "down")) {

                this._direction = "up";

            } else if ((code == "ArrowDown" || code == "KeyS") && (this._direction != "up")) {

                this._direction = "down";

            } else if ((code == "ArrowLeft" || code == "KeyA") && (this._direction != "right")) {

                this._direction = "left";

            } else if ((code == "ArrowRight" || code == "KeyD") && (this._direction != "left")) {

                this._direction = "right";

            }

            this.inputLocked = 1;

    }

    set length(value) {

        this._length = value;

        this.blocks = (() => {

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

    get direction() {

        return this._direction;

    }

    get length() {

        return this.blocks.length;

    }

    get head() {

        return this.blocks[0];

    }

}

class Food extends Block {

    constructor(blockDimension = 1) {

        super(blockDimension);

        this.block = new Block(blockDimension);

    }

    // --------------- Food Methods --------------- //

    randomizePosition(maxHorizontalPosition = 1, maxVerticalPosition = 1, borderOffset = 0) {

        this.block.x = Math.floor(getRandomArbitraryNumber(borderOffset, maxVerticalPosition - borderOffset));
        this.block.y = Math.floor(getRandomArbitraryNumber(borderOffset, maxHorizontalPosition - borderOffset));

    }

    drawFood(context) {

        this.block.drawBlock(context, "yellow", "orange");

    }

    // ----------- Food Getters/Setters ----------- //

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

class Game {

    constructor(context, canvas) {

        this.context = context;
        this.canvas = canvas;

        // // Dimensions
        this.blockDimensions = 10;
        this.blockSpanHorizontal = this.canvas.width / this.blockDimensions;
        this.blockSpanVertical = this.canvas.height / this.blockDimensions;
        this.borderOffset = 5;

        // Init Snake
        this.initialSnakeLength = 4;
        this.snake = new Snake(this.blockDimensions, this.initialSnakeLength);

        // Init Food
        this.food = new Food(this.blockDimensions)
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);

        // // Initial parameters for game.
        this.score = 4;
        // this.snake.direction defaults to "ArrowRight"
        this.gameStarted = 0;
        this.gameEnded = 0;
        this.gamePaused = 0;

        // Bind instantiated Game object to render method.
        this.render = this.render.bind(this);
    }

    startGame() {

        this.interval = setInterval(this.render, 45, this.context, this.canvas);
        this.gameStarted = 1;

    }

    clearCanvas() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

    displayStart() {

       this.context.fillStyle = "gold";
       this.context.font = "48px Verdanna";
       this.context.fillText("Snake Game", 130, 220);
       this.context.font = "24px Verdanna";
       this.context.fillText(`Press "Enter" to start`, 152, 300);
    
    }

    displayGameOver() {

        this.context.fillStyle = "gold";
        this.context.font = "48px Verdanna";
        this.context.fillText("Game Over", 135, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to try again`, 125, 300);

    }

    displayGamePaused() {

        this.context.fillStyle = "gold";
        this.context.font = "48px Verdanna";
        this.context.fillText("Game Paused", 120, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to resume or 'n' to reset`, 70, 300);

    }

    resetDisplay() {

        this.clearCanvas();
        this.displayStart();

    }

    endGame() {

        this.clearCanvas();
        this.displayGameOver();
        this.gameEnded = 1;

    }

    pauseGame() {

        this.clearCanvas();
        this.displayGamePaused();
        this.gamePaused = 1;

    }

    resumeGame() {

        this.gamePaused = 0;

    }

    resetGame() {

       clearInterval(this.interval);
       this.clearCanvas();
       this.resetProps();
       this.displayStart();

    }

    resetProps() {

        this.gameStarted = 0;
        this.gamePaused = 0;
        this.gameEnded = 0;
        this.snake = new Snake(this.blockDimensions, this.initialSnakeLength);
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
        this.direction = "right";
        this.score = 4;

    }

    drawScore() {

        this.context.fillStyle = "yellow";
        this.context.font = "10px Verdana";
        this.context.fillText(`Score: ${this.score}`, this.borderOffset, this.canvas.height - this.borderOffset);

    }

    resolvePausedGame(event) {

        if (event.code == 'Enter') {

            // Paused Game. Resume the game.
            this.resumeGame();

        } else if (event.code == 'KeyN') {

            // Paused Game. Restart the game.
            this.resetGame();

        }

    }

    handleEnterKey() {

        if (!this.gameStarted) {

            // Nonactive Game. Start the Game.
            this.startGame();

        } else {

            if (!this.gameEnded) {

                //Active Game. Pause the game.
                this.pauseGame();

            } else {

                // Game Over. Reset the game.
                this.resetGame();

            }

        }

    }

    getNextHead() {

        this.snake.nextHead = new Block(this.blockDimensions, this.snake.head.x, this.snake.head.y)

        if (this.direction == "up") {

            this.snake.nextHead.y--;

        } else if (this.direction.y == "down") {

            this.snake.nextHead.y++;

        } else if (this.direction == "left") {

            this.snake.nextHead.x--;

        } else if (this.direction == "right") {

            this.snake.nextHead.x++;

        }

    }

    render() {

        if (this.gamePaused || this.gameEnded) { return; }
        
        this.clearCanvas();

        this.snake.drawSnake(this.context);

        this.food.drawFood(this.context);

        // Game Over
        if (this.snake.headCollision(this.blockSpanHorizontal, this.blockSpanVertical)) {

            this.endGame();
            return;

        }

        if ((this.snake.nextHead.x == this.food.x) && (this.snake.nextHead.y == this.food.y)) {

            this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
            this.score++;

        } else {

            this.snake.pop();

        }

        this.snake.head = this.snake.nextHead;

        this.drawScore();

        // User input has been processed. Allow new user input.
        this.snake.inputLocked = 0;

    }

}

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

// Initialize 2d drawing context for canvas element.
let canvas = document.querySelector(".snake-game__display");
let context = canvas.getContext("2d");

let game = new Game(context, canvas);

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

// Selector for toggle icon that allows user to select light or dark theme.
let theme = document.querySelector(".theme-toggle");

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

// Initialize the game and background theme.
window.addEventListener("load", () => {

    theme.classList.add('fas', 'fa-toggle-off');
    theme.style.fontSize = '30px';
    theme.style.cursor = 'pointer';
    loadTheme();

    game.displayStart();

});

// Move the snake based on user input of arrow keys.
document.addEventListener("keydown", () => {

    if (game.gamePaused) {

        game.resolvePausedGame(event);
        
    } else if (event.code == "Enter") { 

        game.handleEnterKey()

    } else if (!game.snake.inputLocked) {
        
        game.snake.direction = event.code;

    }

});

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// Returns an arbitrary number between min and max.
function getRandomArbitraryNumber(min, max) {

    return Math.random() * (max - min) + min;

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