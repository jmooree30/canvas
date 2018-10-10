const canvas = document.getElementById("myCanvas");
canvas.height = 475;
canvas.width = 1000;
const ctx = canvas.getContext("2d");
let playerShip = new Image();
playerShip.src = "assets/player_ship.png";
let stars = new Image();
stars.src = "assets/stars.png";
let bullet = new Image();
bullet.src = "assets/bullet.png";
let enemy = new Image();
enemy.src = "assets/enemy_2.png";
let exp = new Image();
exp.src = "assets/exp.png";
let bullets = [];
let enemies = [];
let score = 0;
let time = 120;
let life = ["+ ", "+ ", "+"];
let godMode = false;

class Enemy {
  constructor() {
    this.x = Math.round(Math.random() * 1000);
    this.y = -70;
  }

  update() {
    let that = this;
    this.y += 2;
    enemies.forEach((e, index) => {
      if (
        e.y > player.y &&
        e.y < player.y + 20 &&
        e.x < player.x + 27 &&
        e.x > player.x - 17
      ) {
        ctx.drawImage(
          exp,
          64,
          64,
          64,
          64,
          player.x - 10,
          player.y - 10,
          75,
          75
        );
        const boom = new Audio("assets/boom.mp3");
        boom.play();
        boom.volume = 0.05;
        if (godMode == false) {
          life.pop();
          godMode = true;
          let twoSeconds = setTimeout(function() {
            godMode = false;
          }, 100);
        }
      }
      if (e.y > 500) {
        enemies.splice(index, 1);
      }
    });
    bullets.forEach((e, index) => {
      if (
        e.y < that.y + 10 &&
        e.y > that.y - 10 &&
        (e.x < that.x + 27 && e.x > that.x - 17)
      ) {
        bullets.splice(index, 1);
        enemies.splice(enemies.indexOf(that), 1);
        score += 50;
      }
      if (e.y < 0) {
        bullets.splice(index, 1);
      }
    });
  }
}

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
  }

  update() {
    this.y += -1;
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

function startGame() {
  let pushEnemies = setInterval(function() {
    let en = new Enemy();
    enemies.push(en);
  }, 500);

  let countDown = setInterval(function() {
    time -= 1;
    if (time <= -1) {
      clearInterval(pushEnemies);
      clearInterval(game);
      clearInterval(countDown);
      button.style.display = "inline";
      button.innerHTML = "Play Again?";
      audio.pause();
      audio.currentTime = 0;
      time = 120;
      score = 0;
      enemies = [];
    }
  }, 1000);
  const audio = new Audio("assets/sor.mp3");
  audio.play();
  let game = setInterval(function() {
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

    enemies.forEach(e => {
      if (life.length === 0) {
        clearInterval(pushEnemies);
        clearInterval(game);
        clearInterval(countDown);
        button.style.display = "inline";
        button.innerHTML = "Play Again?";
        audio.pause();
        audio.currentTime = 0;
        time = 120;
        score = 0;
        life = ["+ ", "+ ", "+"];
        enemies = [];
        bullet = [];
        return;
      }
      ctx.drawImage(enemy, e.x, e.y, 40, 40);
      e.update();
    });
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`score: ${score}`, 10, 25);
    ctx.fillText(`time: ${time}`, 10, 50);
    ctx.fillText(`lives: ${life.join("")}`, 880, 25);
  }, 5);
}

let button = document.querySelector("button");
button.addEventListener("click", function() {
  startGame();
  button.style.display = "none";
});
