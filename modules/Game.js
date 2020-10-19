import Food from './Food.js';
import Snake from './Snake.js';

class Game {

    constructor(context, canvas) {

        this.context = context;
        this.canvas = canvas;

        // Dimensions
        this.blockDimensions = 10;
        this.blockSpanHorizontal = this.canvas.width / this.blockDimensions;
        this.blockSpanVertical = this.canvas.height / this.blockDimensions;
        this.borderOffset = 5;

        // Init Snake
        this.snake = new Snake(this.blockDimensions);

        // Init Food
        this.food = new Food(this.blockDimensions)
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
        this.score = 4;

        // Initial state.
        this.state = {

            gameStarted: 0,
            gameEnded: 0,
            gamePaused: 0,

        }
        
        // Bind instantiated Game object to render method.
        this.render = this.render.bind(this);
        
    }

    // --------------- Game Methods --------------- //

    startGame() {

        this.interval = setInterval(this.render, 45, this.context, this.canvas);
        this.state.gameStarted = 1;

    }

    clearCanvas() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

    displayStart() {
       
       this.context.fillStyle = "gold";
       this.context.font = "32px 'press_start_2pregular'";
       this.context.fillText("Snake Game", 95, 220);
       this.context.font = "24px Verdanna";
       this.context.fillText(`Press "Enter" to start`, 145, 300);
    
    }

    displayGameOver() {

        this.context.fillStyle = "gold";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Over", 110, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to try again`, 125, 300);
        this.drawScore();

    }

    displayGamePaused() {

        this.context.fillStyle = "gold";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Paused", 73, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to resume or 'n' to reset`, 70, 300);
        this.drawScore();

    }

    resetDisplay() {

        this.clearCanvas();
        this.displayStart();

    }

    endGame() {

        this.clearCanvas();
        this.displayGameOver();
        this.state.gameEnded = 1;

    }

    pauseGame() {

        this.clearCanvas();
        this.displayGamePaused();
        this.state.gamePaused = 1;

    }

    resumeGame() {

        this.state.gamePaused = 0;

    }

    resetGame() {

       clearInterval(this.interval);
       this.clearCanvas();
       this.resetProps();
       this.displayStart();

    }

    resetProps() {

        this.state.gameStarted = 0;
        this.state.gamePaused = 0;
        this.state.gameEnded = 0;
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

        if (!this.state.gameStarted) {

            // Nonactive Game. Start the Game.
            this.startGame();

        } else {

            if (!this.state.gameEnded) {

                //Active Game. Pause the game.
                this.pauseGame();

            } else {

                // Game Over. Reset the game.
                this.resetGame();

            }

        }

    }

    gameOver() {

        if (this.snake.headCollision(this.blockSpanHorizontal, this.blockSpanVertical)) {

            this.endGame();
            return true;

        }

    }

    snakeAteFood() {

        return ((this.snake.head.x == this.food.x) && (this.snake.head.y == this.food.y));

    }

    waitForNextInterval() {

        return (this.state.gamePaused || this.state.gameEnded || this.gameOver());

    }

    drawNextFrame() {

        this.clearCanvas();
        this.snake.drawSnake(this.context);
        this.food.drawFood(this.context);

        if (this.snakeAteFood()) {

            this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
            this.score++;

        } else {

            this.snake.pop();

        }

        this.snake.head = this.snake.nextHead;

        this.drawScore();

    }

    render() {

        if (this.waitForNextInterval()) { 

            return; 

        } else {

            this.drawNextFrame();

        }

        // User input has been processed. Allow new user input.
        this.snake.inputLocked = 0;

    }

}

export default Game;