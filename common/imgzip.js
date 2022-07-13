const imagemin = require("imagemin");
const path = require("path");
//压缩插件

//svg
const imageminSvgo = require("imagemin-svgo");

//gif
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
  //兼容window，需要替换一次分隔符
  try {
    const file = await imagemin([filePath.replace(/\\/g, '/')], {
      destination: outputPath,
      plugins: [
        imageminSvgo({
          removeViewBox: false
        }),
        imageminGifsicle(
          {
            interlaced: true,
            optimizationLevel: 3
          }
        ),
        imageminMozjpeg({
          quality: 70,
          progressive: true
        }),
        imageminPngquant({
          quality: [0.65, 0.8],
        }),
      ],
    });

    return file[0];

  } catch (err) {
    throw new Error(err)
  }

};

module.exports = imgZip;
