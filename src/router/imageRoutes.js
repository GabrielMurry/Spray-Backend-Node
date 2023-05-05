const express = require("express");
const router = express.Router();
const Jimp = require("jimp");

router.post("/", async (req, res) => {
  const { drawing, photo } = req.body; // get the base64 image data from the request body

  manipulateImage(drawing, photo, res);
});

async function manipulateImage(drawing, photo, res) {
  try {
    // have Jimp read the drawing
    const readDrawing = await Jimp.read(Buffer.from(drawing, "base64"));
    // have Jimp read the photo
    const readPhoto = await Jimp.read(Buffer.from(photo, "base64"));
    const readPhotoMask = await Jimp.read(Buffer.from(photo, "base64"));

    // resize readPhoto and readDrawing to same (and smaller) size
    // readDrawing.resize(1000, Jimp.AUTO);
    // readPhoto.resize(1000, Jimp.AUTO);

    // readPhoto.mask(readDrawing, 0, 0);
    // readDrawing.write("images/test.jpg");

    // readDrawing.greyscale();

    // readDrawing.convolute([
    //   // kernel: edge detection
    //   [-1, 0, -1],
    //   [0, 6, 0],
    //   [-1, 0, -1],
    // ]);

    // [-1, -1, -1],
    //   [-1, 8, -1],
    //   [-1, -1, -1],

    // readDrawing.scan(
    //   0,
    //   0,
    //   readDrawing.bitmap.width,
    //   readDrawing.bitmap.height,
    //   function (x, y, idx) {
    //     // if we are scanning our drawing objects
    //     if (readDrawing.bitmap.data[idx + 0] !== 255) {
    //       // North: if pixel above is not part of our drawing
    //       if (y - 1 >= 0) {
    //         const north = readDrawing.getPixelIndex(x, y - 1);
    //         if (readDrawing.bitmap.data[north + 0] === 255) {
    //           readDrawing.bitmap.data[idx + 0] = 0;
    //           readDrawing.bitmap.data[idx + 1] = 0;
    //           readDrawing.bitmap.data[idx + 2] = 0;
    //         }
    //       }
    //       // East: if pixel to the right is not part of our drawing
    //       if (x + 1 <= readDrawing.bitmap.width) {
    //         const east = readDrawing.getPixelIndex(x + 1, y);
    //         if (readDrawing.bitmap.data[east + 0] === 255) {
    //           readDrawing.bitmap.data[idx + 0] = 0;
    //           readDrawing.bitmap.data[idx + 1] = 0;
    //           readDrawing.bitmap.data[idx + 2] = 0;
    //         }
    //       }
    //       // South: if pixel below is not part of our drawing
    //       if (y + 1 <= readDrawing.bitmap.height) {
    //         const south = readDrawing.getPixelIndex(x, y + 1);
    //         if (readDrawing.bitmap.data[south + 0] === 255) {
    //           readDrawing.bitmap.data[idx + 0] = 0;
    //           readDrawing.bitmap.data[idx + 1] = 0;
    //           readDrawing.bitmap.data[idx + 2] = 0;
    //         }
    //       }
    //       // West: if pixel to the left is not part of our drawing
    //       if (x - 1 >= 0) {
    //         const west = readDrawing.getPixelIndex(x - 1, y);
    //         if (readDrawing.bitmap.data[west + 0] === 255) {
    //           readDrawing.bitmap.data[idx + 0] = 0;
    //           readDrawing.bitmap.data[idx + 1] = 0;
    //           readDrawing.bitmap.data[idx + 2] = 0;
    //         }
    //       }
    //     }
    //   }
    // );

    readPhotoMask.composite(readDrawing, 0, 0, {
      mode: Jimp.BLEND_HARDLIGHT,
      opacitySource: 1,
      opacityDest: 1,
    });

    readPhoto.scan(
      0,
      0,
      readPhoto.bitmap.width,
      readPhoto.bitmap.height,
      function (x, y, idx) {
        const total =
          readPhoto.bitmap.data[idx + 0] +
          readPhoto.bitmap.data[idx + 1] +
          readPhoto.bitmap.data[idx + 2];
        const averageColorValue = total / 3;
        const factor = 0.8; // Adjust this to control the amount of darkening
        readPhoto.bitmap.data[idx + 0] = averageColorValue * factor;
        readPhoto.bitmap.data[idx + 1] = averageColorValue * factor;
        readPhoto.bitmap.data[idx + 2] = averageColorValue * factor;
      }
    );

    readPhoto.composite(readPhotoMask, 0, 0, {
      mode: Jimp.BLEND_MULTIPLY,
      opacitySource: 1,
      opacityDest: 0.5,
    });

    // turn composited readDrawing back to base64
    const manipulatedBase64 = await readPhoto.getBase64Async(Jimp.MIME_PNG);
    res.send({ newImage: manipulatedBase64 });
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
