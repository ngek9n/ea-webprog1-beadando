class Shape {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;

    this.element = document.createElement('div');
    this.element.classList.add('ball');
    this.element.style.width = this.size + 'px';
    this.element.style.height = this.size + 'px';
    this.element.style.backgroundColor = this.color;

    document.body.appendChild(this.element);
    this.draw();
  }

  draw() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

class Ball extends Shape {
  constructor(x, y, size, color, dx, dy) {
    super(x, y, size, color);
    this.dx = dx;
    this.dy = dy;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x <= 0 || this.x + this.size >= window.innerWidth) {
      this.dx *= -1;
    }

    if (this.y <= 0 || this.y + this.size >= window.innerHeight) {
      this.dy *= -1;
    }

    this.draw();
  }
}

const balls = [];

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function randomSpeed() {
  let speed = Math.floor(Math.random() * 5) + 2;
  return Math.random() < 0.5 ? -speed : speed;
}

function createBall(x, y) {
  const size = Math.floor(Math.random() * 50) + 30;
  const ball = new Ball(
    x,
    y,
    size,
    randomColor(),
    randomSpeed(),
    randomSpeed(),
  );
  balls.push(ball);
}

for (let i = 0; i < 5; i++) {
  createBall(
    Math.random() * (window.innerWidth - 60),
    Math.random() * (window.innerHeight - 60),
  );
}

function animate() {
  balls.forEach((ball) => ball.move());
  requestAnimationFrame(animate);
}

animate();

document.addEventListener('click', function (e) {
  createBall(e.clientX, e.clientY);
});
