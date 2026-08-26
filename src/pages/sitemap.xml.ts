import { getCollection } from 'astro:content';

const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://zahalka.cz';

export const prerender = true;

function escapeXml(hodnota: string) {
  return hodnota
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const akce = await getCollection('akce');
  const statickeCesty = ['/', '/program', '/tabor', '/o-nas', '/kontakt'];
  const cestyAkci = akce.map((polozka) => `/akce/${polozka.id}`);
  const cesty = [...statickeCesty, ...cestyAkci];

  const urlset = cesty
    .map((cesta) => `  <url><loc>${escapeXml(`${siteUrl}${cesta}`)}</loc></url>`)
    .join('\n');

  const obsah = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlset,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(obsah, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
