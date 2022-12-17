var taskbar;
var ball;
let score = 0;
let life;
var heart = document.getElementById("heart");

// function first() {
// document.getElementById("boxPlay").style.width =
//   display.canvas.clientWidth + "px";
// }
// start game
function startGame() {
  display.start();
  taskbar = new createTask(0);
  ball = new createBall(100, 100);
}

// màn hình chơi
var display = {
  canvas: document.getElementById("screen"),
  start: function () {
    document.getElementById("no").style.display = "none";
    this.context = this.canvas.getContext("2d");
    this.inteval = setInterval(updateFame, 0);
    life = 3;
    score = 0;
    window.addEventListener("keydown", function (e) {
      display.key = e.keyCode;
    });
    window.addEventListener("keyup", function (e) {
      display.key = false;
    });
    if (this.canvas.offsetWidth >= window.innerWidth) {
      this.canvas.width = window.innerWidth;
    }
  },
  clear: function () {
    this.context.clearRect(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
  },
  stop: function () {
    clearInterval(this.inteval);
  },
};

// tạo thanh trượt
function createTask(x) {
  this.x = x;
  this.y = display.canvas.height - 150;
  this.w = display.canvas.width / 2;
  this.left = 0;
  this.right = 0;
  this.update = function () {
    ctx = display.context;
    // ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.w, 5);
  };
  this.newPos = function () {
    this.x += this.right;
    this.x -= this.left;
  };
}

// tạo ball
function createBall(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 1;
  // this.color = "#f2f";
  this.r = 10;
  this.update = function () {
    ctx = display.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  };
}

// reset ball
function resetBall() {
  min = display.canvas.offsetLeft;
  max = min + display.canvas.clientWidth - 30;
  ball.x = Math.floor(Math.random() * (max - min)) + 15;
  ball.y = 0;
}

// tạo score
function showScore() {
  ctx = display.context;
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 120, 100);
}

// show Game Over;
function gameOver() {
  ctx = display.context;
  ctx.font = "30px Arial";
  ctx.fillText("Game over", display.canvas.clientWidth / 4, 150);
  // document.getElementById("no").innerText = "PlatGame";
  document.getElementById("no").style.display = "block";
  document.getElementById("pause").style.display = "none";
}

// cập nhật khung hình
function updateFame() {
  left = taskbar.x;
  right = left + taskbar.w;
  taskbar.left = 0;
  taskbar.right = 0;
  display.clear();
  console.log(display.canvas.offsetLeft);
  document.getElementById("pause").style.top =
    display.canvas.offsetTop + 5 + "px";
  document.getElementById("pause").style.left =
    display.canvas.offsetLeft + "px";
  heart.style.top = display.canvas.offsetTop + 5 + "px";
  heart.style.left =
    display.canvas.offsetLeft + display.canvas.clientWidth - 70 + "px";
  heart.innerHTML = `<i class="fa-solid fa-heart "> ${life}</i>`;
  document.getElementById("pause").style.display = "block";

  if (ball.x > left && ball.x < right) {
    if (ball.y + ball.r >= taskbar.y) {
      score++;
      ball.speed += 0.01;
      resetBall();
      if (taskbar.w <= (display.canvas.clientWidth / 10) * 2) {
        taskbar.w = (display.canvas.clientWidth / 10) * 2;
      } else {
        taskbar.w -= 2;
      }
    }
  }

  // controller
  if (gameOVER()) {
    if (display.key && display.key == 37) {
      taskbar.left = 2;
    }
    if (display.key && display.key == 39) {
      taskbar.right = 2;
    }
    document.getElementById("screen").onmousemove = function (e) {
      left = display.canvas.offsetLeft;
      midTask = taskbar.w / 2;
      taskbar.x = e.pageX - left - midTask;
    };
    document.getElementById("screen").ontouchmove = function (e) {
      console.log(e.touches[0].clientX);
      left = display.canvas.offsetLeft;
      midTask = taskbar.w / 2;
      taskbar.x = e.touches[0].clientX - left - midTask;
    };
  }

  if (!gameOVER()) {
    life--;
    if (life <= 0) {
      gameOver();
      display.stop();
    } else {
      resetBall();
    }
  }

  if (taskbar.x <= 0) {
    taskbar.x = 0;
  }
  if (taskbar.x + taskbar.w >= 400) {
    taskbar.x = 400 - taskbar.w;
  }

  ball.y += ball.speed;
  ball.update();
  taskbar.newPos();
  taskbar.update();
  showScore();
}

// check gameOver
function gameOVER() {
  if (ball.y + ball.r > 595) {
    return false;
  } else return true;
}
