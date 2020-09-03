var WINDOW_WIDTH = 600;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
var COUNTS = [{ num: 3, color: '#ec0101' }, { num: 2, color: '#fddb3a' }, { num: 1, color: '#06623b' }];
var LAST = COUNTS[COUNTS.length - 1];
var COLORS = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];
var balls = []; // 爆炸小球数组

window.onload = function () {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  WINDOW_WIDTH = document.body.clientWidth;
  WINDOW_HEIGHT = document.body.clientHeight;

  RADIUS = Math.round(WINDOW_WIDTH / 100);
  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 2 - (RADIUS + 1) * 8);
  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 3);

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  function inter() {
    if (COUNTS.length) {
      const number = COUNTS.shift();
      renderCount(context, number);
      const a = setTimeout(() => {
        inter();
        clearTimeout(a);
      }, 1000);
    } else {
      numberBoom(context); // 数字原地爆炸
    }
  }

  inter();
}

// 渲染数字
function renderCount(context, number) {
  context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
  renderChar(context, DIGIT[number.num], number.color);
}

// 数字原地爆炸
function numberBoom(ctx) {
  addBalls(LAST.num); // 在最后一个数字的基础上出现五颜六色的小球

  let boom = setInterval(function() {
    renderBalls(ctx);
    updateBalls();

    if (balls.length <= 0) {
      renderBalls(ctx);
      clearInterval(boom);
      setTimeout(function() {
        renderStarSky(ctx);
      }, 88);
    }
  }, 50);
}

function addBalls(num) {
  for (let i = 0; i < DIGIT[num].length; i++) {
    for (let j = 0; j < DIGIT[num][i].length; j++) {
      if (DIGIT[num][i][j] === 1) {
        const aBall = {
          x: MARGIN_LEFT + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: MARGIN_TOP + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.8 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 50,
          vy: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 20,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        balls.push(aBall);
      }
    }
  }
}

// 渲染五颜六色的小球
function renderBalls(cxt) {
  cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

  for (let i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color;

    cxt.beginPath();
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    cxt.closePath();

    cxt.fill();
  }
}

// 小球抛物线运动
function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    const theBall = balls[i];
    theBall.x += theBall.vx;
    theBall.y += theBall.vy;
    theBall.vy += theBall.g;

    if (theBall.y >= WINDOW_HEIGHT - RADIUS) { // 触碰到底部
      theBall.y = WINDOW_HEIGHT - RADIUS;
      theBall.vy = - theBall.vy * 0.78;
    }
  }

  // 性能优化
  let cnt = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
      balls[cnt++] = balls[i]; // 保留在屏幕内的小球
    }
  }

  balls = balls.slice(0, cnt);
}

function renderStarSky(ctx) {
  let starsky = document.getElementById('starsky');
  RenderStarSky(starsky); // 渲染星空 star.js
  starsky.className = "animate__animated animate__fadeIn";
  starsky.addEventListener('animationend', function() {
    renderLove(ctx);
  });
}

// 表白部分
function renderLove(ctx) {
  const ask = document.querySelector('.ask');
  ask.className = "ask animate__animated animate__jackInTheBox";

  const love1 = document.getElementById('love1');
  const love2 = document.getElementById('love2');
  love1.className = `animate__animated animate__rotateIn`;
  love2.className = `animate__animated animate__rotateIn`;

  let radian = 0; // 设置初始弧度
  const radian_add = Math.PI / 30; // 设置弧度增量

  const marginTop = Math.round(WINDOW_HEIGHT / 2);
  const marginLeft = Math.round(WINDOW_WIDTH / 2);

  ctx.beginPath();
  ctx.translate(marginLeft, marginTop); // 设置绘图原点

  function heart() {
    radian += radian_add;
    X = getX(radian);
    Y = getY(radian);
    ctx.lineTo(X, Y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffc1f3"; //设置描边样式
    ctx.stroke(); //对路径描边
    if (radian <= (2*Math.PI)) { //绘制完整的心型线后取消间歇调用 
      requestAnimationFrame(heart);
    } else {
      love1.className = "animate__animated animate__heartBeat animate__infinite";
      love2.className = "animate__animated animate__heartBeat animate__infinite";
    }
  }
  heart();
  function getX(t) { //获取心型线的X坐标
    return 14 * (16 * Math.pow(Math.sin(t), 3))
  }

  function getY(t) { //获取心型线的Y坐标
    return -14 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  }
}

/**
* 
* @param {object} ctx 画布上下文
* @param {array} dots 点阵二维数组
* @param {string} color 图形颜色
*/
function renderChar(ctx, dots, color) {
  ctx.fillStyle = color || "skyblue";

  for (let i = 0; i < dots.length; i++) {
    for (let j = 0; j < dots[i].length; j++) {
      if (dots[i][j] === 1) { // 渲染圆点
        ctx.beginPath();
        ctx.arc(
          MARGIN_LEFT + (RADIUS + 1) + j * 2 * (RADIUS + 1),
          MARGIN_TOP + (RADIUS + 1) + i * 2 * (RADIUS + 1),
          RADIUS,
          0,
          2 * Math.PI,
        );
        ctx.closePath();

        ctx.fill();
      }
    }
  }
}