// import gsap from "./gsap-public (1)/gsap-public/src/gsap-core"

const canvas = document.querySelector("canvas");
let scoreBoard = document.querySelector(".score");
let start = document.querySelector(".restart");
let gameover = document.querySelector(".pop");
let gameOverBtn = document.querySelector(".over");
let startover = document.querySelector(".start");
let startGAmebtn = document.querySelector(".startgame");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  // init()
});

class JohnSnow {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, 30, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class LawnClawSword {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}
class ArmyOfTheDead {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

class ParticleExplosion {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.friction = 0.99;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.02;
    this.draw();
  }
}

let enemies = [],
  player,
  x,
  y,
  particles = [],
  score = 0,
  ammo = [],
  myScore = [],
  startgame = false;

function initThePlayer() {
  let radius = 60;
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let color = "white";

  player = new JohnSnow(x, y, radius, color);
}

function createTheEnemy() {
  let radius = Math.random() * (30 - 8) + 8;

  if (Math.random() > 0.5) {
    x = Math.random() > 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  }
  if (Math.random() > 0.5) {
    y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius;
    x = Math.random() * canvas.width;
  }

  let color = `hsl(${Math.random() * 360}, 50%, 50%)`;

  const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
  let velocity = { x: Math.cos(angle), y: Math.sin(angle) };
  enemies.push(new ArmyOfTheDead(x, y, radius, color, velocity));
}

// console.log(gsap)
function restartOrEndAfterGameover() {
  addEventListener("click", (e) => {
    if (e.target.className == "yes") {
      if (startgame == false) {
        startgame = true;
        start.style.display = "none";
        gameover.style.display = "none";
        restart();
      }
    } else if (e.target.className == "no") {
      startgame = false;

      if (startgame == false) {
        start.style.display = "none";
        startGAmebtn.style.display = "none";
        gameover.style.display = "none";
        startover.style.display = "flex";
      }
    }
  });
}
restartOrEndAfterGameover();

function calculatePlayerDistanceFromEnemies() {
  // Invoked in amimate

  enemies.forEach((enemy) => {
    enemy.update();
    let playerDistanceFromEnemies = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    );

    if (playerDistanceFromEnemies + enemy.radius < player.radius) {
      let finalscore = document.querySelector(".finalscore");
      let gameOverBtn = document.querySelector(".over");
      gameover.style.display = "flex";
      cancelAnimationFrame(animationframe); // how to pause the game or stop the animation frame
      finalscore.textContent = score;
      myScore.push(score);
      startgame = false;
    }

    bulletHitAndExplosion(enemy);
  });
}

function bulletHitAndExplosion(enemy) {
  // invoked in calculate player distance form enemies
  ammo.forEach((bullet) => {
    let bulletDistanceFromEnemies = Math.hypot(
      bullet.x - enemy.x,
      bullet.y - enemy.y
    );

    if (bulletDistanceFromEnemies - bullet.radius < enemy.radius) {
      for (let i = 0; i < enemy.radius * 2; i++) {
        let x = bullet.x;
        let y = bullet.y;
        let radius = Math.random() * 3;
        let color = enemy.color;
        let velocity = {
          x: (Math.random() - 0.5) * (Math.random() * 8),
          y: (Math.random() - 0.5) * (Math.random() * 8),
        };

        let explosion = new ParticleExplosion(x, y, radius, color, velocity);
        particles.push(explosion);
      }

      //shrink enemy
      if (enemy.radius - 5 > 10) {
        gsap.to(enemy, {
          radius: enemy.radius - 10,
        });
        score += 10;
      } else {
        // if(enemy.radius < = 5){
        score += 100;
        let index = enemies.indexOf(enemy);
        enemies.splice(index, 1);
      }
      scoreBoard.textContent = score;
    }
  });
}

function removeParticles() {
  particles.forEach((particle) => {
    if (particle.alpha <= 0) {
      let index = particles.indexOf(particle);
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}

let animationframe;

function animate() {
  animationframe = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  removeParticles();
  calculatePlayerDistanceFromEnemies();
  ammo.forEach((bullet) => {
    bullet.update();
    ClearMissedEnemiesAndBullets();
  });
}
function shootOnClick() {
  addEventListener("click", (e) => {
    let radius = 3;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let color = "white";
    const angle = Math.atan2(e.clientY - y, e.clientX - x);
    let velocity = {
      x: Math.cos(angle) * 8,
      y: Math.sin(angle) * 8,
    };
    let bullet = new LawnClawSword(x, y, radius, color, velocity);
    ammo.push(bullet);
  });
}

function ClearMissedEnemiesAndBullets() {
  ammo.forEach((bullet) => {
    if (
      bullet.x + bullet.radius > canvas.width ||
      bullet.x - bullet.radius < 0 ||
      bullet.y + bullet.radius > canvas.height ||
      bullet.y - bullet.radius < 0
    ) {
      let bulletIndex = ammo.indexOf(bullet);
      ammo.splice(bulletIndex, 1);
      // console.log(ammo)
    }
  });
}

function restart() {
  if (startgame == false) {
    startgame = true;
    setInterval(createTheEnemy, 1000);
  } else {
    setInterval(createTheEnemy, 1000);
  }
  enemies = [];
  particles = [];
  score = 0;
  ammo = [];
  myScore = [];
  initThePlayer();
  requestAnimationFrame(animate);
  ClearMissedEnemiesAndBullets();
}

function reset() {
  if (startgame == false) {
    addEventListener("load", () => {
      startover.style.display = "flex";
    });
  }
}

startGAmebtn.addEventListener("click", () => {
  startGAmebtn.style.display = "none";
  restart();
});

gameOverBtn.addEventListener("click", () => {
  start.style.display = "flex";
});
shootOnClick();
reset();
