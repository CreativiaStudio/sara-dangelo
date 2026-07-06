const { Jimp } = require('jimp');

async function main() {
  try {
    const image = await Jimp.read("../Riferimento di stile 1.jpeg");
    
    // Centers of each column
    const centersX = [128, 270, 415, 555];
    const startY = 380;
    const endY = 420; // Text starts around 410

    let id = 1;
    for (const cx of centersX) {
      const clone = image.clone();
      
      // Crop a very targeted area where ONLY the icon is, no text
      // We know icon is above text. Let's crop from 385 to 408 (height 23)
      clone.crop({ x: cx - 12, y: 385, w: 24, h: 23 });
      
      // Remove background
      clone.scan(0, 0, clone.bitmap.width, clone.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        if (r > 200 && g > 200 && b > 200) {
          this.bitmap.data[idx + 3] = 0; 
        } else {
          // Make gold much darker to be visible
          this.bitmap.data[idx + 0] = Math.max(0, r - 50);
          this.bitmap.data[idx + 1] = Math.max(0, g - 50);
          this.bitmap.data[idx + 2] = Math.max(0, b - 50);
          this.bitmap.data[idx + 3] = 255;
        }
      });

      await clone.write(`public/media/icon${id}-v3.png`);
      console.log(`Saved icon${id}-v3.png`);
      id++;
    }
  } catch (error) {
    console.error(error);
  }
}

main();
