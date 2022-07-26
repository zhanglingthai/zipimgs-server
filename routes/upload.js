var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { mkdirsSync } = require("../common/util");
const imgZip = require("../common/imgzip");
const { getSuffixName } = require("../common/util");

router.post("/", function (req, res, next) {
    try {
        const bb = busboy({
            headers: req.headers,
            limits: {
                fields: 99,
                fileSize: 5 * 1024 * 1024,//单文件最大5M
                files: 16,//最多10个文件
            }
        });
        const limitTypes = ['jpg', 'png', 'gif', 'svg'];//限制格式
        const callDate = moment().format("YYYY-MM-DD");//上传日期
        const callStamp = new Date().getTime().toString();//上传时间戳

        //存放文件目录
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

        const filesArr = [];//返回用户的数据

        //有文件的走这边
        bb.on("file", (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            const fileDetail = {
                mimeType,
                filename,
                uploadSize: 0,
                uploadPath: `/uploads/${callDate}/${callStamp}/${filename}`,
                outputSize: 0,
                outputPath: `/outputs/${callDate}/${callStamp}/${filename}`,
            }

            if (limitTypes.indexOf(getSuffixName(filename)) > -1) {

                file
                    .on('limit', function () {
                        //Clear variables
                        console.log('limit')
                    })
                    .on("data", (data) => {
                        fileDetail.uploadSize += data.length;
                        //   console.log(`File [${name}] got ${data.length} bytes`);
                    })
                    .on("close", () => {
                        filesArr.push(fileDetail);
                    });

                const saveTo = path.join(saveDir, filename);
                file.pipe(fs.createWriteStream(saveTo));

            } else {
                file.resume();
            }

        });

        //没文件的走这边
        bb.on("field", (name, val, info) => {
            // console.log(`Field [${name}]: value: %j`, val);
        });

        // bb.on("filesLimit",()=>{
        //    console.log('files数量超过限制了')
        // })

        // bb.on("fieldsLimit",()=>{
        //     console.log("fields数量超过限制了")
        // })

        //整个表单结束
        bb.on("close", async () => {
            //等到都存好了以后，这边做图片压缩
            if (filesArr.length) {
                for (let i = 0; i < filesArr.length; i++) {
                    const file = filesArr[i];
                    const filename = file.filename;
                    const filePath = path.join(saveDir, filename);
                    try {
                        const zipedImg = await imgZip(filePath, outputDir);
                        file.outputSize = zipedImg?.data?.length;
                        file.success = true;
                    } catch (err) {
                        file.msg = 'zip failed';
                        file.success = false;
                    }
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