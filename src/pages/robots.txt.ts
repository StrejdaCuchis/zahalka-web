const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://zahalka.cz';

export const prerender = true;

export function GET() {
  const obsah = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(obsah, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
