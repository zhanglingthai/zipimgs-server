var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const busboy = require('busboy');
const path = require('path')
const fs = require('fs')

router.post('/', function (req, res, next) {

    try {
        const bb = busboy({ headers: req.headers });

        bb.on('file', (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            console.log(
                `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
                filename,
                encoding,
                mimeType
            );

            file.on('data', (data) => {
                console.log(`File [${name}] got ${data.length} bytes`);
            }).on('close', () => {
                console.log(`File [${name}] done`);
            });

            const saveTo = path.join(__dirname, '../', 'uploads', filename);
            file.pipe(fs.createWriteStream(saveTo));
        });

        bb.on('field', (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });

        bb.on('close', () => {
            res.json({
                success: true
            });
        });

        req.pipe(bb);
    } catch (err) {
        next(createError(500, err));
    }
});

module.exports = router;

//https://blog.poetries.top/node-learning-notes/notes/koa2/-7.3%20%E5%BC%82%E6%AD%A5%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%AE%9E%E7%8E%B0.html#%E6%BA%90%E7%A0%81%E7%90%86%E8%A7%A3
