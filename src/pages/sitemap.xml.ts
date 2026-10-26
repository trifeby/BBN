import type {APIRoute} from 'astro';
import {getStories} from '../lib/content';
const pages=['/','/tentang/','/program/','/cerita/','/jejak-karya/','/kolaborasi/','/privasi/'];
export const GET: APIRoute = async ({site}) => {
  const base = site || new URL('https://example.org');
  const stories = await getStories();
  const paths=[...pages,...stories.map(s=>`/cerita/${encodeURIComponent(s.slug)}/`)];
  const content=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${new URL(path,base).toString().replace(/&/g,'&amp;')}</loc></url>`).join('')}</urlset>`;
  return new Response(content,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
