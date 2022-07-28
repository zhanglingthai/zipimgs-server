const jszip = require("jszip");
const path = require('path');
const fs = require('fs');
const moment = require("moment");
const { mkdirsSync, rmdirsSync } = require("../common/util");

const FileZip = ({ files }) => {
    return new Promise((resolve, reject) => {
        const zip = new jszip();
        let filesObj = JSON.parse(files);
        const callDate = moment().format("YYYY-MM-DD"); //上传日期
        const callStamp = new Date().getTime().toString(); //上传时间戳

        //存放文件目录
        const saveDir = path.join(
            __dirname,
            "../public",
            "zipfiles",
            callDate,
            callStamp
        );

        mkdirsSync(saveDir);
        rmdirsSync(saveDir);

        for (let i = 0; i < filesObj.length; i++) {

            const file = filesObj[i];

            const filePath = path.join(
                __dirname,
                "../public",
                file.outputPath
            );

            zip.file(file.filename, fs.readFileSync(filePath));
        }

        zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        }).then(function(content) {
            fs.writeFile(path.resolve(saveDir, 'output.zip'), content, err => {
                if (err) throw err;
                resolve(`/zipfiles/${callDate}/${callStamp}/output.zip`)
            });
        }).catch(err => {
            reject(err);
        })
    })
}


module.exports = FileZip;