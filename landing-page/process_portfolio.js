const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'Foto', '19-22');
const destDir = path.join(__dirname, 'public', 'media', 'portfolio');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function run() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  let count = 0;
  
  // We need 16 horizontal images for the 4 columns
  for (const file of files) {
    if (count >= 16) break;
    
    const srcPath = path.join(srcDir, file);
    try {
      const metadata = await sharp(srcPath).metadata();
      // Check if horizontal
      if (metadata.width > metadata.height) {
        const outName = `h_port_${count + 1}.webp`;
        const destPath = path.join(destDir, outName);
        
        console.log(`Processing horizontal image: ${file} -> ${outName}`);
        
        await sharp(srcPath)
          .resize({ width: 1000, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(destPath);
          
        count++;
      }
    } catch(e) {
      console.log('Error processing ' + file);
    }
  }
}

run();
