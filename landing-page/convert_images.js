/* eslint-disable */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = 'c:/Users/mario/Progetti Antigravity/sara-dangelo/WeTrasfer matrimoni nuovi/Castello lancellotti/Castello lancellotti/TOPTEN';
const targetDir = 'c:/Users/mario/Progetti Antigravity/sara-dangelo/public/media';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach(file => {
    if (file.match(/\.jpe?g$/i)) {
        const sourcePath = path.join(sourceDir, file);
        const outPath = path.join(targetDir, path.parse(file).name + '.webp');
        console.log(`Converting ${file} to WebP...`);
        sharp(sourcePath)
            .webp({ quality: 80 })
            .toFile(outPath)
            .then(() => console.log(`Done ${file}`))
            .catch(err => console.error(`Error ${file}:`, err));
    }
});
