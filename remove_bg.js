const { Jimp } = require('jimp');

async function main() {
  try {
    const image = await Jimp.read("visual/logo Sara D'Angelo.png");
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    });
    await image.write("landing-page/public/media/logo.png");
    console.log("Background removed successfully!");
  } catch (error) {
    console.error("Error processing image:", error);
  }
}

main();
