const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

const SIZE = 420;
const GRID = 21;
const CELLS = SIZE / GRID;

let snake, dir, nextDir, food, score, highScore, running, animId, speed, lastTick;

function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 }
  ];
  dir      = { x: 1, y: 0 };
  nextDir  = { x: 1, y: 0 };
  score    = 0;
  speed    = 140;
  lastTick = 0;
  highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');

  placeFood();
  updateHUD();

  document.getElementById('start-overlay').style.display   = 'none';
  document.getElementById('gameover-overlay').style.display = 'none';

  running = true;
  if (animId) cancelAnimationFrame(animId);
  animId = requestAnimationFrame(loop);
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * CELLS),
      y: Math.floor(Math.random() * CELLS)
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function update() {
  dir = { ...nextDir };

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= CELLS || head.y < 0 || head.y >= CELLS) {
    endGame(); return;
  }
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame(); return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    speed  = Math.max(55, speed - 2);
    updateHUD();
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  // Background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle grid dots
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let x = 0; x < CELLS; x++) {
    for (let y = 0; y < CELLS; y++) {
      const cx = x * GRID + GRID / 2;
      const cy = y * GRID + GRID / 2;
      ctx.fillRect(cx - 1, cy - 1, 2, 2);
    }
  }

  // Food (red circle with glow)
  const fx = food.x * GRID + GRID / 2;
  const fy = food.y * GRID + GRID / 2;
  ctx.shadowColor   = '#ff4444';
  ctx.shadowBlur    = 10;
  ctx.fillStyle     = '#ff4444';
  ctx.beginPath();
  ctx.arc(fx, fy, GRID / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur    = 0;

  // Snake body (rounded rects with gradient)
  snake.forEach((seg, i) => {
    const alpha = 1 - (i / snake.length) * 0.5;
    ctx.fillStyle = i === 0 ? '#00e676' : `rgba(0, 180, 80, ${alpha})`;

    if (i === 0) {
      ctx.shadowColor = '#00c853';
      ctx.shadowBlur  = 8;
    } else {
      ctx.shadowBlur  = 0;
    }

    const x = seg.x * GRID + 2;
    const y = seg.y * GRID + 2;
    const w = GRID - 4;
    const h = GRID - 4;
    const r = Math.min(5, w / 3);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

function updateHUD() {
  document.getElementById('score').textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
  }
  document.getElementById('high-score').textContent = highScore;
}

function loop(timestamp) {
  if (!running) return;

  if (timestamp - lastTick >= speed) {
    update();
    lastTick = timestamp;
  }

  draw();
  animId = requestAnimationFrame(loop);
}

function endGame() {
  running = false;

  let scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
  scores.push({ score, date: new Date().toLocaleDateString('da-DK') });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('snakeScores', JSON.stringify(scores.slice(0, 10)));

  document.getElementById('final-score').textContent     = score;
  document.getElementById('gameover-overlay').style.display = 'flex';
}

// ── KEYBOARD CONTROLS ──
document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (dir.y !== 1) nextDir = { x: 0, y: -1 };
      e.preventDefault(); break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (dir.y !== -1) nextDir = { x: 0, y: 1 };
      e.preventDefault(); break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (dir.x !== 1) nextDir = { x: -1, y: 0 };
      e.preventDefault(); break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (dir.x !== -1) nextDir = { x: 1, y: 0 };
      e.preventDefault(); break;
  }
});

// ── TOUCH / MOBILE D-PAD ──
function mobileDir(dx, dy) {
  if (dx === 0 && dir.y !== dy * -1) nextDir = { x: 0, y: dy };
  if (dy === 0 && dir.x !== dx * -1) nextDir = { x: dx, y: 0 };
}

// Initial static draw before game starts
(function drawIdle() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = 'rgba(0,200,83,0.15)';
  for (let x = 0; x < CELLS; x++) {
    for (let y = 0; y < CELLS; y++) {
      ctx.fillRect(x * GRID, y * GRID, 1, GRID);
      ctx.fillRect(x * GRID, y * GRID, GRID, 1);
    }
  }
})();
