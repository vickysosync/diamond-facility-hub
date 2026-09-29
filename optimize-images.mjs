import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve(process.cwd(), 'public/images');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const ext = path.extname(entry.name).toLowerCase();
      const baseName = path.basename(entry.name, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);

      const statBefore = fs.statSync(fullPath);
      console.log(`Processing: ${entry.name} (${(statBefore.size / 1024).toFixed(1)} KB)...`);

      try {
        const image = sharp(fullPath);
        const metadata = await image.metadata();

        let pipeline = sharp(fullPath);
        if (metadata.width && metadata.width > 1920) {
          pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
        }

        // Generate high quality, low footprint WebP
        await pipeline
          .webp({ quality: 82, effort: 5 })
          .toFile(webpPath);

        const statAfter = fs.statSync(webpPath);
        console.log(`  -> Generated ${baseName}.webp: ${(statAfter.size / 1024).toFixed(1)} KB (Saved: ${((1 - statAfter.size / statBefore.size) * 100).toFixed(1)}%)`);

        // Also compress the original PNG/JPG in place for any direct links
        if (ext === '.png' && statBefore.size > 200 * 1024) {
          const tempPng = path.join(dir, `${baseName}_temp.png`);
          await sharp(fullPath)
            .resize(1920, null, { withoutEnlargement: true })
            .png({ quality: 80, compressionLevel: 8 })
            .toFile(tempPng);
          fs.renameSync(tempPng, fullPath);
        } else if ((ext === '.jpg' || ext === '.jpeg') && statBefore.size > 200 * 1024) {
          const tempJpg = path.join(dir, `${baseName}_temp.jpg`);
          await sharp(fullPath)
            .resize(1920, null, { withoutEnlargement: true })
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(tempJpg);
          fs.renameSync(tempJpg, fullPath);
        }
      } catch (err) {
        console.error(`Error processing ${entry.name}:`, err);
      }
    }
  }
}

async function run() {
  console.log("Starting Image Optimization...");
  await processDirectory(imagesDir);
  console.log("Optimization complete!");
}

run();
