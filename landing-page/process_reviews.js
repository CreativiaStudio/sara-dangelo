const fs=require('fs');
const path=require('path');
const sharp=require('sharp');

const srcDir=path.join(__dirname, '..', 'Foto', '19-22');
const destDir=path.join(__dirname, 'public', 'media', 'reviews');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

async function run(){
  const files=['IMG_7374.webp', '_MAS1998.webp', 'PIE_5726.webp'];
  let count=1;
  for(const file of files){
    try{
      await sharp(path.join(srcDir,file)).resize({height:800,withoutEnlargement:true}).webp({quality:80}).toFile(path.join(destDir,'review_'+count+'.webp'));
      console.log('Created review_'+count+'.webp from '+file);
      count++;
    }catch(e){
      console.error('Error on '+file, e)
    }
  }
}
run();
