const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 90;
const paddleMargin = 20;
const ballRadius = 9;
const paddleSpeed = 6;
const aiSpeed = 4;

let leftPaddleY = canvas.height/2 - paddleHeight/2;
let rightPaddleY = canvas.height/2 - paddleHeight/2;

let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 5;
let ballSpeedY = 3;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#444";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Net
    drawNet();

    // Left paddle
    drawRect(paddleMargin, leftPaddleY, paddleWidth, paddleHeight, "#fff");

    // Right paddle
    drawRect(canvas.width - paddleWidth - paddleMargin, rightPaddleY, paddleWidth, paddleHeight, "#fff");

    // Ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX - ballRadius <= paddleMargin + paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some spin based on where the ball hits the paddle
        let collidePoint = ballY - (leftPaddleY + paddleHeight/2);
        collidePoint /= paddleHeight/2;
        let angleRad = collidePoint * (Math.PI/4);
        let direction = 1;
        ballSpeedX = direction * 5 * Math.cos(angleRad);
        ballSpeedY = 5 * Math.sin(angleRad);
    }

    // Right paddle collision (AI)
    if (
        ballX + ballRadius >= canvas.width - paddleMargin - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some spin based on where the ball hits the paddle
        let collidePoint = ballY - (rightPaddleY + paddleHeight/2);
        collidePoint /= paddleHeight/2;
        let angleRad = collidePoint * (Math.PI/4);
        let direction = -1;
        ballSpeedX = direction * 5 * Math.cos(angleRad);
        ballSpeedY = 5 * Math.sin(angleRad);
    }

    // Score check (ball out of bounds)
    if (ballX - ballRadius <= 0 || ballX + ballRadius >= canvas.width) {
        resetBall();
    }

    // AI paddle movement (tracks ball with a simple delay)
    if (ballY > rightPaddleY + paddleHeight/2) {
        rightPaddleY += aiSpeed;
    } else if (ballY < rightPaddleY + paddleHeight/2) {
        rightPaddleY -= aiSpeed;
    }
    // Clamp AI paddle
    rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Player controls: mouse
canvas.addEventListener('mousemove', function(e) {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight/2;
    // Clamp
    leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
});

// Start the game
gameLoop();