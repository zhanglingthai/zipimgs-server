const imagemin = require("imagemin");
const { getSuffixName } = require("./util");
//压缩插件

//svg
const imageminSvgo = require("imagemin-svgo");

//gif
const imageminGifsicle = require("imagemin-gifsicle");

//jpg
const imageminMozjpeg = require("imagemin-mozjpeg");//渐进式jpg
// const imageminJpegtran = require("imagemin-jpegtran");//无损

//png
const imageminPngquant = require("imagemin-pngquant");
// const imageminOptipng = require("imagemin-optipng");


const imgZip = async (filePath, outputPath) => {

  file = await imagemin([filePath], {
    destination: outputPath,
    plugins: [
      imageminSvgo(),
      imageminGifsicle(),
      imageminMozjpeg(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });

  return file[0];

};

module.exports = imgZip;
