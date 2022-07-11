var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { mkdirsSync } = require("../common/util");
const imgZip = require("../common/imgzip");

router.post("/", function (req, res, next) {
    try {
        const bb = busboy({ headers: req.headers });
        const callDate = moment().format("YYYY-MM-DD");//上传日期
        const callStamp = new Date().getTime().toString();//上传时间戳
        //存放的目录
        const saveDir = path.join(
            __dirname,
            "../public",
            "uploads",
            callDate,
            callStamp
        );
        mkdirsSync(saveDir);
        //输出的目录
        const outputDir = path.join(
            __dirname,
            "../public",
            "outputs",
            callDate,
            callStamp
        );
        mkdirsSync(outputDir);

        const filesArr = [];

        //有文件的走这边
        bb.on("file", (name, file, info) => {
            const { filename, encoding, mimeType } = info;

            const fileDetail = {
                mimeType,
                filename,
                uploadSize: 0,
                uploadPath: path.join(
                    "/uploads",
                    callDate,
                    callStamp,
                    filename,
                ),
                outputSize: 0,
                outputPath: path.join(
                    "/outputs",
                    callDate,
                    callStamp,
                    filename,
                )
            }

            const saveTo = path.join(saveDir, filename);
            file.pipe(fs.createWriteStream(saveTo));

            file
                .on("data", (data) => {
                    fileDetail.uploadSize += data.length;
                    //   console.log(`File [${name}] got ${data.length} bytes`);
                })
                .on("close", () => {
                    filesArr.push(fileDetail);
                });
        });

        //没文件的走这边
        bb.on("field", (name, val, info) => {
            // console.log(`Field [${name}]: value: %j`, val);
        });

        //整个表单结束
        bb.on("close", async () => {
            //等到都存好了以后，这边做图片压缩
            if (filesArr.length) {
                for (let i = 0; i < filesArr.length; i++) {
                    const file = filesArr[i];
                    const filename = file.filename;
                    const filePath = path.join(saveDir,filename);
                    const zipedFile = await imgZip(filePath,outputDir);
                    file.outputSize = zipedFile.data.length;
                }
                res.json({
                    success: true,
                    data: filesArr
                });
            } else {
                next(createError(500, 'no file upload'));
            }
        });

        req.pipe(bb);
    } catch (err) {
        next(createError(500, err));
    }
});

module.exports = router;

//https://blog.poetries.top/node-learning-notes/notes/koa2/-7.3%20%E5%BC%82%E6%AD%A5%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%AE%9E%E7%8E%B0.html#%E6%BA%90%E7%A0%81%E7%90%86%E8%A7%A3
