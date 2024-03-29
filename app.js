const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const cors = require("cors");

const indexRouter = require('./routes');
const uploadRouter = require('./routes/upload');

const logger = require('./common/logger');

const app = express();

// 去除x-powered-by
app.disable('x-powered-by');

// 处理跨域
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

//日志
if (process.env.NODE_ENV === 'development') {
  // 开发环境打印日志不保存
  app.use(logger('dev'));
} else {
  // 生产环境
  app.use(logger.accessLog);
  app.use(logger.accessLogErr);
}

//内置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//第三方中间件
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//route setup
app.use('/', indexRouter);
app.use('/upload', uploadRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'not found'));
});

// error handler
// development模式错误处理
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {

    // render the error page
    res.status(err.status || 500).json({
      success: false,
      status: err.status || 500,
      msg: err.stack
    })
  });
}

// production模式错误处理
app.use(function (err, req, res, next) {
  //locals给本地模版用的 可以直接调用message获取 写日志时候也能用
  res.locals.error = err;
  res.locals.errorMessage = err.message;
  res.locals.errorStack = err.stack;

  let status = err.status || 500;

  // render the error page
  res.status(status).json({
    success: false,
    status: status,
    msg: err.message
  });

});

module.exports = app;
