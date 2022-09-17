// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Boolean states for extra effects
// Collision causes the balls to bounce away from the object
let collision = false;
// Dominant sets the larger ball's color to the smaller. 
let dominant = false;
//When true teleports the ball to the opposite edge of the screen
let tele = false;
// Getting the collision button to work.
const colbtn = document.getElementById("collisionBut");
colbtn.addEventListener('click', () => {
  collision = !collision;
  if(collision) {
    colbtn.value = "Collision: on";
  }
  else {
    colbtn.value = 'Collision: off';
  }
} );

//Getting the dominant button to work. When click sets boolean to opposite and changes button text
const domBtn = document.getElementById('dominatBut');
domBtn.addEventListener('click', () => {
  dominant = !dominant;
  if(dominant){
    domBtn.value = 'Dominant: on';
  }
  else {
    domBtn.value = 'Dominant: off';
  }
} );

const teleBtn = document.getElementById('teleport');
teleBtn.addEventListener('click', () => {
  tele = !tele;
  if(tele){
    teleBtn.value = 'Teleport: on';
  }
  else {
    teleBtn.value = 'Teleport: off';
  }
} );


// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    //The balls kept getting stuck on the right hand edge. this.size * 1.2 keeps the ball well away fro the edge.
    if(tele){
      if ((this.x + this.size) >= width) {
        this.x = (0 + (this.size * 1.3));
      }
      if ((this.x - this.size) <= 0) {
        this.x = (width - (this.size * 1.2));
      }
      if ((this.y + this.size) >= height) {
        this.y = (0 + (this.size * 1.2));
      }
      if ((this.y + this.size) <= 0) {
        this.y = (height - (this.size * 1.2));
      }

    } else {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }
      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }
      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }
      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        //If the two balls are touching
        if (distance < this.size + ball.size) {
          if(dominant){
            if(this.size >= ball.size){
              ball.color = this.color;
            }
            else
                this.color = ball.color;
          }
          else {
          ball.color = this.color = randomRGB();
          }
          //If collision is on
          if(collision){
            if(dx > dy)
              this.velX = -(this.velX);
            else
              this.velY = -(this.velY);
          }
        }
      }
    }
  }
}  // End of Ball

const balls = [];

while (balls.length < 25) {
  const size = random(10,20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();