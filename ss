const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,0],[1,1,1]]
];

let piece = {
  shape: SHAPES[0],
  x: 3,
  y: 0
};

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // board
  board.forEach((row,y)=>{
    row.forEach((cell,x)=>{
      if(cell){
        ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
      }
    });
  });

  // piece
  piece.shape.forEach((row,r)=>{
    row.forEach((val,c)=>{
      if(val){
        ctx.fillRect((piece.x+c)*SIZE,(piece.y+r)*SIZE,SIZE,SIZE);
      }
    });
  });
}

function update(){
  piece.y++;

  if(piece.y > ROWS-2){
    piece.y = 0;
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();