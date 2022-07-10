const fs = require('fs');
const path = require('path');

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



module.exports = { mkdirsSync };