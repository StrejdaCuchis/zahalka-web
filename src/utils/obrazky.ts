import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

export interface RozmeryObrazku {
  width: number;
  height: number;
}

function rozmeryJpeg(buffer: Buffer): RozmeryObrazku | undefined {
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const delka = buffer.readUInt16BE(offset + 2);
    const jeSof = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker);

    if (jeSof) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    if (!delka) break;
    offset += 2 + delka;
  }
}

function rozmeryWebp(buffer: Buffer): RozmeryObrazku | undefined {
  const typ = buffer.toString('ascii', 12, 16);

  if (typ === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (typ === 'VP8 ' && buffer.toString('hex', 23, 26) === '9d012a') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (typ === 'VP8L') {
    const bity = buffer.readUInt32LE(21);
    return {
      width: 1 + (bity & 0x3fff),
      height: 1 + ((bity >>> 14) & 0x3fff),
    };
  }
}

export async function rozmeryVerejnehoObrazku(src: string): Promise<RozmeryObrazku> {
  const vychozi = { width: 1200, height: 1500 };
  if (!src.startsWith('/') || src.includes('..')) return vychozi;

  try {
    const cesta = join(process.cwd(), 'public', src.slice(1));
    const buffer = await readFile(cesta);
    const pripona = extname(cesta).toLowerCase();

    if (pripona === '.png' && buffer.toString('ascii', 1, 4) === 'PNG') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }

    if ((pripona === '.jpg' || pripona === '.jpeg') && buffer[0] === 0xff && buffer[1] === 0xd8) {
      return rozmeryJpeg(buffer) ?? vychozi;
    }

    if (pripona === '.webp' && buffer.toString('ascii', 0, 4) === 'RIFF') {
      return rozmeryWebp(buffer) ?? vychozi;
    }
  } catch {
    // Obsahová validace zachytí chybějící soubor při vizuální kontrole sestavení.
  }

  return vychozi;
}
