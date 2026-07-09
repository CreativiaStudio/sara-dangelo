const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const srcDir=path.join(__dirname, '..', 'Foto', '19-22');
const destDir=path.join(__dirname, 'public', 'media', 'portfolio');

async function run(){
  const files=['_MAS1197.webp', 'IMG_9820.webp', "Sara D'angelo  (87).webp"];
  let count=3;
  for(const file of files){
    try{
      await sharp(path.join(srcDir,file)).resize({width:1200,withoutEnlargement:true}).webp({quality:80}).toFile(path.join(destDir,'_NEW_'+count+'.webp'));
      console.log('Created _NEW_'+count+'.webp from '+file);
      count++;
    }catch(e){
      console.error('Error on '+file, e)
    }
  }
}
run();
