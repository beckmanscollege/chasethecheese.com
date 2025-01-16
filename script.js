const game = document.getElementById("game");
const mouse = document.getElementById("mouse");
const cat = document.getElementById("cat");
const cheese = document.getElementById("cheese");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const startScreen = document.getElementById("start-screen");
const finalScoreDisplay = document.getElementById("final-score");

const bgMusic = document.getElementById("bg-music");
const cheeseSound = document.getElementById("cheese-sound");
const startSound = document.getElementById("start-sound");
const loseSound = document.getElementById("lose-sound");

let mouseX = 400, mouseY = 300; // Initial mouse position
let catX = 100, catY = 100; // Initial cat position
let lastMouseX = mouseX; // Previous mouse X position
let lastCatX = catX; // Previous cat X position
let score = 0;
let gameRunning = false; // Initially game is not running

// Function to show the start screen
function showStartScreen() {
  startScreen.style.display = "flex"; // Show the start screen
  game.style.display = "none"; // Hide the game area
  gameOverScreen.style.display = "none"; // Hide the game over screen
}

// Function to start the game
function startGame() {
  startScreen.style.display = "none"; // Hide start screen
  game.style.display = "block"; // Show game area
  gameOverScreen.style.display = "none"; // Hide game over screen
  gameRunning = true; // Start the game
  score = 0; // Reset the score
  scoreDisplay.textContent = `CHEESE: ${score}`; // Update score display
  mouseX = 400; // Reset mouse position
  mouseY = 300; // Reset mouse position
  catX = 100; // Reset cat position
  catY = 100; // Reset cat position
  bgMusic.play(); // Start background music
  spawnCheese(); // Spawn first cheese
  update(); // Start the game loop
}

// Play background music and start sound
function playStartSound() {
  startSound.volume = 1.0; // Set volume to maximum (1.0)
  startSound.play().catch((error) => {
    console.error('Error playing start sound:', error); // Catch any error in playing the sound
  });
  bgMusic.play();
}


// Track mouse movement
game.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  const rect = game.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  // Position the mouse GIF
  mouse.style.left = `${mouseX}px`;
  mouse.style.top = `${mouseY}px`;
});

// Game loop
function update() {
  if (!gameRunning) return;

  // Move mouse
  mouse.style.left = `${mouseX - 25}px`;
  mouse.style.top = `${mouseY - 25}px`;

  // Flip mouse based on movement direction
  if (mouseX > lastMouseX) {
    mouse.style.transform = "scaleX(-1)"; // Facing right
  } else if (mouseX < lastMouseX) {
    mouse.style.transform = "scaleX(1)"; // Facing left
  }
  lastMouseX = mouseX;

  // Move cat toward the mouse
  const catSpeed = 6;
  const dx = mouseX - catX;
  const dy = mouseY - catY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  catX += (dx / distance) * catSpeed;
  catY += (dy / distance) * catSpeed;
  cat.style.left = `${catX - 30}px`;
  cat.style.top = `${catY - 30}px`;

  // Flip cat based on movement direction
  if (catX > lastCatX) {
    cat.style.transform = "scaleX(1)"; // Facing right
  } else if (catX < lastCatX) {
    cat.style.transform = "scaleX(-1)"; // Facing left
  }
  lastCatX = catX;

  // Check collision between cat and mouse
  if (distance < 40) {
    endGame();
  }

  // Check collision between mouse and cheese
  const cheeseX = parseInt(cheese.style.left);
  const cheeseY = parseInt(cheese.style.top);
  if (
    mouseX > cheeseX &&
    mouseX < cheeseX + 100 &&
    mouseY > cheeseY &&
    mouseY < cheeseY + 100
  ) {
    collectCheese();
  }

  requestAnimationFrame(update);
}

// Spawn cheese at random position
function spawnCheese() {
  const x = Math.random() * (game.clientWidth - 50);
  const y = Math.random() * (game.clientHeight - 50);
  cheese.style.left = `${x}px`;
  cheese.style.top = `${y}px`;
  cheese.style.display = "block";
}

// Collect cheese
function collectCheese() {
  score += 100;
  scoreDisplay.textContent = `CHEESE: ${score}`;
  cheeseSound.play(); // Play cheese sound
  spawnCheese();
}

// End game
function endGame() {
  gameRunning = false;
  bgMusic.pause();
  loseSound.play(); // Play game over sound
  game.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScoreDisplay.textContent = score;
}

// Restart game
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameRunning) {
      endGame();
    } else {
      showStartScreen(); // Show start screen after game over
    }
  }
});

// Start the game when pressing space from the start screen
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameRunning) {
    startGame(); // Start the game
  }
});

// Start the game when the screen is touched (on touchscreen)
document.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch action (like scrolling)
  if (!gameRunning) {
    startGame(); // Start the game
  }
});



// Show the start screen initially
showStartScreen();

bgMusic.playbackRate = 2.0;



