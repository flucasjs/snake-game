window.addEventListener("load", () => {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let snakeWidth = 10;
    let snakeHeight = 10;

    let score = 4;

    let direction = "right";

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

            location.reload();

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
    
    setInterval(draw, 60);

})