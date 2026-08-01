const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, 'public', 'media', 'Foto Landing Annalisa');

async function processDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath);
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      const tempPath = fullPath + '.tmp';
      try {
        await sharp(fullPath)
          .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toFile(tempPath);

        fs.unlinkSync(fullPath);
        fs.renameSync(tempPath, fullPath);
        console.log(`Optimized raw: ${entry.name}`);
      } catch (err) {
        console.error(`Error optimizing ${entry.name}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

processDir(targetDir).then(() => {
  console.log('Finished optimizing raw Annalisa folder!');
});
