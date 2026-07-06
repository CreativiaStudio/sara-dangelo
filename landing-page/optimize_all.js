/* eslint-disable */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi';
const targetDir = 'c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi_WebP';

function getAllFiles(dirPath, arrayOfFiles) {
  try {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      } else {
        if (file.match(/\.jpe?g$/i) || file.match(/\.png$/i)) {
          arrayOfFiles.push(path.join(dirPath, "/", file));
        }
      }
    });
  } catch(e) {}
  return arrayOfFiles;
}

const allImages = getAllFiles(baseDir);

async function processAll() {
  console.log(`Inizio ottimizzazione di massa per ${allImages.length} immagini...`);
  let count = 0;

  for (const imgPath of allImages) {
    // Calcoliamo il percorso relativo per mantenere la struttura delle sottocartelle
    const relativePath = path.relative(baseDir, imgPath);
    const parsedPath = path.parse(relativePath);
    
    // Ricreo la cartella di destinazione se non esiste
    const outDir = path.join(targetDir, parsedPath.dir);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    // Nome file finale in formato WebP
    const outName = parsedPath.name + '.webp';
    const outPath = path.join(outDir, outName);
    
    try {
      // Ottimizzazione estrema: max 1920px per monitor 4k, ma peso dimezzato
      await sharp(imgPath)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 }) // Effort 4 garantisce velocità e alta compressione
        .toFile(outPath);
      
      count++;
      if (count % 50 === 0) {
        console.log(`... Processate ${count} immagini su ${allImages.length}.`);
      }
    } catch (e) {
      console.error(`Errore con ${parsedPath.base}:`, e.message);
    }
  }

  console.log(`Lavoro terminato! ${count} foto salvate e ottimizzate in "${targetDir}".`);
}

processAll().catch(console.error);
