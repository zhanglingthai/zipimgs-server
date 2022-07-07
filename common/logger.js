// 日志的封装
// 写入文件中 file-stream-rotator所有日志
var express = require('express');
var logger = require('morgan');
var fileStreamRotato = require('file-stream-rotator')
var app = express()
var accessLogStream = fileStreamRotato.getStream({
    filename: './logs/access/%DATE%.log',
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYYMMDD'
})

// 格式化日志输出格式  由于代码重复，对输出格式进行封装
function formatLog(tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        decodeURI(tokens.url(req, res)),
        JSON.stringify(req.body),
        JSON.stringify(res.locals.error),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}

const accessLog = (logger(function (tokens, req, res) {
    return formatLog(tokens, req, res)
}, {
    stream: accessLogStream,
    skip: function (req, res) {
        return res.statusCode >= 400
    }
}));

// 写入文件中 file-stream-rotator 错误日志
var accessLogStreamErr = fileStreamRotato.getStream({
    filename: './logs/err/%DATE%.log',
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYYMMDD'
})

const accessLogErr = (logger(function (tokens, req, res) {
    return formatLog(tokens, req, res)
}, {
    stream: accessLogStreamErr,
    skip: function (req, res) {
        return res.statusCode < 400
    }
}));

logger.accessLog = accessLog;
logger.accessLogErr = accessLogErr;

module.exports = logger;