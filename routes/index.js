var express = require('express');
var router = express.Router();
const { fileZip } = require("../controller");
const createError = require("http-errors");

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'zipimgs' });
// });


router.post('/getzip', async function (req, res, next) {
    const files = req.body.files || [];

    if (files.length == 0) {
        return next(createError(500, '缺少文件参数'));
    }

    try {
        const zipedFile = await fileZip({ files });
        console.log(zipedFile)
        res.json({})
    } catch (err) {
        console.log(err)
        next(createError(500, '压缩失败'));
    }

});

module.exports = router;
