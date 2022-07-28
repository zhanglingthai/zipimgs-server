const fs = require("fs");
const path = require("path");

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dirname) {

    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }

}

/**
 * 同步删除文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function rmdirsSync(dirname, timer = 12 * 60 * 60 * 1000) {

    setTimeout(() => {
        let files = fs.readdirSync(dirname)
        for (var i = 0; i < files.length; i++) {
            let newPath = path.join(dirname, files[i]);
            let stat = fs.statSync(newPath)
            if (stat.isDirectory()) {
                //如果是文件夹就递归下去
                removeDir(newPath);
            } else {
                //删除文件
                fs.unlinkSync(newPath);
            }
        }
        fs.rmdirSync(dirname) //如果文件夹是空的，就将自己删除掉
    }, timer)

}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName) {
    let nameList = fileName.split(".");
    return nameList[nameList.length - 1];
}

module.exports = { mkdirsSync, getSuffixName, rmdirsSync };