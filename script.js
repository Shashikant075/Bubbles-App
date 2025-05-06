const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("timeLeft");

let circle = {
  x: 80,
  y: canvas.height / 2,
  radius: 50,
  color: randomColor()
};

let arrow = {
  x: canvas.width - 100,
  y: canvas.height / 2,
  speed: 4,
  isMoving: false,
  hasHit: false,
  color: "black",
  opacity: 1
};

let score = 0;
let timer = 30;
let countdownStarted = false;
let themeDark = false;

function randomColor() {
  const r = Math.floor(Math.random() * 200) + 30;
  const g = Math.floor(Math.random() * 200) + 30;
  const b = Math.floor(Math.random() * 200) + 30;
  return `rgb(${r}, ${g}, ${b})`;
}

function drawCircle() {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = circle.color;
  ctx.fill();
}

function drawArrow() {
  ctx.save();
  ctx.globalAlpha = arrow.opacity;
  ctx.fillStyle = arrow.color;
  ctx.beginPath();
  ctx.moveTo(arrow.x, arrow.y);
  ctx.lineTo(arrow.x + 30, arrow.y - 10);
  ctx.lineTo(arrow.x + 30, arrow.y - 5);
  ctx.lineTo(arrow.x + 50, arrow.y - 5);
  ctx.lineTo(arrow.x + 50, arrow.y + 5);
  ctx.lineTo(arrow.x + 30, arrow.y + 5);
  ctx.lineTo(arrow.x + 30, arrow.y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle();
  drawArrow();
}

function animateArrow() {
  if (arrow.isMoving && !arrow.hasHit) {
    arrow.x -= arrow.speed;

    const dx = arrow.x - circle.x;
    if (dx <= circle.radius) {
      arrow.hasHit = true;
      arrow.isMoving = false;
      circle.color = randomColor();
      arrow.color = randomColor();
      score += 1;
      scoreEl.innerText = score;
      fadeArrow();
    }

    updateCanvas();

    if (!arrow.hasHit) {
      requestAnimationFrame(animateArrow);
    }
  }
}

function fadeArrow() {
  let fadeInterval = setInterval(() => {
    arrow.opacity -= 0.05;
    if (arrow.opacity <= 0) {
      clearInterval(fadeInterval);
    }
    updateCanvas();
  }, 30);
}

function resetArrow() {
  arrow.x = canvas.width - 100;
  arrow.isMoving = false;
  arrow.hasHit = false;
  arrow.opacity = 1;
  arrow.color = "black";
}

document.getElementById("hit").addEventListener("click", () => {
  if (!arrow.isMoving && !arrow.hasHit) {
    arrow.isMoving = true;
    animateArrow();

    if (!countdownStarted) {
      startCountdown();
      countdownStarted = true;
    }
  }
});

document.getElementById("reset").addEventListener("click", () => {
  resetArrow();
  circle.color = randomColor();
  updateCanvas();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeDark = !themeDark;
  updateCanvas();
});

function startCountdown() {
  let interval = setInterval(() => {
    timer -= 1;
    timeEl.innerText = timer;

    if (timer <= 0) {
      clearInterval(interval);
      document.getElementById("hit").disabled = true;
    }
  }, 1000);
}

// Initial render
updateCanvas();
