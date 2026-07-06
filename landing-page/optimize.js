const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, 'public', 'media');

async function optimizeImages() {
  const files = fs.readdirSync(mediaDir);
  let optimizedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      continue;
    }

    const filePath = path.join(mediaDir, file);
    const stats = fs.statSync(filePath);

    // Optimize images larger than 500 KB
    if (stats.size > 500 * 1024) {
      console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
      const tempPath = filePath + '.tmp';
      
      try {
        const buffer = fs.readFileSync(filePath);
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let pipeline = image;
        
        // Resize if it's too large
        if (metadata.width > 1920 || metadata.height > 1920) {
          pipeline = pipeline.resize({
            width: 1920,
            height: 1920,
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Compress based on format
        if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        } else if (ext === '.webp') {
          pipeline = pipeline.webp({ quality: 80 });
        } else if (ext === '.png') {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
        }

        await pipeline.toFile(tempPath);
        
        // Replace original with optimized version
        fs.renameSync(tempPath, filePath);
        
        const newStats = fs.statSync(filePath);
        console.log(`  -> Reduced to ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
        optimizedCount++;
      } catch (err) {
        console.error(`  -> Failed to optimize ${file}:`, err.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    } else {
      skippedCount++;
    }
  }

  console.log(`\nOptimization complete!`);
  console.log(`Optimized: ${optimizedCount} images`);
  console.log(`Skipped (already small): ${skippedCount} images`);
}

optimizeImages();
