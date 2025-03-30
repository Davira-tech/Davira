const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamically adjust canvas size based on window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // Resize canvas initially

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.1, 
    lift: -4
};

// This game is created by Divyanshu Verma.
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;
let score = 0;
let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
let gameOver = false;

let gameLoopId;

const gameOverModal = document.getElementById('gameOverModal');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');

let pipeSpacing = 150;

function drawBird() {
    bird.velocity += bird.gravity;  // Apply gravity
    bird.y += bird.velocity;  // Update position

    // Check for collision with top and bottom of the canvas
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    ctx.fillStyle = '#ff0';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    if (frame % pipeSpacing === 0 && !gameOver) { 
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, topHeight: pipeHeight, bottomHeight: pipeHeight + pipeGap });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Top Pipe
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Bottom Pipe
        ctx.fillRect(pipe.x, pipe.bottomHeight, pipeWidth, canvas.height - pipe.bottomHeight);

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }

        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomHeight)) {
            gameOverLogic();
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('High Score: ' + highestScore, 10, 60); // Display highest score
}

function gameOverLogic() {
    gameOver = true;
    scoreText.textContent = 'Your Score: ' + score;

    // Check if the current score is the highest score
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore); // Save new highest score
    }

    gameOverModal.style.display = 'block';

    cancelAnimationFrame(gameLoopId);
}

function restartGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameOverModal.style.display = 'none';
    gameLoop();
}

// Handle touch event (mobile support)
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();  // Prevent default touch behavior like scrolling
    if (!gameOver) {
        bird.velocity = bird.lift;  // Make the bird jump
    } else {
        restartGame();  // Restart the game when tapped after game over
    }
});

// Handle keyboard event (desktop support)
document.addEventListener('keydown', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;  // Make the bird jump
    }
});

restartBtn.addEventListener('click', restartGame);

let frame = 0;
function gameLoop() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    drawScore();

    if (!gameOver) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
gameLoop();
