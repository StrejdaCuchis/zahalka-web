import { defineMiddleware } from 'astro:middleware';
import { upravHtmlTypografii } from './utils/typografie-html';

export const onRequest = defineMiddleware(async (_context, next) => {
  const odpoved = await next();
  const contentType = odpoved.headers.get('content-type') ?? '';

  if (!contentType.includes('text/html') || odpoved.status === 204 || odpoved.status === 304) {
    return odpoved;
  }

  const html = await odpoved.text();
  const hlavicky = new Headers(odpoved.headers);
  hlavicky.delete('content-length');

  return new Response(upravHtmlTypografii(html), {
    status: odpoved.status,
    statusText: odpoved.statusText,
    headers: hlavicky,
  });
});
