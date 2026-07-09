const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'Visual', 'Icone');
const destDir = path.join(__dirname, 'public', 'media', 'icone');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function convertIcons() {
  const files = ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg'];
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file.replace('.jpeg', '.webp'));
    
    if (fs.existsSync(srcPath)) {
      console.log(`Converting ${file}...`);
      await sharp(srcPath)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true }) // reasonable size for icons
        .webp({ quality: 85 })
        .toFile(destPath);
      console.log(`Saved to ${destPath}`);
    } else {
      console.log(`File not found: ${srcPath}`);
    }
  }
}

convertIcons();
