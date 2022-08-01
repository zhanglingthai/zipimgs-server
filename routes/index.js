var express = require('express');
var router = express.Router();
const { fileZip } = require("../controller");
const createError = require("http-errors");
const path = require('path');
const fs = require('fs');

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'zipimgs' });
// });


router.post('/getzip', async function(req, res, next) {
    const files = req.body.files || [];

    if (files.length == 0) {
        return next(createError(500, '缺少文件参数'));
    }

    try {
        const zipedFilePath = await fileZip({ files });
        res.json({
            success: true,
            data: zipedFilePath
        });
    } catch (err) {
        process.env.NODE_ENV === 'development' && console.log(err);
        next(createError(500, err));
    }

});

module.exports = router;