/** 
 * canvas 创建星空
 */

// requestAnimationFrame的向下兼容处理
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (fn) {
        setTimeout(fn, 17);
    };
}

// 定义变量
let canvas,
    context,
    screenW,
    screenH,
    stars = [];

// 定义常量
const numStars = 2000;

function RenderStarSky(starsky) {
    //获取canvas
    canvas = starsky;
    // 设置画布
    _renderSky();
    //获取canvas执行上下文
    context = canvas.getContext('2d');
    // ===========组件应用层============
    //创建星星
    for (let i = 0; i < numStars; i++) {
        let x = Math.round(Math.random() * screenW);
        let y = Math.round(Math.random() * screenH);
        let length = 1 + Math.random() * 2;
        let opacity = Math.random();

        // 创建星星实例
        let star = new Star(x, y, length, opacity);
        stars.push(star);
    }

    // 星星闪动
    _animate();
}

// ============组件定制层==============
/**
 * Star
 * 
 * @param int x
 * @param int y
 * @param int length
 * @param float opacity
 */

// 星星构造函数
function Star(x, y, length, opacity) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.length = parseInt(length);
    this.opacity = opacity;
    this.factor = 1;
    this.increment = Math.random() * 0.03;
}

//对象原型方法
/**
 * 画星星
 * 
 * @param context
 */
Star.prototype.draw = function (context) {
    context.rotate(Math.PI * 1 / 10);

    //save the context
    context.save();
    context.translate(this.x, this.y);
    //change the opacity
    if (this.opacity > 1) {
        this.factor = -1;
    } else if (this.opacity <= 0) {
        this.factor = 1;

        // 更新一次星星位置
        this.x = Math.round(Math.random() * screenW);
        this.y = Math.round(Math.random() * screenH);
    }

    // factor 控制方面，淡入淡出，每次重绘，星星的透明度都在变化
    this.opacity += this.increment * this.factor;

    context.beginPath();
    //画线
    for (var i = 5; i > 0; i--) {
        context.lineTo(0, this.length);
        context.translate(0, this.length);
        context.rotate(Math.PI * 2 / 10);
        context.lineTo(0, -this.length);
        context.translate(0, -this.length);
        context.rotate(-(Math.PI * 6 / 10));
    }

    context.lineTo(0, this.length);
    context.closePath();

    context.fillStyle = 'rgba(255,255,200, ' + this.opacity + ')';
    context.shadowBlur = 5;
    context.shadowColor = '#ffff33';
    context.fill();

    context.restore();
}

/**
 * 获取窗口大小信息
 */
function getScreenInfo() {
    //获取窗口宽度
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }

    //获取窗口高度
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }

    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement &&
        document.documentElement.clientHeight &&
        document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }

    // 将上述方法简化
    // screenW = window.innerWidth ||
    //     document.body.clientWidth ||
    //     document.documentElement.clientWidth;

    // screenH = window.innerHeight ||
    //     document.body.clientHeight ||
    //     document.documentElement.clientHeight;

    return {
        'winWidth': winWidth,
        'winHeight': winHeight
    }
}


/**
 * canvas设置，修复窗口变化，画布大小不变的问题
 */
function _renderSky() {
    //获取屏幕大小
    const size = getScreenInfo();
    screenW = size.winWidth;
    screenH = size.winHeight;

    canvas.width = screenW;
    canvas.height = screenH;

    window.addEventListener('resize', _renderSky);
}

/**
 * 星星闪动函数
 */
function _animate() {
    context.clearRect(0, 0, screenW, screenH);
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw(context);
    }
    requestAnimationFrame(_animate);
}