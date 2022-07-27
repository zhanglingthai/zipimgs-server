const jszip = require("jszip");
const path = require('path');
const fs = require('fs');

const FileZip = ({ files }) => {
    return new Promise((resolve, reject) => {
        const zip = new jszip();
        console.log(typeof(files))

        for (let i = 0; i < files.length; i++) {
            

            const file = files[i];
            
            if (file.success == true) {
                pushZip(zip, path.resolve(__dirname, file.outputPath))
                console.log(path.resolve(__dirname, file.outputPath))
            } else {
                continue;
            }
        }
        // pushZip(zip, path.resolve(__dirname, './test'));

        zip.generateAsync({
            type: 'nodebuffer',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        }).then(function (content) {
            console.log(content)
            
            fs.writeFile(path.resolve(__dirname, './output.zip'), content, err => {
                if (err) throw err;
                console.log('文件已被保存');
            });

            resolve(123)
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

    })
}


module.exports = FileZip;