import Food from './Food.js';
import Snake from './Snake.js';

class Game {

    constructor(context, canvas, runningScore, scoreBoard) {

        this.context = context;
        this.canvas = canvas;
        this.runningScore = runningScore;
        this.scoreboard = scoreBoard;

        // Dimensions
        this.blockDimensions = 10;
        this.blockSpanHorizontal = this.canvas.width / this.blockDimensions;
        this.blockSpanVertical = this.canvas.height / this.blockDimensions;
        this.borderOffset = 10;

        // Init Snake
        this.snake = new Snake(this.blockDimensions);

        // Init Food
        this.food = new Food(this.blockDimensions)
        this.food.randomizePosition(this.blockSpanHorizontal, this.blockSpanVertical, this.borderOffset);
        this.score = 4;
        this.highScores = [10, 6, 4];

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
       
       this.context.fillStyle = "#FFF";
       this.context.font = "32px 'press_start_2pregular'";
       this.context.fillText("Snek Game", 100, 220);
       this.context.font = "24px Verdanna";
       this.context.fillText(`Press "Enter" to start`, 145, 300);
    
    }

    displayGameOver() {

        this.context.fillStyle = "#FFF";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Over", 110, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to try again`, 125, 300);
        this.drawCurrentScore();

    }

    displayGamePaused() {

        this.context.fillStyle = "#FFF";
        this.context.font = "32px 'press_start_2pregular'";
        this.context.fillText("Game Paused", 73, 220);
        this.context.font = "24px Verdanna";
        this.context.fillText(`Press "Enter" to resume or 'r' to reset`, 70, 300);
        this.drawCurrentScore();

    }

    resetDisplay() {

        this.clearCanvas();
        this.displayStart();

    }

    endGame() {

        this.clearCanvas();
        this.displayGameOver();
        this.state.gameEnded = 1;
        this.drawHighScores();

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
        this.drawCurrentScore();

    }

    drawCurrentScore() {

        this.context.fillStyle = "#FFF";
        this.context.font = "12px 'press_start_2pregular'";
        this.context.fillText(`Score: ${this.score}`, this.borderOffset, this.canvas.height - this.borderOffset);

        this.runningScore.textContent = this.score;

    }

    drawHighScores() {

        let smallestHighScore = this.highScores[2];

        if (this.score > smallestHighScore) {

            const highScoreIndex = this.highScores.indexOf(this.score);

            if (highScoreIndex === -1) {

                this.highScores.push(this.score);

                this.highScores = this.highScores.sort((a, b) => {

                    return (b - a);

                }).filter((v, i, a) => {

                    return (v > smallestHighScore)

                })

                const scores = this.scoreboard.querySelectorAll('li');
                for (let i = 0; i < scores.length; i++) {

                    scores[i].textContent = `${this.highScores[i]} pts`;

                }
                
                // debugger;
                // setTimeout(() => {
                //     const newHighScoreIndex = this.highScores.indexOf(this.score);
                //     setTimeout(() => {
                //         scores[newHighScoreIndex].style.color = "#0100ca";
                //     }, 1000);
                //     scores[newHighScoreIndex].style.color = "#FFF";
                // }, 1000);
                
            }
        }

    }

    resolvePausedGame(event) {

        if (event.code == 'Enter') {

            // Paused Game. Resume the game.
            this.resumeGame();

        } else if (event.code == 'KeyR') {

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

        this.drawCurrentScore();

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