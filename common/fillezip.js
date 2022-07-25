const jszip = require("jszip");
const path = require('path');
const fs = require('fs');
const zip = new jszip();


const fileZip = async (filePath, outputPath) => {
    pushZip(zip, path.resolve(__dirname, './test'));
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        fs.writeFile(path.resolve(__dirname, './output.zip'), content, err => {
            if (err) throw err;
            console.log('文件已被保存');
        });
    });

    function pushZip(floder, pPath) {
        const files = fs.readdirSync(pPath, { withFileTypes: true });
        files.forEach((dirent, index) => {
            let filePath = `${pPath}/${dirent.name}`;
            if (dirent.isDirectory()) {
                let zipFloder = zip.folder(filePath.replace(`${__dirname}\\prod/`, ''));
                pushZip(zipFloder, filePath);
            } else {
                floder.file(dirent.name, fs.readFileSync(filePath));
            }
        });
    }

}

module.exports = fileZip;

