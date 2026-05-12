const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

let score = 0;

// 🧩 Shapes (som i rigtig Tetris)
const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]]  // L
];

const COLORS = ["cyan","yellow","purple","green","red","blue","orange"];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// 🎲 Ny random brik
function newPiece() {
  const index = Math.floor(Math.random() * SHAPES.length);
  return {
    x: 4,
    y: 0,
    shape: SHAPES[index],
    color: COLORS[index]
  };
}

let piece = newPiece();

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // board
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) drawBlock(x, y, cell);
    });
  });

  // piece
  piece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        drawBlock(piece.x + c, piece.y + r, piece.color);
      }
    });
  });
}

function rotate(matrix) {
  return matrix[0].map((_, i) =>
    matrix.map(row => row[i]).reverse()
  );
}

function collision(dx, dy) {
  return piece.shape.some((row, r) => {
    return row.some((val, c) => {
      if (!val) return false;
      let newX = piece.x + c + dx;
      let newY = piece.y + r + dy;

      return newX < 0 || newX >= COLS || newY >= ROWS || board[newY]?.[newX];
    });
  });
}

function merge() {
  piece.shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        board[piece.y + r][piece.x + c] = piece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;

  board = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++;
      return false; // fjern række
    }
    return true;
  });

  // tilføj tomme rækker øverst
  while (board.length < ROWS) {
    board.unshift(Array(COLS).fill(0));
  }

  // score system
  if (linesCleared > 0) {
    score += [0, 100, 300, 500, 800][linesCleared];
    const el = document.getElementById('scoreDisplay');
    if (el) el.textContent = score;
  }
}

function update() {
  if (!collision(0, 1)) {
    piece.y++;
  } else {
    merge();
clearLines(); 
piece = newPiece();
  }
}

function loop() {
  update();
  draw();
  setTimeout(loop, 500);
}

// 🎮 Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && !collision(-1, 0)) {
    piece.x--;
  }

  if (e.key === "ArrowRight" && !collision(1, 0)) {
    piece.x++;
  }

  if (e.key === "ArrowDown" && !collision(0, 1)) {
    piece.y++;
  }

  // 🔄 ROTATION (pil op)
  if (e.key === "ArrowUp") {
    const rotated = rotate(piece.shape);

    // tjek om rotation er mulig
    if (!collision(0, 0, rotated)) {
      piece.shape = rotated;
    }
  }

  // SPACE drop
  if (e.code === "Space") {
    while (!collision(0, 1)) {
      piece.y++;
    }
  }
});

loop();
