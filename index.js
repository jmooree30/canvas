const canvas = document.getElementById("myCanvas");
canvas.height = 475;
canvas.width = 700;
const ctx = canvas.getContext("2d");
let playerShip = new Image();
playerShip.src = "assets/player_ship.png";
let stars = new Image();
stars.src = "assets/stars.png";
let bullet = new Image();
bullet.src = "assets/bullet.png";
let bullets = [];

class Player {
  constructor() {
    this.x = canvas.width / 2 - 25;
    this.y = canvas.height / 2 + 175;
    this.imgOneY = -50;
    this.imgTwoY = -625;
  }

  startPosition() {
    let that = this;
    playerShip.onload = function() {
      ctx.drawImage(stars, 0, -50);
      ctx.drawImage(stars, 0, -650);
      ctx.drawImage(playerShip, that.x, that.y, 40, 40);
    };
  }

  draw(plane, operator) {
    let that = this;
    let xy = plane == "x" ? 1 : null;
    let frames = setInterval(function() {
      if (xy) {
        that.x += operator;
        if (that.x > canvas.width - 40) {
          that.x -= 4;
          return;
        }
        if (that.x < 0) {
          that.x += 4;
          return;
        }
      } else {
        that.y += operator;
        if (that.y > canvas.height - 40) {
          that.y -= 4;
          return;
        }
        if (that.y < 0) {
          that.y += 4;
          return;
        }
      }
      document.addEventListener("keyup", function() {
        clearInterval(frames);
      });
    }, 10);
  }

  move(e) {
    if (e.keyCode === 39) {
      this.draw("x", 4);
    }
    if (e.keyCode === 37) {
      this.draw("x", -4);
    }
    if (e.keyCode === 38) {
      this.draw("y", -4);
    }
    if (e.keyCode === 40) {
      this.draw("y", 4);
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x + 12;
    this.y = y;
    this.hit = false;
  }

  update() {
    this.y += -1;
  }

  remove() {
    this.hit = true;
  }
}

let player = new Player();
player.startPosition();

let lastKeyDown = null;
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 32 && lastKeyDown != e.keyCode) {
    let newBullet = new Bullet(player.x, player.y);
    bullets.push(newBullet);
    const pew = new Audio("assets/laser.mp3");
    pew.play();
  }
  if (lastKeyDown != e.keyCode) {
    player.move(e);
    lastKeyDown = e.keyCode;
  }
  document.addEventListener("keyup", function() {
    lastKeyDown = null;
  });
});

setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(stars, 0, player.imgOneY);
  ctx.drawImage(stars, 0, player.imgTwoY);
  ctx.drawImage(playerShip, player.x, player.y, 40, 40);
  player.imgOneY += 1;
  player.imgTwoY += 1;
  if (player.imgOneY == 550) player.imgOneY = -625;
  if (player.imgTwoY == 550) player.imgTwoY = -625;
  bullets.forEach(e => {
    ctx.drawImage(bullet, e.x, e.y);
    e.update();
  });
}, 5);
const audio = new Audio("assets/sor.mp3");
document.addEventListener("click", function() {
  audio.play();
});
