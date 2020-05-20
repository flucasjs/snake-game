
window.addEventListener("load", (event) => {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let snakeWidth = 10;
    let snakeHeight = 10;

    let score = 4;

    let direction = "right";

    let game = false;

    // Visual element used to toggle theme settings.
    const TOGGLEON = "fa-toggle-on";
    const TOGGLEOFF = "fa-toggle-off";

    document.addEventListener("keydown", getDirection);

    function getDirection(event) {
        if ((event.code == "ArrowUp") && (direction != "down")) {
            direction = "up";
        } else if ((event.code == "ArrowDown") && (direction != "up")) {
            direction = "down";
        } else if ((event.code == "ArrowLeft") && (direction != "right")) {
            direction = "left";
        } else if ((event.code == "ArrowRight") && (direction != "left")) {
            direction = "right";
        } else if ((event.code == "Enter") && (!game)){
            game = startGame();
        } else if (event.code == "Enter") {
            location.reload();
        }
    }

    function drawSnake(x, y) {
        context.fillStyle = "white";
        context.fillRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);

        context.strokeStyle = "aqua";
        context.strokeRect(x * snakeWidth, y * snakeHeight, snakeWidth, snakeHeight);
    }

    let len = 4;
    let snake = [];

    for (let i = len - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0});
    }

    let food = {
        x: Math.floor(Math.random() * ((canvasWidth / snakeWidth) - 1) + 1),
        y: Math.floor(Math.random() * ((canvasHeight / snakeHeight) - 1) + 1),
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
        if (snakeX < 0 || snakeY < 0 || snakeX >= canvasWidth / snakeWidth ||  snakeY >= canvasHeight / snakeHeight || checkCollision(snakeX, snakeY, snake)) {

            clearInterval(game);
            displayGameOver();

        }

        if ((snakeX == food.x) && (snakeY == food.y)) {

            food = {
                x: Math.floor(Math.random() * ((canvasWidth / snakeWidth) - 1) + 1),
                y: Math.round(Math.random() * ((canvasHeight / snakeHeight) - 1) + 1),
            }
            
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
    
    function startGame() {

        return setInterval(draw, 40);
        
    }


    displayStart();
    

    theme.addEventListener("click", (event) => {

        const element = event.target;
        
        element.classList.toggle(TOGGLEON);
        element.classList.toggle(TOGGLEOFF);

        if (element.classList.contains(TOGGLEON)) {

            document.body.style.background = "rgba(0, 0, 0, 0.75)";
            
        } else {

            document.body.style.background = "whitesmoke";

        }

    });

});