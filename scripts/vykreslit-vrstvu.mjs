// Pomocný renderer pro pripravit-vrstvy-pozadi.py; sharp je součástí závislostí Astro.
import sharp from 'sharp';

const [zdroj, cil] = process.argv.slice(2);
const { data, info } = await sharp(zdroj)
  .trim({ threshold: 0 })
  .png()
  .toBuffer({ resolveWithObject: true });
const vysledek = await sharp(data)
  .resize({ width: 960, withoutEnlargement: true })
  .webp({ quality: 85, alphaQuality: 100 })
  .toFile(cil);
process.stdout.write(JSON.stringify({
  width: vysledek.width,
  height: vysledek.height,
  sourceWidth: info.width,
  sourceHeight: info.height,
  left: -(info.trimOffsetLeft ?? 0),
  top: -(info.trimOffsetTop ?? 0),
}));
