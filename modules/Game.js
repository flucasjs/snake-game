import Food from './Food.js';
import Snake from './Snake.js';

class Game {

    constructor(context, canvas, runningScore, scoreBoard) {

        // Game display
        this.context = context;
        this.canvas = canvas;

        // Score display
        this.runningScore = runningScore;
        this.scoreboard = scoreBoard;

        // Timer Interval
        this.interval = null;
        this.intervalTime = 45;
        this.minInterval = 20;

        // Dimensions
        this.blockDimensions = 10;
        this.blockSpanHorizontal = this.canvas.width / this.blockDimensions;
        this.blockSpanVertical = this.canvas.height / this.blockDimensions;
        this.borderOffset = 10;

        // Initialize Snake
        this.snake = new Snake(this.blockDimensions);

        // Initialize Food
        this.food = new Food(this.blockDimensions)
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);

        // Initialize scores
        this.score = 4;
        this.highScores = [10, 6, 4];

        // Initialize state
        this.state = {

            gameStarted: 0,
            gameEnded: 0,
            gamePaused: 0,

        }
        
        // Bind instantiated Game object to render method.
        this.render = this.render.bind(this);
        
    }

    // --------------- Game Methods --------------- //

    // Sets the game state to gameStarted and begins the timer interval for the render method.
    startGame() {

        this.state.gameStarted = 1;
        this.interval = setInterval(this.render, this.intervalTime, this.context, this.canvas);

    }

    // Clears all graphics on the game display.
    clearCanvas() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    }

    // Draws the intro screen on the game display.
    displayStart() {
       
       this.context.fillStyle = "#FFF";
       this.context.font = "32px 'press_start_2pregular'";
       this.context.fillText("Snek Game", 100, 220);
       this.context.font = "24px Verdanna";
       this.context.fillText(`Press "Enter" to start`, 145, 300);
    
    }

    // Draws the game over screen on the game display.
    displayGameOver() {

        this.context.fillStyle = "#FFF";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Over", 110, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to try again`, 125, 300);
        this.displayCurrentScore();

    }

    // Draws the pause screen on the game display.
    displayGamePaused() {

        this.context.fillStyle = "#FFF";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Paused", 73, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to resume or 'r' to reset`, 70, 300);
        this.displayCurrentScore();

    }

    // Draw the start screen after clearing all graphics on the game display.
    resetDisplay() {

        this.clearCanvas();
        this.displayStart();

    }

    // Set the game state to gameEnded and clear all graphics on the game display.
    // Draw the game over screen on the game display and the new high scores on the high score list.
    endGame() {

        this.state.gameEnded = 1;
        this.clearCanvas();
        this.displayGameOver();
        this.displayHighScores();

    }

    // Set the game state to gamePaused and clear all graphics on the game display.
    // Draw the pause screen on the game display.
    pauseGame() {

        this.state.gamePaused = 1;
        this.clearCanvas();
        this.displayGamePaused();
        
    }

    // Exit the gamePaused state.
    resumeGame() {

        this.state.gamePaused = 0;

    }

    // Clear the game display, reset all game properties, and draw the start screen on the game display.
    resetGame() {

       this.clearCanvas();
       this.resetProps();
       this.displayStart();

    }

    resetTimer() {

        clearInterval(this.interval);
        this.intervalTime = 45;

    }

    resetState() {

        this.state = {

            gameStarted: 0,
            gameEnded: 0,
            gamePaused: 0,

        }

    }

    resetSnake() {

        this.snake = new Snake(this.blockDimensions, this.initialSnakeLength);

    }

    resetScore() {

        this.score = 4;
        
    }

    resetDirection() {

        this.direction = "right";

    }

    resetProps() {
        
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
        this.resetSnake();
        this.resetTimer();
        this.resetState();
        this.resetDirection;
        this.resetScore();
        this.displayCurrentScore();

    }

    // Draw the running score on the game display.
    displayCurrentScore() {

        this.context.fillStyle = "#FFF";
        this.context.font = "12px 'press_start_2pregular'";
        this.context.fillText(`Score: ${this.score}`, this.borderOffset, this.canvas.height - this.borderOffset);

        this.runningScore.textContent = this.score;

    }

    // TODO: Refactor
    // Determine whether the final game score should be displayed on the high score list.
    // If the player achieves a new high score, updates the high score list with the new score.
    displayHighScores() {

        let smallestHighScore = this.highScores[2];

        if (this.score > smallestHighScore) {

            let newHighScore = this.score;

            const highScoreIndex = this.highScores.indexOf(newHighScore);

            if (highScoreIndex === -1) {

                this.highScores.push(newHighScore);

                this.highScores = this.highScores.sort((a, b) => {

                    return (b - a);

                }).filter((v, i, a) => {

                    return (v > smallestHighScore)

                })

                const scores = this.scoreboard.querySelectorAll('li');
                for (let i = 0; i < scores.length; i++) {

                    scores[i].textContent = `${this.highScores[i]} pts`;

                    if (Number.parseInt(scores[i].textContent) === newHighScore) {

                        let intervalCount = 0;

                        // Flashes new high score 4 times.
                        let animationInterval = setInterval(() => {

                            scores[i].style.color = 'yellow';

                            setTimeout(() => {

                                scores[i].style.color = 'black';

                            }, 125);

                            intervalCount++;

                            if (intervalCount > 3) {

                                clearInterval(animationInterval);
    
                            }

                        }, 250)

                    }
                }
            }
        }

    }

    // Allow the player to resume the game or restart the game while in the gamePaused state.
    resolvePausedGame(event) {

        if (!this.state.gamePaused) {
            throw Error("Attempting to resolve an unpaused game. The game must be paused if resolvePausedGame is called.")
        }

        if (event.code == 'Enter') {

            // Paused Game. Resume the game.
            this.resumeGame();

        } else if (event.code == 'KeyR') {

            // Paused Game. Restart the game.
            this.resetGame();

        }

    }

    // Determine whether to start, pause, or reset the game depending on which state the game is currently in when the user presses the "Enter" key.
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

    // TODO: Refactor
    // End the game upon snake collision with border or itself.
    gameOver() {

        if (this.snake.headCollision(this.blockSpanHorizontal, this.blockSpanVertical)) {

            this.endGame();
            return true;

        }

    }

    // Determine wheather the snake head is in the same position as the food.
    snakeAteFood() {

        return ((this.snake.head.x == this.food.x) && (this.snake.head.y == this.food.y));

    }

    // 
    waitForNextInterval() {

        return (this.state.gamePaused || this.state.gameEnded || this.gameOver());

    }

    drawNextFrame() {

        this.clearCanvas();
        this.snake.drawSnake(this.context);
        this.food.drawFood(this.context);

        if (this.snakeAteFood()) {
            
            if (this.intervalTime > this.minInterval) {
                
                this.increaseSpeed(2.5);

            }
            
            this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
            this.score++;
            this.displayCurrentScore();

            setTimeout(() => {

                let intervalCount = 0;

                this.runningScore.style.color = "yellow";
                
                setTimeout(() => {
    
                    this.runningScore.style.color = "#651fff"
    
                }, 100);

                intervalCount++;

                if (intervalCount > 3) {

                    clearInterval(animationInterval)

                }
    
            });

        } else {

            this.snake.pop();

        }

        this.snake.head = this.snake.nextHead;

        this.displayCurrentScore();

    }

    render() {

        if (this.waitForNextInterval()) return; 
        this.drawNextFrame();


        // User input has been processed. Allow new user input.
        this.snake.inputLocked = 0;

    }

    increaseSpeed(ms) {

        if (ms >= this.intervalTime) {

            this.resetTimer();
            throw Error(`Interval time must be less than ${this.intervalTime}ms`);
            
        }

        this.intervalTime -= ms;
        clearInterval(this.interval);
        this.interval = setInterval(this.render, this.intervalTime, this.context, this.canvas);
    }


}

export default Game;