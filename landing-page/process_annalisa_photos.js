const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseSourceDir = path.join(__dirname, 'public', 'media', 'Foto Landing Annalisa');
const baseDestDir = path.join(__dirname, 'public', 'media', 'albums');

const subfolders = [
  { name: 'Bellevue Syrene', slug: 'bellevue', title: 'Hotel Bellevue Syrene', subtitle: 'Dimora a Picco sul Mare — Sorrento' },
  { name: 'Capri', slug: 'capri', title: 'Capri', subtitle: 'Villa & Panorama a Capri' },
  { name: 'Castello Lancellotti', slug: 'lancellotti', title: 'Castello Lancellotti', subtitle: 'Dimora Storica — Lauro' },
  { name: 'Salone Margherita', slug: 'margherita', title: 'Salone Margherita', subtitle: 'Scenografia & Design — Napoli' },
  { name: 'Villa Campolieto', slug: 'campolieto', title: 'Villa Campolieto', subtitle: 'Residenza Vesuviana — Ercolano' },
  { name: 'Villa Eliana', slug: 'eliana', title: 'Villa Eliana', subtitle: 'Eleganza & Panorama — Sorrento' }
];

async function processFolder(folderName, slug) {
  const srcFolder = path.join(baseSourceDir, folderName);
  const destFolder = path.join(baseDestDir, slug);

  if (!fs.existsSync(srcFolder)) {
    console.error(`Source folder missing: ${srcFolder}`);
    return [];
  }

  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  const rawFiles = fs.readdirSync(srcFolder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  // Sort strictly numerically by the leading number (1, 2, 3, 4, 5...)
  rawFiles.sort((a, b) => {
    const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999', 10);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999', 10);
    return numA - numB;
  });

  const processedFiles = [];

  for (let i = 0; i < rawFiles.length; i++) {
    const filename = rawFiles[i];
    const srcPath = path.join(srcFolder, filename);
    const destName = `img_${i + 1}.webp`;
    const destPath = path.join(destFolder, destName);

    try {
      // 1. Optimize raw file in-place if oversized
      const tempSrc = srcPath + '.tmp';
      await sharp(srcPath)
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(tempSrc);

      fs.unlinkSync(srcPath);
      fs.renameSync(tempSrc, srcPath);

      // 2. Generate optimized WebP album file
      const metadata = await sharp(srcPath).metadata();
      const isVertical = (metadata.height || 0) > (metadata.width || 0);
      const aspectRatio = (metadata.width && metadata.height) ? (metadata.width / metadata.height) : 1;

      await sharp(srcPath)
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(destPath);

      processedFiles.push({
        src: `/media/albums/${slug}/${destName}`,
        width: metadata.width,
        height: metadata.height,
        isVertical,
        aspectRatio,
        originalName: filename
      });
      console.log(`[${slug}] Order ${i + 1}: ${filename} -> ${destName} (${isVertical ? 'Vertical' : 'Horizontal'})`);
    } catch (err) {
      console.error(`Error processing ${filename}:`, err);
    }
  }

  return processedFiles;
}

async function runAll() {
  const manifest = {};
  for (const item of subfolders) {
    const result = await processFolder(item.name, item.slug);
    manifest[item.slug] = {
      title: item.title,
      subtitle: item.subtitle,
      images: result
    };
  }
  fs.writeFileSync(path.join(baseDestDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Manifest written to public/media/albums/manifest.json');
}

runAll();
