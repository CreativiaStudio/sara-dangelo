const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseSourceDir = path.join(__dirname, 'public', 'media', 'Foto Landing Annalisa');
const baseDestDir = path.join(__dirname, 'public', 'media', 'albums');

const subfolders = [
  { name: 'Capri', slug: 'capri' },
  { name: 'Castello Lancellotti', slug: 'lancellotti' },
  { name: 'Salone Margherita', slug: 'margherita' },
  { name: 'Villa Campolieto', slug: 'campolieto' }
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

  const files = fs.readdirSync(srcFolder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const processedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const srcPath = path.join(srcFolder, filename);
    const destName = `img_${i + 1}.webp`;
    const destPath = path.join(destFolder, destName);

    try {
      await sharp(srcPath)
        .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destPath);

      processedFiles.push(`/media/albums/${slug}/${destName}`);
      console.log(`[${slug}] Processed ${filename} -> ${destName}`);
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
    manifest[item.slug] = result;
  }
  fs.writeFileSync(path.join(baseDestDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Manifest written to public/media/albums/manifest.json');
}

runAll();
