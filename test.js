const Jimp = require("jimp");

async function filter() {
  // Load the image
  const image = await Jimp.read("./images/test-climb.jpg");

  // Define the array of points where you don't want the image to be grayscale

  const circles = [
    { centerX: 108.00000063578287, centerY: 428.33333269755036, radius: 10 },
    { centerX: 103.33333396911621, centerY: 419.33333269755036, radius: 10 },
    { centerX: 103.33333396911621, centerY: 411.9999993642171, radius: 10 },
    { centerX: 103.33333396911621, centerY: 407.66666603088373, radius: 10 },
    { centerX: 103.33333396911621, centerY: 402.66666603088373, radius: 10 },
    { centerX: 103.33333396911621, centerY: 391.66666603088373, radius: 10 },
    { centerX: 104.00000063578287, centerY: 374.66666603088373, radius: 10 },
    { centerX: 110.00000063578287, centerY: 351.66666603088373, radius: 10 },
    { centerX: 120.33333396911621, centerY: 325.9999993642171, radius: 10 },
    { centerX: 132.66666730244953, centerY: 303.66666603088373, radius: 10 },
    { centerX: 147.00000063578287, centerY: 285.3333326975504, radius: 10 },
    { centerX: 163.3333339691162, centerY: 269.66666603088373, radius: 10 },
    { centerX: 180.66666730244953, centerY: 256.66666603088373, radius: 10 },
    { centerX: 197.66666730244953, centerY: 248.33333269755042, radius: 10 },
    { centerX: 212.66666730244953, centerY: 246.66666603088373, radius: 10 },
    { centerX: 224.3333339691162, centerY: 249.66666603088373, radius: 10 },
    { centerX: 231.66666730244953, centerY: 261.66666603088373, radius: 10 },
    { centerX: 234.00000063578284, centerY: 278.3333326975504, radius: 10 },
    { centerX: 235.00000063578284, centerY: 298.9999993642171, radius: 10 },
    { centerX: 235.00000063578284, centerY: 324.66666603088373, radius: 10 },
    { centerX: 228.00000063578287, centerY: 356.66666603088373, radius: 10 },
    { centerX: 216.66666730244953, centerY: 391.66666603088373, radius: 10 },
    { centerX: 204.00000063578287, centerY: 423.33333269755036, radius: 10 },
    { centerX: 194.00000063578287, centerY: 446.9999993642171, radius: 10 },
    { centerX: 189.00000063578287, centerY: 460.66666603088373, radius: 10 },
    { centerX: 186.66666730244953, centerY: 464.66666603088373, radius: 10 },
  ];

  //   const circles = [
  //     { centerX: 20, centerY: 20, radius: 10 },
  //     { centerX: 50, centerY: 50, radius: 15 },
  //     { centerX: 80, centerY: 20, radius: 20 },
  //   ];

  const radius = 100;
  const centerX = 500;
  const centerY = 500;

  const canvasWidth = image.bitmap.width;
  const canvasHeight = image.bitmap.height;

  const circleArray = [];

  for (let x = 0; x < canvasWidth; x++) {
    circleArray[x] = [];
    for (let y = 0; y < canvasHeight; y++) {
      let pointInsideCircle = false;
      for (const circle of circles) {
        const distanceFromCenter = Math.sqrt(
          (x - circle.centerX) ** 2 + (y - circle.centerY) ** 2
        );
        if (distanceFromCenter <= circle.radius) {
          pointInsideCircle = true;
          break;
        }
      }
      if (pointInsideCircle) {
        circleArray[x][y] = 1; // 1 represents a point inside the circle
      } else {
        circleArray[x][y] = 0; // 0 represents a point outside the circle
      }
    }
  }

  // Loop through each pixel in the image and check if it's one of the points we want to keep in color
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    // const isPoint = points.some((point) => points <= x && points <= y);

    if (circleArray[x][y] === 0) {
      // If the pixel is not one of the points we want to keep in color, set its RGB values to the same grayscale value
      const grayscaleValue =
        image.bitmap.data[idx] * 0.299 +
        image.bitmap.data[idx + 1] * 0.587 +
        image.bitmap.data[idx + 2] * 0.114;
      image.bitmap.data[idx] = grayscaleValue; // Red
      image.bitmap.data[idx + 1] = grayscaleValue; // Green
      image.bitmap.data[idx + 2] = grayscaleValue; // Blue
    }
  });

  // Save the new image
  await image.writeAsync("./images/edited-test-climb.jpg");
}

filter();
