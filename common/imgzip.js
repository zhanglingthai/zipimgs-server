const imagemin = require("imagemin");
const { getSuffixName } = require("./util");
const path = require("path");
//压缩插件

//svg
const imageminSvgo = require("imagemin-svgo");

//gif
//const imageminGiflossy = require("imagemin-giflossy");
const imageminGifsicle = require("imagemin-gifsicle");//无损

//jpg
const imageminMozjpeg = require("imagemin-mozjpeg");//渐进式jpg
// const imageminJpegtran = require("imagemin-jpegtran");//无损

//png
const imageminPngquant = require("imagemin-pngquant");
// const imageminOptipng = require("imagemin-optipng");//无损

//webp
//const imageminWebp = require("imagemin-webp");



const imgZip = async (filePath, outputPath) => {
  const file = await imagemin([filePath.replace(/\\/g, '/')], {
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
