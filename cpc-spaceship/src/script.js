var keys = [];
document.addEventListener("keydown", function(e) {
  keys[e.which] = true;
});

document.addEventListener("keyup", function(e) {
  keys[e.which] = false;
});

window.addEventListener("resize", function(e) {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

var allBullets = [];
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;
var w = canvas.width;
var h = canvas.height;
var x = w / 2,
  y = h / 2;
var thrust = 1.3;
var friction = 0.98;
var newBullet = {
  x: w / 2,
  y: h / 2,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  r: 0
};
var go = 1;
var Ship = function(x, y, ax, ay, vx, vy, r) {
  this.x = x;
  this.y = y;
  this.ax = ax;
  this.ay = ay;
  this.vx = vx;
  this.vy = vy;
  this.r = r;
  this.radius = 300;
};

Ship.prototype.update = function() {
  this.ax *= thrust;
  this.ay *= thrust;
  this.vx += this.ax;
  this.vy += this.ay;
  this.vx *= friction;
  this.vy *= friction;
  this.x += this.vx;
  this.y += this.vy;
  this.r = this.r;

  this.move();
};

Ship.prototype.move = function() {
  if (keys[37]) this.r -= 0.1;
  if (keys[39]) this.r += 0.1;

  if (keys[38]) {
    this.ax = Math.cos(this.r) * 0.75;
    this.ay = Math.sin(this.r) * 0.75;
  } else if (keys[40]) {
    this.ax = Math.cos(this.r) * -0.75;
    this.ay = Math.sin(this.r) * -0.75;
  } else {
    this.ax = this.ay = 0;
  }

  if (keys[32]) {
    fireGun();
  }

  this.draw();
};

Ship.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.r);
  ctx.scale(0.2 + scaling(), 0.2 + scaling());
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.fillStyle = "gray";
  ctx.strokeStyle = "white";
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 100;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.lineTo(-500, 0);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineWidth = 25;
  ctx.strokeStyle = "darkgray";
  ctx.moveTo(-470, 50);
  ctx.lineTo(-700, 200);
  ctx.moveTo(-470, -50);
  ctx.lineTo(-700, -200);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 60;
  ctx.moveTo(-900, 200);
  ctx.lineTo(-500, 200);
  ctx.moveTo(-900, -200);
  ctx.lineTo(-500, -200);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineCap = "square";
  ctx.lineWidth = 45;
  ctx.strokeStyle = "rgba(200,150,10,.2)";
  ctx.moveTo(-500, -20);
  ctx.lineTo(thrusting(), -100);
  ctx.moveTo(-500, 20);
  ctx.lineTo(thrusting(), 100);
  ctx.moveTo(-500, -10);
  ctx.lineTo(thrusting(), -70);
  ctx.moveTo(-500, 10);
  ctx.lineTo(thrusting(), 70);
  ctx.moveTo(-500, 0);
  ctx.lineTo(thrusting() - 15 * 2, -20);
  ctx.moveTo(-500, 0);
  ctx.lineTo(thrusting() - 15 * 2, 20);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

var ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  ax: 0,
  ay: 0,
  r: 0
};

ship = new Ship(ship.x, ship.y, ship.ax, ship.ay, ship.vx, ship.vy, ship.r);

function anim() {
  requestAnimationFrame(anim);

  drawBackground();
  ship.update();
  checkBounds(ship);
  for (let i in allBullets) {
    allBullets[i].update();
  }
}
anim();

function drawBackground() {
  var linGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);

  linGrad.addColorStop(0, "#000044");

  linGrad.addColorStop(0.5, "#220022");

  linGrad.addColorStop(1, "#000044");

  ctx.fillStyle = linGrad;

  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkBounds(obj) {
  if (obj.x + 10 > innerWidth) {
    obj.x = obj.x - innerWidth;
  }
  if (obj.x - 10 < 0) {
    obj.x = obj.x + innerWidth;
  }
  if (obj.y + 10 > innerHeight) {
    obj.y = obj.y - innerHeight;
  }
  if (obj.y - 10 < 0) {
    obj.y = obj.y + innerHeight;
  }
}

function scaling() {
  var size = Math.abs(Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy));
  //    console.log(size)
  return (size *= -0.01 / 4);
}

function thrusting() {
  var power = Math.abs(Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy));
  if (power <= 10) {
    power = 10;
  }
  power = power * -50;
  return (power += random(-30, 30));
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
var bulletSpeed = 3;
function Bullet(x, y, vx, vy, ax, ay, r) {
  this.x = ship.x;
  this.y = ship.y;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
  this.r = r;
}
Bullet.prototype.update = function() {
  this.ax *= bulletSpeed;
  this.ay *= bulletSpeed;
  this.vx += this.ax;
  this.vy += this.ay;
  this.x += this.vx;
  this.y += this.vy;
  this.r = this.r;
  this.move();
};
Bullet.prototype.move = function() {
  this.r = ship.r;
  newBullet = new Ship(
    newBullet.x,
    newBullet.y,
    newBullet.vx,
    newBullet.vy,
    newBullet.ax,
    newBullet.ay,
    newBullet.r
  );
  this.ax = Math.cos(this.r) * 3.75;
  this.ay = Math.sin(this.r) * 3.75;
  this.draw();
};

Bullet.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.r);
  ctx.scale(0.4, 0.4);
  ctx.beginPath();
  ctx.fillStyle = "#f20808";
  ctx.shadowColor = "#020808";
  ctx.shadowBlur = 15;
  ctx.fillRect(random(100, 230), 0, random(50, 100), 16);
  ctx.closePath();
  ctx.restore();
};

function fireGun() {
  newBullet = new Bullet(
    newBullet.x,
    newBullet.y,
    newBullet.vx,
    newBullet.vy,
    newBullet.ax,
    newBullet.ay,
    newBullet.r
  );
  allBullets.push(newBullet);
  if (allBullets.length >= 25) {
    allBullets.length = 0;
  }
}
