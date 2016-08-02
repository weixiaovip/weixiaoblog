var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); //网页logo中间件处理函数
var logger = require('morgan'); //用来记录访问请求的
var session = require('express-session'); //express中的session中间件处理函数
//connect-mongo是用来将connect的session持久化到mongodb中的
var MongoStore = require('connect-mongo')(session); //用来将connect的session持久化到mongodb中的
var cookieParser = require('cookie-parser'); //req.cookies
var bodyParser = require('body-parser'); //请求主体 req.body
var flash = require('connect-flash'); //用来设置session中只使用一次的值，使用一次后自动销毁
var settings = require('./settings'); //读取配置文件中的信息
require('./db'); //引入数据库处理文件（引入会自动执行）

var routes = require('./routes/index'); //'/'请求的处理文件
var user = require('./routes/user'); // '/user'请求的处理文件
var article = require('./routes/article'); //'/article'请求的处理文件

//app是监听函数
var app = express(); //生成server处理函数app

// view engine setup
app.set('views', path.join(__dirname, 'views')); //设置模板路径
app.set('view engine', 'html'); //设置模板引擎为html
app.engine('html', require('ejs').__express);


// uncomment after placing your favicon in /public
// 把favicon.ico文件放在 public目录下，然后放开下面注释
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //记录请求的中间件，并指定格式
app.use(bodyParser.json()); //请求主体是json时，解析后放到req.body上
app.use(bodyParser.urlencoded({extended: false})); //请求是键值对的时候，解析false表示用用自己的方法解析
app.use(cookieParser()); //req.cookies
app.use(session({ //当使用此中间件以后会在req上多一个session属性
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    resave: true,
    saveUninitialized: true,
    //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，（把session存入数据库和从数据库中读取session是这个指定的）
    //以避免重启服务器时会话丢失
    store: new MongoStore({//指定保存的位置
        url: settings.url
    })
}));
//flash()需要依赖session中间件，因此放在session中间件之后
app.use(flash());
//把渲染每个模板都需要的信息，提前传入
app.use(function (req, res, next) {
    // res.locals是真正用来渲染模板的对象
    res.locals.user = req.session.user;//把session中的user对象先传入要渲染的页面模板中
    //只有重定向之前才给flash赋值，所以这里req.flash中可以取到
    res.locals.success = req.flash('success').toString(); //一个类型的flash数据可以有多条,是数组，因此转为字符串
    res.locals.error = req.flash('error').toString();
    console.log('flash',req.flash('success'));
    next();
});
app.use(express.static(path.join(__dirname, 'public'))); //静态文件

//处理路径以'/'开头
app.use('/', routes);
app.use('/user', user);
app.use('/article', article);

// catch 404 and forward to error handler
// 捕获 404 错误并且转向错误处理中间件
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers //错误处理

// development error handler //开发环境错误处理
// will print stacktrace 将打印堆栈信息
// env是读取的环境变量中的NODE_ENV(express模块中的applications.js文件中指定的)
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) { //express模块做了处理，错误处理中间件（4个参数的）不会被默认执行
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler //生产环境错误处理
// no stacktraces leaked to user //不要向用户暴露堆栈信息
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
