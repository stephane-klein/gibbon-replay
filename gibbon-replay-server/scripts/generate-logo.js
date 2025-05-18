#!/usr/bin/env node
import sharp from 'sharp';
import path from 'path';

const inputPath = "../assets/gibbon-replay-250x250.png";
const outputDir = "./static";
const normalWidth = 50;
const normalHeight = 50;

async function convertToLogo() {
  const baseFilename = "logo-gibbon-replay";
  
  console.log(`Converting ${inputPath} to logos...`);
  
  await sharp(inputPath)
    .resize(normalWidth, normalHeight, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${baseFilename}.webp`));
  
  console.log(`Normal version created: ${outputDir}/${baseFilename}.webp`);

  await sharp(inputPath)
    .resize(normalWidth * 2, normalHeight * 2, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${baseFilename}@2x.webp`));
  
  console.log(`Retina version created: ${outputDir}/${baseFilename}@2x.webp`);
  console.log('Conversion completed successfully!');
}

convertToLogo().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});

